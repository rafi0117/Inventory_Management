import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";

import randomString from "../../Utils/Randomstring/index.js";

//Import Models
import Users from "../../Model/Users/index.js";
import Admin from "../../Model/Admin/index.js";
import components from "../../Model/Components/index.js";

// Import Validations
import { loginValidation, userRegisterValidatorRules, errorMiddleware, componentValidation  } from "../../Middlewares/Validation/index.js";

// Import generate token
import generateToken from "../../Middlewares/Auth/generateToken.js";
import authMiddleware from "../../Middlewares/Auth/verifyToken.js";


// ----------------------------------------------------------------

const router = express.Router();

// -------------------SignUp Route--------------------------------
/*
End Point : /api/user/signup
Method : POST
Access : Public
Validation : 
        Password must be 8 characters minimum length, 1 uppercase, 1 special character,1 lowercase is mandatory
        Email address is unique and required field
        Firstname length not more than 25 characters
        password & password2 should match, but save password field only.
 Description: User Signup

*/


router.post("/SignUp", userRegisterValidatorRules(), errorMiddleware, async (req, res) => {

    try {

        let { firstname, lastname, email, password } = req.body;
        // console.log(req.body);
        //Avoid Double Registration

        let userData = await Users.findOne({ email });
        if (userData) {
            return res.status(409).json({ "error": "Email Already Registered" })
        }

        userData = await Admin.findOne({ email });
        if (userData) {
            return res.status(409).json({ "error": "Email Already Registered" })
        }

        req.body.password = await bcrypt.hash(password, 12);

        const user = new Users(req.body);

        user.userverifytoken = randomString(15);
        await user.save();

        res.status(200).json({ "success": "User Registered Successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" })
    }
});

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

        res.status(200).json({ success : "User Login Successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post("/:user_id", errorMiddleware, async (req, res) => {
    try {
        let user_id = req.params.user_id;
        // console.log(req.params);
        const componentData = await components.find({ user:  { "$all": [user_id]}})
        console.log(componentData);
        res.status(401).json({ success : "Component Added" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "Internal Server Error" })
    }
})

// router.post("/components", componentValidation(), errorMiddleware, async (req, res) => {
//     try {
//         // const payload = req.payload;
//         // console.log(payload);
//         // if (!payload) {
//         //     return res.status(401).json({ error : "Unauthorised Access "})
//         // }

//         let token = req.headers["auth-token"];
//         if (!token) {
//             return res.status(401).json({ error: "Unauthorized Access" });
//         }
//         const payload = jwt.verify(token, "codeforindia");
//         // console.log(payload);
//         if (!payload) {
//             return res.status(401).json({ error: "Unauthorized Access" });
//         }

//         let {
//             componentName,
//             total,
//             available,
//             source,
//             description,
//             buyingPrice,
//             sellingPrice,
//             date
//         } = req.body;

//         const Component = new components(req.body);
//         await Component.save();
//         res.status(200).json({ success: "Component was Added "});
//     } 
//     catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal Server Error"})
//     }
// })

export default router;