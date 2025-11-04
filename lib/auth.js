import jwt from "jsonwebtoken";

export const authenticate = (request) => {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    throw new Error("Access Denied. No token found.");
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    throw new Error("Access Denied. No token found.");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Returns { id, role }
  } catch (error) {
    throw new Error("Invalid token");
  }
};