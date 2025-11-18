// Handles:
// GET /api/tickets/- Get SINGLE ticket by ID
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET /api/tickets/[id] - Get single ticket
export async function GET(request, { params }) {
  try {
    const user = authenticate(request);
    const { id } = params;
    let ticket;

    if (user.role !== "user") {
      // Admin/Moderator - see any ticket with assignee info
      ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(id) },
        include: {
          assignee: {
            select: {
              id: true,
              email: true,
            }
          }
        }
      });
    } else {
      // Regular user - only see their own ticket
      ticket = await prisma.ticket.findFirst({
        where: { 
          id: parseInt(id),
          createdBy: user.id 
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          priority: true
        }
      });
    }

    if (!ticket) {
      return Response.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}