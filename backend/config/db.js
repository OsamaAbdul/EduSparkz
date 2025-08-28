
import mongoose from "mongoose";


const connectToDb = async() => {
   try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to the database successfully");
   } catch (error) {
    console.error("Error connecting to the database:", error);
   }
}

export default connectToDb;