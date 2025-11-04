import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET);
    
    return Response.json({ message: "Logout successfully" });
  } catch (error) {
    return Response.json(
      { error: "Logout failed", details: error.message },
      { status: 500 }
    );
  }
}