import mongoose from "mongoose";

const refreshSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

export const RefreshTokens = mongoose.model("RefreshTokens", refreshSchema);
