import { inngest } from "../client.js";
import { prisma } from "@/lib/prisma.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "@/lib/mailer.js";
import analyzeTicket from "@/lib/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      const ticketIdNum = parseInt(ticketId);
      
      
      // Fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await prisma.ticket.findUnique({
          where: { id: ticketIdNum }
        });
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });
      
      await step.run("update-ticket-status", async () => {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: "TODO" }
        });
      });
      
      const aiResponse = await analyzeTicket(ticket);
      
      const relatedSkills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              priority: !["low", "medium", "high"].includes(aiResponse.priority)
                ? "medium"
                : aiResponse.priority,
              helpfulNotes: aiResponse.helpfulNotes,
              status: "IN_PROGRESS",
              relatedSkills: aiResponse.relatedSkills,
            }
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });
      
      const moderator = await step.run("assign-moderator", async () => {
        // Try to find moderator with matching skills
        let user = null;
        
        if (relatedSkills.length > 0) {
          const users = await prisma.user.findMany({
            where: {
              role: "moderator",
              skills: {
                hasSome: relatedSkills
              }
            }
          });
          user = users[0] || null;
        }
        
        // Fallback to admin if no moderator found
        if (!user) {
          user = await prisma.user.findFirst({
            where: { role: "admin" }
          });
        }
        
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { assignedTo: user?.id || null }
        });
        
        return user;
      });
      
      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await prisma.ticket.findUnique({
            where: { id: ticket.id }
          });
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket is assigned to you: ${finalTicket.title}`
          );
        }
      });
      
      return { success: true };
    } catch (err) {
      console.error("❌ Error running the step", err.message);
      return { success: false };
    }
  }
);