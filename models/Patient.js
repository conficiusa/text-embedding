import mongoose from "mongoose";

export const PatientInfoSchema = new mongoose.Schema(
  {
    conditions: {
      type: [String],
    },
    medicalHistory: {
      type: String,
    },
  },
  {
    _id: false,
  }
);
