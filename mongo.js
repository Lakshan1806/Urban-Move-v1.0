import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/feedback")
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.log("Failed");
  });

const newSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  }
});

const collection = mongoose.model("collection", newSchema);

export default collection;
