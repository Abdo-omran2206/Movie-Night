import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const SLIDE_HEIGHT = 340;

type TrendProps = {
  id: number;
  cover: string;
  movieTitle: string;
  rating?: number;
};

export default function Trend({ id, cover, movieTitle, rating }: TrendProps) {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  const handlePress = () => {
    router.push({
      pathname: "/moviedetails/[movieID]",
      params: { movieID: id.toString() },
    });
  };

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: cover }}
        style={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.95)"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.badgeContainer}>
              <View style={styles.trendingBadge}>
                <Ionicons name="flame" size={14} color="#fff" />
                <Text style={styles.badgeText}>TRENDING NOW</Text>
              </View>
              {typeof rating === "number" && rating > 0 && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {movieTitle}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={styles.buttonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width,
    height: SLIDE_HEIGHT,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  trendingBadge: {
    backgroundColor: "#E50914",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "RobotoSlab",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    marginBottom: 15,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
    lineHeight: 38,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "RobotoSlab",
  },
});
