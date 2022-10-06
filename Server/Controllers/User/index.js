import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";



// ----------------------------------------------------------------
// ----------------------------------------------------------------

const router = express.Router();


// ----------------------------------------------------------------
// ----------------------------------------------------------------

// -------------------SignUp Route--------------------------------

router.post("/SignUp", userRegisterValidatorRules(), errorMiddleware, async (req, res) => {

    try {

        let { email, password } = req.body;
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
