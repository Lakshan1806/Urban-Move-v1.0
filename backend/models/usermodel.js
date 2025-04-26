import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    googleId: { type: String, unique: true, sparse: true },
    isAccountVerified: { type: Boolean, default: false },
    name: { type: String },
    avatar: { type: String },
    authMethod: { type: String, enum: ["local", "google"], default: "local" },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified and exists (for local auth)
  if (this.isModified("password") && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
