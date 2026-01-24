import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { jwtService } from "../utils/jwt.js";
import type { IJwtPayload } from "../auth/auth.type.js";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const headerToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies?.token;

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded as IJwtPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
