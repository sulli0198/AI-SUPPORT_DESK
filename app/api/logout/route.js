import { authenticate } from "@/lib/auth";

export async function POST(request) {
  try {
    authenticate(request); // This already does all the checking!
    
    return Response.json({ message: "Logout successfully" });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 401 }
    );
  }
}