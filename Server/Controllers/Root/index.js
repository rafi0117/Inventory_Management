import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import config from "config";

import randomString from "../../Utils/Randomstring/index.js";

// Import Models
import Users from "../../Model/Users/index.js";
import Admin from "../../Model/Admin/index.js";
import Components from "../../Model/Components/index.js";

//Import Validations
import { loginValidation, userRegisterValidatorRules, errorMiddleware } from "../../Middlewares/Validation/index.js";

// Import Generate Token
import generateToken from "../../Middlewares/Auth/generateToken.js";
import authMiddleware from "../../Middlewares/Auth/verifyToken.js";
// import Components from "../../Model/Components/index.js";

const router = express.Router();

router.post("/login", loginValidation(), errorMiddleware, async (req, res) => {
    try {
        let { email, password } = req.body;
        console.log(req.body);

        let userFound = await Admin.findOne({ email })
        if (!userFound) {
            userFound = await Users.findOne({ email })
            if (!userFound) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
        }

        let matchPassword = await bcrypt.compare(password, userFound.password)
        console.log(matchPassword);

        let payload = {
            _id : userFound._id,
            role : userFound.role
        }

        let privatekey = config.get("PRIVATE_KEY");

        //Generate a Token

        const token = generateToken(payload);
        // console.log(token);

        res.status(200).json({ success : "Login is Successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error "})
    }
})

/*
End Point : /api/auth
Method GET
Access : Public
 Description: Authorize the User
*/

router.get("/auth", async (req, res) => {
    try {
        let token = req.headers["auth-token"];
        if(!token) {
            return res.status(401).json({ error : "Unauthorised Access" })
        }
        let privatekey = config.get("PRIVATE_KEY");
        let payload = jwt.verify(token, privatekey);
        res.status(200).json({ success : "Authentication Successful", payload })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "Internal Server Error" });
    }
})

export default router;