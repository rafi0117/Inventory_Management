import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";

import randomString from "../../Utils/Randomstring/index.js";

import generateToken from "../../Middlewares/Auth/generateToken.js";

import Admin from "../../Model/Admin/index.js";
import Users from "../../Model/Users/index.js";
import components from "../../Model/Components/index.js";

import authMiddleware from "../../Middlewares/Auth/verifyToken.js";
import { userRegisterValidatorRules, loginValidation, errorMiddleware, componentValidation } from "../../Middlewares/Validation/index.js";

const router = express.Router();

router.post("/login", loginValidation(), errorMiddleware, async (req, res) => {
    try {
        let { email, password } = req.body;
        // console.log(req.body);

        let userFound = await Users.findOne({ email })
        if (!userFound) {
            return res.status(401).json({ error : "Invalid Credentials" })
        }
        console.log(userFound);

        let matchPassword = await bcrypt.compare(password, userFound.password)
        console.log(matchPassword);
        if (!matchPassword) {
            return res.status(401).jsom({ "error" : "Invalid Credentials"})
        }

        let payload = {
            user_id : userFound.user_id,
            role : "user"
        }

        //Generate a Token
        const token = generateToken(payload);
        // console.log(token);

        res.status(200).json({ success : "Admin Login Successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});


router.post("/addComponents", componentValidation(), errorMiddleware, authMiddleware, async (req, res) => {
    try {
        // const payload = req.payload;
        // console.log(payload);
        // if (!payload) {
        //     return res.status(401).json({ error : "Unauthorised Access "})
        // }

        let token = req.headers["auth-token"];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized Access" });
        }
        const payload = jwt.verify(token, "codeforindia");
        // console.log(payload);
        if (!payload) {
            return res.status(401).json({ error: "Unauthorized Access" });
        }

        let {
            user_id,
            componentName,
            total,
            available,
            source,
            description,
            buyingPrice,
            sellingPrice,
            date
        } = req.body;

        let userFound = await Users.findOne(payload.id)
        console.log(userFound);

        let component_data = {
            user_id,
            componentName,
            total,
            available,
            source,
            description,
            buyingPrice,
            sellingPrice,
            date
        }
        console.log(component_data);

        const Component = new components(req.body);
        await Component.save();
        res.status(200).json({ success: "Component was Added " });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
});

// router.put("/editComponents", componentValidation(), errorMiddleware, authMiddleware, async (req, res) => {
//     try {
//         let token = req.headers["auth-token"];
//         if (!token) {
//             return res.status(401).json({ error: "Unauthorized Access" });
//         }
//         const payload = jwt.verify(token, "codeforindia");
//         // console.log(payload);
//         if (!payload) {
//             return res.status(401).json({ error: "Unauthorized Access" });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error : "Internal Server Error" });
//     }
// })

router.get("/components", async (req, res) => {
    try {
        let component_data = await components.find({})
        // await component_data.save();
        res.status(200).json({ success: "component found", component_data })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server error" })
    }
})

export default router;