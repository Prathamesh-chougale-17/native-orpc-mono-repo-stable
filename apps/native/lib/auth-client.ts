import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const authClient = createAuthClient({
	baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
	plugins: [
		expoClient({
			scheme: (Constants.expoConfig?.scheme || "selfhelp") as string,
			storagePrefix: (Constants.expoConfig?.scheme || "selfhelp") as string,
			storage: SecureStore,
		}),
		adminClient(),
	],
});
