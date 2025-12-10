import { expo } from "@better-auth/expo";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { client } from "@repo/db";

export const auth = betterAuth<BetterAuthOptions>({
  database: mongodbAdapter(client),
  trustedOrigins: [process.env.CORS_ORIGIN || "", "mybettertapp://", "exp://"],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  user: {
    additionalFields: {
      // RDM-specific fields
      tokens: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      streak: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      lastActiveDate: {
        type: "string",
        required: false,
        input: false,
      },
      charityContribution: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      // Wallet system (in RDM tokens, 100 RDM = 1 USDT)
      basePurse: {
        type: "number",
        required: false,
        defaultValue: 100, // Starting balance of 100 RDM (1 USDT)
        input: false,
      },
      rewardPurse: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      charityPurse: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      remorsePurse: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      walletDisplayMode: {
        type: "string",
        required: false,
        defaultValue: "RDM",
        input: false,
      },
    },
  },
  plugins: [
    expo(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
