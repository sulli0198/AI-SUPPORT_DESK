import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 401 }
      );
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    
    return Response.json({ user, token });
  } catch (error) {
    return Response.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    );
  }
}