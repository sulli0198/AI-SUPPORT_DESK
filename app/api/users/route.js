import { prisma } from "@/lib/prisma";
import { authenticate } from "../../../lib/auth";

// GET all users (admin only)
export async function GET(request) {
  try {
    // Use authenticate function only
    const user = authenticate(request);
    
    if (user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        skills: true,
        createdAt: true,
      }
    });
    
    return Response.json(users);
  } catch (error) {
    if (error.message.includes("Access Denied") || error.message.includes("Invalid token")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}

// PUT/PATCH update user (admin only)
export async function PUT(request) {
  try {
    // Use authenticate function only
    const user = await authenticate(request);
    
    if (user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { skills = [], role, email } = await request.json();
    
    const userToUpdate = await prisma.user.findUnique({ where: { email } });
    
    if (!userToUpdate) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    
    await prisma.user.update({
      where: { email },
      data: {
        skills: skills.length ? skills : userToUpdate.skills,
        role
      }
    });
    
    return Response.json({ message: "User updated successfully" });
  } catch (error) {
    if (error.message.includes("Access Denied") || error.message.includes("Invalid token")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}