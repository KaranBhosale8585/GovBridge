import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI is missing!");

mongoose.set("strictQuery", true);

export async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  mongoose.connection.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
}
