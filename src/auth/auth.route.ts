import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/login", authController.loginController)
authRouter.post("/register", authController.registerController)
authRouter.get("/logout", authController.logoutController)

authRouter.post("/forget-password", (req, res) => {
    console.log(req.body)
})

export default authRouter;