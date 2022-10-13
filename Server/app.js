import express from "express";
import config from "config";
import "./Utils/DBconnect/index.js";

import UserRoutes from "./Controllers/User/index.js";
import RootRoutes from "./Controllers/Root/index.js";
import AdminRoutes from "./Controllers/Admin/index.js";

const app = express();
const port = config.get("PORT");

//JSON Body Parser
app.use(express.json());

app.get("/", (req, res) => {
    res.send("This is Inventory Management System API Backend")
})

app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/root", RootRoutes);


app.listen(port, () => {
    console.log("Server Started at Port : ", port);
})