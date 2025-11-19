// Handles:
// POST /api/tickets - Create new ticket
// GET /api/tickets - Get ALL tickets

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// POST /api/tickets - Create ticket
export async function POST(request) {
  try {
    const user = authenticate(request);
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Create ticket with Prisma
    // 🎯 THIS LINE SAVES TO DATABASE:
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        createdBy: user.id, // Using id (not _id like MongoDB)
        status: "TODO",
        priority: "medium"
      }
    });

    // Send to Inngest for AI processing
    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket.id.toString(),
        title,
        description,
        createdBy: user.id.toString(),
      },
    });

    return Response.json(
      { 
        message: "Ticket created and processing started",
        ticket: newTicket 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating ticket", error.message);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/tickets - Get all tickets
export async function GET(request) {
  try {
    const user = authenticate(request);
    let tickets = [];

    if (user.role !== "user") {
      // Admin/Moderator - see all tickets with assignee info
      tickets = await prisma.ticket.findMany({
        include: {
          assignee: {
            select: {
              id: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

    } else {
      // Regular user - only see their own tickets
      tickets = await prisma.ticket.findMany({
        where: { createdBy: user.id },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          priority: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return Response.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}