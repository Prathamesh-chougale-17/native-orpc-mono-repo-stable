import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ContainerProps {
  children: React.ReactNode;
  gradient?: boolean;
  gradientColors?: [string, string];
  style?: ViewStyle;
  edges?: ("top" | "right" | "bottom" | "left")[];
}

export function Container({
  children,
  gradient = false,
  gradientColors,
  style,
  edges = ["top", "left", "right"],
}: ContainerProps) {
  const colorScheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const defaultGradient: [string, string] = [background, surface];

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      {gradient ? (
        <LinearGradient
          colors={gradientColors || defaultGradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <SafeAreaView style={[styles.container, style]} edges={edges}>
            {children}
          </SafeAreaView>
        </LinearGradient>
      ) : (
        <SafeAreaView
          style={[styles.container, { backgroundColor: background }, style]}
          edges={edges}
        >
          {children}
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
