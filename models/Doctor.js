import mongoose from "mongoose";

export const DoctorInfoSchema = new mongoose.Schema(
  {
    account_number: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 5) {
            return value != null && value.trim().length > 0;
          }
          return true;
        },
        message: "Account number is required",
      },
    },
    account_name: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 5) {
            return value != null && value.trim().length > 0;
          }
          return true;
        },
        message: "Account name is required",
      },
    },
    bank: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 5) {
            return value != null && value.trim().length > 0;
          }
          return true;
        },
        message: "Bank is required",
      },
    },
    media: {
      type: [String],
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 5) {
            return value != null && value.length > 0;
          }
          return true;
        },
        message: "Media is required",
      },
    },
    verification: {
      type: String,
      enum: ["not_started", "verifying", "approved", "failed"],
      default: "not_started",
    },
    rating: Number,
    onboarding_level: {
      type: Number,
      default: 0,
    },
    specialities: [String],
    current_facility: String,
    experience: {
      type: Number,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 4) {
            return value != null;
          }
          return true;
        },
        message: "Experience is required",
      },
    },
    rate: {
      type: Number,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 5) {
            return value != null;
          }
          return true;
        },
        message: "Rate is required",
      },
    },
    payment_channel: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 5) {
            return value != null && value.trim().length > 0;
          }
          return true;
        },
        message: "Payment channel is required",
      },
    },
    certifications: [String],
    bio: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 4) {
            return value != null && value.trim().length > 0;
          }
          return true;
        },
        message: "Bio is required",
      },
    },
    license_number: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.onboarding_level >= 4) {
            return value != null && value.trim().length > 0;
          }
          return true;
        },
        message: "License number is required",
      },
    },
  },
  { _id: false }
);
