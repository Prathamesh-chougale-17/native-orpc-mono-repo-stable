import mongoose from "mongoose";
import "dotenv/config";

await mongoose
  .connect(process.env.DATABASE_URL || "mongodb://localhost:27017/rdm")
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const client = mongoose.connection.getClient().db("rdm");

// Export mongoose for ObjectId usage
export { mongoose };

// Export models
export { User, Session, Account, Verification } from "./models/auth.model";


export { client };
