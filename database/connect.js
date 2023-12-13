import mongoose from "mongoose";
import dotenv from "dotenv";
import gradient from "gradient-string";

const connect = async () => {  
    try {
        dotenv.config();
        const MONGODB_URI = process.env.MONGODB_URI
        const connetion = await mongoose.connect(MONGODB_URI)
        console.log(gradient('#02AABD', '#00CDAC','white')(`MongoDB Connected: ${connetion.connection.host}`));
    } catch (error) {console.error(gradient('#D4145A', '#FBB03B')(`Error: ${error.message}`));}
}

export default  connect ;
