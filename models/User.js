import mongoose from "mongoose";
import { DoctorInfoSchema } from "./Doctor.js";
import { PatientInfoSchema } from "./Patient.js";

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["doctor", "patient"],
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    address_1: {
      type: String,
      required: [true, "address is required"],
    },
    address_2: {
      type: String,
    },
    onboarding_level: {
      type: Number,
      required: [true, "required"],
    },
    languages: {
      type: [String],
      required: function () {
        return this.isNew ? false : true; // Required during onboarding, not at initial signup
      },
    },
    country: {
      type: String,
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    region: {
      type: String,
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    dob: {
      type: Date,
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    embedding: {
      type: [Number],
    },
    city: {
      type: String,
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },

    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
    doctorInfo: {
      type: DoctorInfoSchema,
      default: {},
      required: function () {
        return this.role === "doctor";
      },
    },
    patientInfo: {
      type: PatientInfoSchema,
      default: {},
      required: function () {
        return this.role === "patient";
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }
  if (this.isModified("region")) {
    this.region = this.region + " Region";
  }
  next();
});

UserSchema.index({ role: 1 });
const User = mongoose.model("User", UserSchema);

export default User;
