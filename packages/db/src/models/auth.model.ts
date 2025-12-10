import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, required: true },
    image: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    // Better-Auth admin plugin fields
    role: { type: String, default: "user" },
    banned: { type: Boolean, default: false },
    banReason: { type: String },
    banExpires: { type: Date },
    // RDM-specific fields
    tokens: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: String }, // Format: YYYY-MM-DD for streak calculation
    charityContribution: { type: Number, default: 0 },
    // Wallet system (in RDM tokens, 100 RDM = 1 USDT)
    basePurse: { type: Number, default: 100 }, // Starting balance of 1000 RDM (10 USDT)
    rewardPurse: { type: Number, default: 0 },
    charityPurse: { type: Number, default: 0 },
    remorsePurse: { type: Number, default: 0 },
    walletDisplayMode: { type: String, enum: ["RDM", "USDT"], default: "RDM" },
  },
  { collection: "user" }
);

const sessionSchema = new Schema(
  {
    _id: { type: String },
    expiresAt: { type: Date, required: true },
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: { type: String, ref: "User", required: true },
  },
  { collection: "session" }
);

const accountSchema = new Schema(
  {
    _id: { type: String },
    accountId: { type: String, required: true },
    providerId: { type: String, required: true },
    userId: { type: String, ref: "User", required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    idToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String },
    password: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { collection: "account" }
);

const verificationSchema = new Schema(
  {
    _id: { type: String },
    identifier: { type: String, required: true },
    value: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { collection: "verification" }
);

const User = model("User", userSchema);
const Session = model("Session", sessionSchema);
const Account = model("Account", accountSchema);
const Verification = model("Verification", verificationSchema);

export { User, Session, Account, Verification };
