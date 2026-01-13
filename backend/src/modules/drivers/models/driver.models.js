import mongoose from "mongoose";
import bcrypt from "bcrypt";

const driverSchema = new mongoose.Schema(
  {
    fullname: { type: String },
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
      sparse: true,
    },
    email: {
      type: String,
      unique: true,
    },
    isTerminated: { type: Boolean, default: false },
    photo: { type: String, default: "" },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String },
    nicNumber: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    isAccountVerified: { type: Boolean, default: false },
    avatar: { type: String },
    authMethod: { type: String, enum: ["local", "google"], default: "local" },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      sparse: true,
    },

    role: {
      type: String,
      default: "driver",
    },
    driverDocuments: [String],
    driverVerified: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    carColor:{type:String},
    carNumber:{type:String},
  },
  { timestamps: true }
);

driverSchema.pre("save", async function (next) {
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

driverSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // For Google auth users without password
  return await bcrypt.compare(candidatePassword, this.password);
};

//driverSchema.index({ user: 1 });

const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;
