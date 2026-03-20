import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
      throw new Error("❌ MONGO_URL is undefined. Check your .env file");
    }

    await mongoose.connect(mongoURL);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message);
    process.exit(1);
  }
};

export default connectToDB;
