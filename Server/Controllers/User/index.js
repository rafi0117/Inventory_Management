import express, { application } from "express";
import bcrypt from "bcrypt";
import config from "config";

import randomString from "../../Utils/Randomstring/index.js";
import sendEmail from "../../Utils/sendMail.js"; 

//Import Models
import userModel from "../../Model/Users/index.js";

// Import Validations
import { loginValidation, userRegisterValidatorRules, errorMiddleware } from "../../Middlewares/Validation/index.js";

// Import generate token
import generateToken from "../../Middlewares/Auth/generateToken.js";
// import authMiddleware from "../../Middlewares/Auth/verifyToken.js";


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

router.post("/signup", userRegisterValidatorRules(), errorMiddleware, async (req, res) => {

    try {

        let { firstname, lastname, email, password, password2 } = req.body;
        // console.log(req.body);
        //Avoid Double Registration

        if (!firstname || !lastname || !email || !password || !password2) {
            return res.status(400).json({ "error" : "Some Fields are Missing" })
        }
        if (password !== password2) {
            return res.status(400).json({ "error" : "Passwords do not match" })
        }

        let gotMail = await userModel.findOne({ email })
        if (gotMail) {
            return res.status(409).json({ error : "Email Already Registered. Please Login to continue" })
        }

        // let userData = await Users.findOne({ email });
        // if (userData) {
        //     return res.status(409).json({ "error": "Email Already Registered" })
        // }

        // userData = await Admin.findOne({ email });
        // if (userData) {
        //     return res.status(409).json({ "error": "Email Already Registered" })
        // }

        req.body.password = await bcrypt.hash(password, 12);

        let userData = req.body;
        console.log(userData);

        userData.userverified = {  email: false }
        
        let emailToken = randomString(10)

        userData.userverifytoken = {email: emailToken }

        const allusers = new userModel(userData)

        await allusers.save();

        // const allcomponents = new Components();

        // await allcomponents.save();

        await sendEmail ({
            subject : "EdVenture Park Hardware Lab Register",
            to : userData.email,
            html : `<p>Hi ${userData.firstname}, <br>
                        Please click on this link to verify. <b> ${config.get("URL")}/api/user/verify/email/${emailToken}</b></p>`
        })

        // user.userverifytoken = randomString(15);
        // await user.save();

        res.status(200).json({ "success": "User Signed Up Successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" })
    }
});

router.get("/verify/email/:emailtoken", async (req, res) => {
    try {
        console.log("HIT");
        // res.status(200).json({ success : "Router is Up"})
        let emailToken = req.params.emailtoken;
        console.log(emailToken);

        let userFound = await userModel.findOne({ "userverifytoken.email" : emailToken });
        console.log(userFound)

        if (userFound.userverified.email == true) {
            return res.status(200).json({ success : "Email already verified" });
        }

        userFound.userverified.email = true;
        await userFound.save();

        res.status(200).json({ success : "Email is Verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "Internal Server Error" })
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
});

// router.post("/:user_id", errorMiddleware, async (req, res) => {
//     try {
//         let user_id = req.params.user_id;
//         // console.log(req.params);
//         const componentData = await components.find({ user:  { "$all": [user_id]}})
//         console.log(componentData);
//         res.status(401).json({ success : "Component Added" })

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error : "Internal Server Error" })
//     }
// })

app.post("/razorpay", async (req, res) => {
    const payment_capture = 1;
    const amount = 499;
    const currency = "INR";
})


export default router;