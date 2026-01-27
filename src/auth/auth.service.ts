import type { ILoginPayload, IRegisterPayload } from "./auth.type.js";
import User from "./auth.model.js";
import bcrypt from "bcrypt";
import { jwtService } from "../utils/jwt.js";

export const authService = {
    loginService: async (userData: ILoginPayload) => {
        if (!userData.email || !userData.password) {
            throw new Error("Email and password required");
        }
        // check if the user exists
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
            throw new Error("User does not exist");
        }

        // compare the password
        const isPasswordValid = await bcrypt.compare(
            userData.password as string,
            existingUser.password,
        );
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        //generate JWT token

        let userDetails: any = {
            email: existingUser.email,
            id: existingUser._id.toString(),
        };

        const token = jwtService.generateToken(userDetails);
        userDetails = { ...userDetails, token, name: existingUser.name, phone: existingUser.phone };

        return userDetails;
    },

    registerService: async (userData: IRegisterPayload) => {
        // check if the email is already registered

        if (
            !userData.email ||
            !userData.password ||
            !userData.name ||
            !userData.phone
        ) {
            throw new Error("Insufficient data provided");
        }

        const isDuplicateUser = await User.findOne({ email: userData.email });
        if (isDuplicateUser != null) {
            throw new Error("User already exists");
        }
        // hash the password before saving
        const hashedPasssword = await bcrypt.hash(userData.password as string, 10);
        const newUser = new User({
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            password: hashedPasssword,
        });
        await newUser.save();
        return newUser;
    },
};
