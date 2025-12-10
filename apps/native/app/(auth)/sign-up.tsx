import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Container } from "@/components/container";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
	const colorScheme = useColorScheme();
	const background = useThemeColor({}, 'background');
	const surface = useThemeColor({}, 'surface');
	const text = useThemeColor({}, 'text');
	const textSecondary = useThemeColor({}, 'textSecondary');
	const textMuted = useThemeColor({}, 'textMuted');
	const border = useThemeColor({}, 'border');

	const { data: session } = authClient.useSession();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// Redirect if already authenticated
	useEffect(() => {
		if (session) {
			router.replace("/(tabs)");
		}
	}, [session]);

	const handleSignUp = async () => {
		if (!name || !email || !password || !confirmPassword) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		if (password.length < 8) {
			Alert.alert("Error", "Password must be at least 8 characters");
			return;
		}

		setLoading(true);
		try {
			const result = await authClient.signUp.email({
				email,
				password,
				name,
			});

			// Check if sign-up was successful
			if (result.error) {
				Alert.alert("Sign Up Failed", result.error.message || "Failed to create account");
				return;
			}

			// Only show success and redirect if successful
			Alert.alert(
				"Success",
				"Account created successfully! Please sign in.",
				[
					{
						text: "OK",
						onPress: () => router.replace("/(auth)/sign-in"),
					},
				]
			);
		} catch (error: any) {
			Alert.alert("Sign Up Failed", error.message || "Failed to create account");
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
						<Text style={[styles.heroTitle, { color: text }]}>Create Your Account</Text>
						<Text style={[styles.heroSubtitle, { color: textSecondary }]}>
							Join thousands on their mindfulness journey
						</Text>
					</View>

					<View style={styles.formContainer}>
						<View style={[styles.formCard, { backgroundColor: surface }]}>
							<View style={styles.inputGroup}>
								<Text style={[styles.label, { color: textSecondary }]}>Full Name</Text>
								<TextInput
									style={[
										styles.input,
										{
											backgroundColor: background,
											color: text,
											borderColor: border,
										},
									]}
									placeholder="Enter your name"
									placeholderTextColor={textMuted}
									value={name}
									onChangeText={setName}
									autoComplete="name"
								/>
							</View>

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
									placeholder="Create a password (min 8 chars)"
									placeholderTextColor={textMuted}
									value={password}
									onChangeText={setPassword}
									secureTextEntry
									autoComplete="password-new"
								/>
							</View>

							<View style={styles.inputGroup}>
								<Text style={[styles.label, { color: textSecondary }]}>Confirm Password</Text>
								<TextInput
									style={[
										styles.input,
										{
											backgroundColor: background,
											color: text,
											borderColor: border,
										},
									]}
									placeholder="Confirm your password"
									placeholderTextColor={textMuted}
									value={confirmPassword}
									onChangeText={setConfirmPassword}
									secureTextEntry
									autoComplete="password-new"
								/>
							</View>

							<TouchableOpacity
								style={[
									styles.signUpButton,
									loading && styles.signUpButtonDisabled,
								]}
								onPress={handleSignUp}
								disabled={loading}
							>
								<LinearGradient
									colors={COLORS.gradients.mintFresh}
									style={styles.buttonGradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								>
									<Text style={styles.signUpButtonText}>
										{loading ? "Creating Account..." : "Sign Up"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>

							<View style={styles.divider}>
								<View style={[styles.dividerLine, { backgroundColor: border }]} />
								<Text style={[styles.dividerText, { color: textSecondary }]}>OR</Text>
								<View style={[styles.dividerLine, { backgroundColor: border }]} />
							</View>

							<TouchableOpacity
								style={[styles.signInButton, { borderColor: border }]}
								onPress={() => router.back()}
							>
								<Text style={[styles.signInButtonText, { color: text }]}>
									Already have an account? Sign In
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
		fontSize: 28,
		fontWeight: "800",
		marginBottom: SPACING.xs,
		letterSpacing: -0.5,
		textAlign: "center",
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
	signUpButton: {
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
	signUpButtonDisabled: {
		opacity: 0.7,
	},
	signUpButtonText: {
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
	signInButton: {
		borderWidth: 1.5,
		padding: SPACING.lg,
		borderRadius: BORDER_RADIUS.xl,
		alignItems: "center",
	},
	signInButtonText: {
		fontSize: 16,
		fontWeight: "700",
	},
});
