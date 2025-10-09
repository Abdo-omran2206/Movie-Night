import { useFonts } from "expo-font";
import { router } from "expo-router";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";

type Movie = {
  id: number;
  title?: string;
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

  const handlePress = () => {
    router.push(`/moviedetails/${item.id}`);
  };

  // ✅ صورة الفيلم (poster فقط)
  const imageUri = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        {/* 🎬 Poster */}
        <Image source={{ uri: imageUri }} style={styles.image} />

        {/* 🎥 Title */}
        <Text style={styles.title}>{item.title || "Untitled"}</Text>

        {/* 📅 Release Date */}
        {item.release_date && (
          <Text style={styles.meta}>Release: {item.release_date}</Text>
        )}

        {/* ⭐ Rating */}
        {item.vote_average !== undefined && (
          <Text style={styles.meta}>⭐ {item.vote_average.toFixed(1)}/10</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    alignItems: "flex-start",
    width: 165,
    padding: 1,
  },
  image: {
    width: 160,
    height: 240,
    borderRadius: 10,
    backgroundColor: "#222",
  },
  title: {
    marginTop: 6,
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
  },
  meta: {
    marginTop: 2,
    color: "#aaa",
    fontSize: 13,
    fontFamily: "RobotoSlab",
  },
});
