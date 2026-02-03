// components/moviecard.tsx
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
};

export default function RenderMovieCard({ item }: { item: Movie }) {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handlePress = () =>{
    router.push(`/moviedetails/${item.id}`)
  }

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.movieCard}>
        {/* 🎬 Poster */}
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.movieImage}
        />

        {/* 🎥 Title */}
        <Text style={styles.movieTitle}>
          {item.title || item.name || "Untitled"}
        </Text>

        {/* 📅 Release Date */}
        {item.release_date && (
          <Text style={styles.movieMeta}>Release: {item.release_date}</Text>
        )}

        {/* ⭐ Rating */}
        {item.vote_average !== undefined && (
          <Text style={styles.movieMeta}>
            ⭐ {item.vote_average.toFixed(1)}/10
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    marginHorizontal: 10,
    marginVertical: 15,
    alignItems: "flex-start",
    width: 200,
  },
  movieImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 6,
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 20,
    textAlign: "left",
    width: "100%",
  },
  movieMeta: {
    marginTop: 2,
    color: "#aaa",
    fontSize: 13,
    fontFamily: "RobotoSlab",
  },
});
