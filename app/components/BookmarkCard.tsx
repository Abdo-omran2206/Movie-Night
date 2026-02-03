import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

interface Bookmark {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  movieID: string;
  type: "movie" | "tv";
}

export default function BookmarkCard({
  item,
  onRemove,
}: {
  item: Bookmark;
  onRemove: (id: string) => void;
}) {
  function handlePress() {
    if (item.type === "tv") {
      router.push({
        pathname: "/tvdetails/[tvID]",
        params: { tvID: item.movieID.toString() },
      });
    } else {
      router.push({
        pathname: "/moviedetails/[movieID]",
        params: { movieID: item.movieID.toString() },
      });
    }
  }

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
        }}
        style={styles.bgImage}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Pressable
            style={{ flexDirection: "row", flex: 1 }}
            onPress={handlePress}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.poster}
            />
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.overview} numberOfLines={3}>
                  {item.overview}
                </Text>
              </View>
              {/* 🗑 زر الحذف */}
              <TouchableOpacity onPress={() => onRemove(item.movieID)}>
                <Ionicons name="trash" size={28} color="#E50914" />
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  bgImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },
  overlay: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 5,
    alignItems: "center",
  },
  poster: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 22,
  },
  overview: {
    color: "#ccc",
    fontFamily: "RobotoSlab",
    fontSize: 14,
  },
});
