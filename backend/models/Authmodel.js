import mongoose, { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    name: { type: String },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      minlength: 4,
      maxlength: 30,
    },

    password: {
      type: String,
      minlength: 6,
    },

    image: { type: String },

    role: {
      type: String,
      default: "user",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Auth = mongoose.models.auths || model("auths", authSchema);
export default Auth;
