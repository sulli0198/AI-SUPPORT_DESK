import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function POST(request) {
  try {
    const { email, password, skills = [] } = await request.json();
    
    const hashed = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashed, skills }
    });
    
    await inngest.send({
      name: "user/signup",
      data: { email },
    });
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    
    return Response.json({ user, token });
  } catch (error) {
    return Response.json(
      { error: "Signup failed", details: error.message },
      { status: 500 }
    );
  }
}