import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Container } from "@/components/container";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
	const colorScheme = useColorScheme();
	const background = useThemeColor({}, 'background');
	const surface = useThemeColor({}, 'surface');
	const text = useThemeColor({}, 'text');
	const textSecondary = useThemeColor({}, 'textSecondary');
	const textMuted = useThemeColor({}, 'textMuted');
	const border = useThemeColor({}, 'border');

	const { data: session } = authClient.useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// Redirect if already authenticated
	useEffect(() => {
		if (session) {
			router.replace("/(tabs)");
		}
	}, [session]);

	const handleSignIn = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		setLoading(true);
		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});

			// Check if sign-in was successful
			if (result.error) {
				Alert.alert("Sign In Failed", result.error.message || "Invalid credentials");
				return;
			}

			// Only redirect if successful
			router.replace("/(tabs)");
		} catch (error: any) {
			Alert.alert("Sign In Failed", error.message || "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					style={[styles.container, { backgroundColor: background }]}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* Hero Section */}
					<View style={styles.heroSection}>
						<LinearGradient
							colors={COLORS.gradients.mintFresh}
							style={styles.iconGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							<Ionicons name="fitness" size={40} color={COLORS.white} />
						</LinearGradient>
						<Text style={[styles.heroTitle, { color: text }]}>RDM</Text>
						<Text style={[styles.heroSubtitle, { color: textSecondary }]}>
							Rewards for Daily Mindfulness
						</Text>
					</View>

					<View style={styles.formContainer}>
						<View style={[styles.formCard, { backgroundColor: surface }]}>
							<View style={styles.inputGroup}>
								<Text style={[styles.label, { color: textSecondary }]}>Email</Text>
								<TextInput
									style={[
										styles.input,
										{
											backgroundColor: background,
											color: text,
											borderColor: border,
										},
									]}
									placeholder="Enter your email"
									placeholderTextColor={textMuted}
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoComplete="email"
								/>
							</View>

							<View style={styles.inputGroup}>
								<Text style={[styles.label, { color: textSecondary }]}>Password</Text>
								<TextInput
									style={[
										styles.input,
										{
											backgroundColor: background,
											color: text,
											borderColor: border,
										},
									]}
									placeholder="Enter your password"
									placeholderTextColor={textMuted}
									value={password}
									onChangeText={setPassword}
									secureTextEntry
									autoComplete="password"
								/>
							</View>

							<TouchableOpacity
								style={[
									styles.signInButton,
									loading && styles.signInButtonDisabled,
								]}
								onPress={handleSignIn}
								disabled={loading}
							>
								<LinearGradient
									colors={COLORS.gradients.mintFresh}
									style={styles.buttonGradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								>
									<Text style={styles.signInButtonText}>
										{loading ? "Signing In..." : "Sign In"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>

							<View style={styles.divider}>
								<View style={[styles.dividerLine, { backgroundColor: border }]} />
								<Text style={[styles.dividerText, { color: textSecondary }]}>OR</Text>
								<View style={[styles.dividerLine, { backgroundColor: border }]} />
							</View>

							<TouchableOpacity
								style={[styles.signUpButton, { borderColor: border }]}
								onPress={() => router.push("/(auth)/sign-up")}
							>
								<Text style={[styles.signUpButtonText, { color: text }]}>
									Create New Account
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	heroSection: {
		alignItems: "center",
		paddingVertical: SPACING.xl,
		marginBottom: SPACING.md,
	},
	iconGradient: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: SPACING.md,
		...SHADOWS.medium,
	},
	heroTitle: {
		fontSize: 32,
		fontWeight: "800",
		marginBottom: SPACING.xs,
		letterSpacing: -0.5,
	},
	heroSubtitle: {
		fontSize: 14,
		fontWeight: "500",
		textAlign: "center",
	},
	formContainer: {
		paddingHorizontal: SPACING.lg,
		paddingTop: SPACING.md,
		paddingBottom: SPACING.xl,
	},
	formCard: {
		borderRadius: BORDER_RADIUS.xl,
		padding: SPACING.xl,
		...SHADOWS.soft,
	},
	inputGroup: {
		marginBottom: SPACING.md,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: SPACING.xs,
		marginLeft: 4,
	},
	input: {
		borderWidth: 1.5,
		borderRadius: BORDER_RADIUS.lg,
		padding: SPACING.md,
		fontSize: 16,
	},
	signInButton: {
		borderRadius: BORDER_RADIUS.xl,
		overflow: "hidden",
		marginTop: SPACING.lg,
		...SHADOWS.medium,
	},
	buttonGradient: {
		padding: SPACING.lg,
		alignItems: "center",
		justifyContent: "center",
	},
	signInButtonDisabled: {
		opacity: 0.7,
	},
	signInButtonText: {
		color: COLORS.white,
		fontSize: 16,
		fontWeight: "700",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: SPACING.xl,
	},
	dividerLine: {
		flex: 1,
		height: 1,
	},
	dividerText: {
		marginHorizontal: SPACING.md,
		fontSize: 12,
		fontWeight: "600",
	},
	signUpButton: {
		borderWidth: 1.5,
		padding: SPACING.lg,
		borderRadius: BORDER_RADIUS.xl,
		alignItems: "center",
	},
	signUpButtonText: {
		fontSize: 16,
		fontWeight: "700",
	},
});
