const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    manualPhrase: {
      type: String,
      required: true,
    },
    browserInfo: {
      userAgent: String,
      deviceType: String,
      browserName: String,
      browserVersion: String,
      ipAddress: String,
      platform: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
