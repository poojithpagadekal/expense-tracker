import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB connected Success`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error connecting DB `, error.message);
    }
    process.exit(1);
  }
};

export default connectDB;
