import app from "./src/app.js";
import dotenv from 'dotenv'
import connectDB from "./src/config/db.js";


dotenv.config();
connectDB();

app.listen(5000, ()=>{
    console.log("server Started");
})

