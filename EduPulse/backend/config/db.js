import mongoose from "mongoose";

const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/edupulse";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(LOCAL_MONGO_URI);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;