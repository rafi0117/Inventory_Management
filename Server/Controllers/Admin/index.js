import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";
import multer from "multer";

import randomString from "../../Utils/Randomstring/index.js";

import imageModel from "../../image.model.js";

import generateToken from "../../Middlewares/Auth/generateToken.js";

import Admin from "../../Model/Admin/index.js";
import Users from "../../Model/Users/index.js";
import components from "../../Model/Components/index.js";

import authMiddleware from "../../Middlewares/Auth/verifyToken.js";
import { loginValidation, errorMiddleware, componentValidation, componentEditValidation } from "../../Middlewares/Validation/index.js";

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


router.post("/addcomponents", componentValidation(), errorMiddleware, authMiddleware, async (req, res) => {
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
            // user_id,
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
            // user_id,
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

/*
METHOD: PUT
API Endpoint: /api/admin/:editComponents
PRIVATE
res: components are displayed
*/

router.put("/:editcomponents", componentEditValidation(), errorMiddleware, authMiddleware, async (req, res) => {
    try {
        console.log("hello");

        let token = req.headers["auth-token"];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized Access" });
        }
        const payload = jwt.verify(token, "codeforindia");
        console.log(payload);
        if (!payload) {
            return res.status(401).json({ error: "Unauthorized Access" });
        }

        let { componentName, total, available } = req.body;
        console.log(req.body);

        let component_id = req.params.editComponents;
        console.log(component_id);
        
        if(!componentName || !total || !available) {
            res.status(401).json({ error : "Some fields are missing" })
        }
         
       let componentFound =  await components.findOne({ component_id })
       console.log(componentFound);
        if (!componentFound) {
            res.status(401).json({ error : "No component Found" })
        }

        componentFound.componentName = componentName;
        componentFound.total = total;
        componentFound.available = available;

        let displayComponent = { componentName : componentName, total : total, available : available}
        console.log(displayComponent);

        await componentFound.save();

        res.status(200).json({ success : displayComponent})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "Internal Server Error" });
    }
})

// Storage
const Storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./uploads" )
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    },
});

const upload = multer({
    storage : Storage
})
console.log(upload);

router.post("/upload", upload.single("testImage"), async  (req, res) => {
    try {
        const newImage = new imageModel({
            name : req.body.name,
            image : {
                    // filename : "arduino",
                    data : req.file.filename,
                    contentType : "image/jpg"
            }
        })
        console.log(req.file);
        await newImage.save()
        res.status(200).json({ success : "Successfully Uploaded"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "Internal Server Error" })
    }
})

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