import { useFonts } from "expo-font";
import { router } from "expo-router";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type?: "movie" | "tv";
  region?: string;
  category?: string;
};

export default function RenderMovieCard({ item }: { item: Movie }) {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  const isTV =
    item.media_type === "tv" ||
    (!!item.name && !item.title);

  const handlePress = () => {
    if (isTV) {
      router.push({
        pathname: "/tvdetails/[tvID]",
        params: { tvID: item.id.toString() },
      });
    } else {
      router.push({
        pathname: "/moviedetails/[movieID]",
        params: { movieID: item.id.toString() },
      });
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.cardContainer}>
      <View style={styles.movieCard}>
        {/* Poster */}
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://via.placeholder.com/200x300?text=No+Image",
          }}
          style={styles.movieImage}
          resizeMode="cover"
        />

        {/* Title */}
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title || item.name || "Untitled"}
        </Text>

        {/* Rating and Date Row */}
        <View style={styles.metaRow}>
          {item.vote_average !== undefined && (
            <Text style={styles.movieMeta}>
              ⭐ {item.vote_average.toFixed(1)}
            </Text>
          )}
          <Text style={styles.movieMeta}>
            {item.release_date
              ? item.release_date.slice(0, 4)
              : item.first_air_date
              ? item.first_air_date.slice(0, 4)
              : ""}
          </Text>
        </View>

        {/* Region / Category */}
        {(item.region || item.category) && (
          <Text style={styles.movieMetaSmall} numberOfLines={1}>
            {item.region ? `🌍 ${item.region}` : ""}{" "}
            {item.category ? `🎭 ${item.category}` : ""}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "48%", // Perfect for 2 columns
    marginBottom: 20,
  },
  movieCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    overflow: "hidden",
  },
  movieImage: {
    width: "100%",
    height: 260, // Taller for better proportions
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  movieTitle: {
    marginTop: 6,
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 18,
    textAlign: "left",
    paddingHorizontal: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 2,
  },
  movieMeta: {
    color: "#aaa",
    fontSize: 13,
    fontFamily: "RobotoSlab",
  },
  movieMetaSmall: {
    color: "#999",
    fontSize: 12,
    fontFamily: "RobotoSlab",
    paddingHorizontal: 8,
    marginTop: 2,
    marginBottom: 6,
  },
});
