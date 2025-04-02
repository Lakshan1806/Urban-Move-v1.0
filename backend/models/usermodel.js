import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
