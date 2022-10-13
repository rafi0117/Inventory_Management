import config from "config";
import mongoose from "mongoose";
import "../../Utils/DBconnect/index.js";
import components from "../../Seeds/Components/index.js";

import componentSchema from "../../Model/Components/index.js";

async function componentSeed() {
    try {
        console.log(components);
        await componentSchema.insertMany(components);
        console.log("Components Seeded Successfully");
    } catch (error) {
        console.error(error);
    }
}
componentSeed();