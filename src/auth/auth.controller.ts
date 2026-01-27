import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

export const authController = {
    loginController: async (req:Request, res:Response) => {
        try {
            const {email, password} = req.body;
            const user = await authService.loginService({email, password});
            res.cookie("token", user.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax", // or strict (depends on flows)
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            });
            const response = {
                email: user.email,
                id: user.id,
                name: user.name,
                phone: user.phone
            }
            res.status(200).json({message: "Login successful", response});
        } catch (error) {
            res.status(400).json({message: (error as Error).message});
        }
    },
    registerController: async (req:Request, res:Response) => {
        try {
            const {email, password, name, phone} = req.body;
            const user = await authService.registerService({email, password, name, phone});
            res.status(200).json({message: "Registration successful"});
        } catch (error) {
            res.status(400).json({message: (error as Error).message});
        }
    },
    logoutController: async (req:Request, res:Response) => {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });
            res.status(200).json({message: "Logout successful"});
        } catch (error) {
            res.status(400).json({message: (error as Error).message});
        }           
    }
}