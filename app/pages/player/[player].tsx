import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

export default function Player() {
  const { player: id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }
    changeScreenOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  if (!id) return null;

  const embedUrl = `https://multiembed.mov/?video_id=${encodeURIComponent(
    id as string,
  )}&tmdb=1`;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* 🎬 Video Player - Using Absolute Fill to ensure it takes all screen */}
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
      />

      {/* 🔙 Back Button - Placed after WebView to ensure it stays on top */}
      {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 30, // Optimized for landscape
    left: 20,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 25,
  },
});
