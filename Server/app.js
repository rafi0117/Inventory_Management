import express from "express";
import config from "config";
import "./Utils/DBconnect/index.js";


const app = express();
const port = config.get("PORT");

//JSON Body Parser
app.use(express.json());

app.get("/", (req, res) => {
    res.send("This is Inventory Management System API Backend")
})


app.listen(port, () => {
    console.log("Server Started at Port : ", port);
})