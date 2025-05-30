import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // console.log(`mongoDB_uri: ${process.env.MONGODB_URI}`)
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log("what inside connectionInstance: ", connectionInstance);
    // console.log(
    //   `\n MongoDB connected DB HOST: ${connectionInstance.connection.host}`
    // ); // to check at which host my database is connected as their are different databses for production,dev and testing.
  } catch (error) {
    console.log("MongoDB connection ERROR:", error);
    process.exit(1);
  }
};

export default connectDB;
