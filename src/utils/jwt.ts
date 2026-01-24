import { create } from "node:domain";
import type { IJwtPayload } from "../auth/auth.type.js";
import Jwt from "jsonwebtoken";

export const jwtService = {
    generateToken: (payload:IJwtPayload) => {
        return Jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: '1h'});
    },
    verifyToken: (payload:string) => {
        return Jwt.verify(payload, process.env.JWT_SECRET as string);
    }
}