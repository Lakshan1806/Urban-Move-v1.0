import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error:${err.message}`);
    process.exit(1);//1-failure exit, 0-success
  }
};

const newSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  }
});

const collection = mongoose.model("collection", newSchema);

export default collection;