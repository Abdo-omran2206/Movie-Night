import React, { useCallback, useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function TrailerModal({ visible, onClose, movie }: any) {
  const [loading, setLoading] = useState(true);

  const onReady = useCallback(() => setLoading(false), []);

  if (!movie?.videos?.results?.length) return null;

  const trailer = movie.videos.results.find(
    (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  if (!trailer) return null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <LinearGradient
        colors={["#000000ee", "#000000f0", "#141414ff"]}
        style={styles.overlay}
      >
        {/* Header: Movie Title + Close Button */}
        <LinearGradient colors={["#000000bb", "#00000000"]} style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title || movie.name}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* YouTube Player */}
        <View style={styles.videoWrapper}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E50914" />
            </View>
          )}
          <YoutubePlayer
            height={height * 0.5}
            width={width * 0.95}
            play={true}
            videoId={trailer.key}
            onReady={onReady}
          />
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  videoWrapper: {
    marginTop: 80,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
});
