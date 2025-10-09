import { fetchMovies } from "@/app/api/main";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import RenderMovieCard from "./components/moviecard";
import Trend from "./components/treanding";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
};

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tr, trated, pop, upc, now] = await Promise.all([
          fetchMovies("/trending/movie/week"),
          fetchMovies("/movie/top_rated"),
          fetchMovies("/movie/popular"),
          fetchMovies("/movie/upcoming"),
          fetchMovies("/movie/now_playing"),
        ]);
        setTrending(tr);
        setTopRated(trated);
        setPopular(pop);
        setUpcoming(upc);
        setNowPlaying(now);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loaderText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#000", flex: 1 }}>
      {/* 🎬 Hero Swiper */}
      <Swiper
        style={{ height: 300 }}
        showsPagination={true}
        dotColor="gray"
        activeDotColor="#E50914"
        loop
        autoplay
        autoplayTimeout={4}
      >
        {trending.map((item) => (
          <Trend
            key={item.id}
            cover={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
            movieTitle={item.title || item.name || "Untitled"}
            id={item.id}
          />
        ))}
      </Swiper>

      {/* Sections */}
      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Top Rated Movies</Text>
      </View>
      <FlatList
        horizontal
        data={topRated}
        renderItem={({ item }) => <RenderMovieCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Popular Movies</Text>
      </View>
      <FlatList
        horizontal
        data={popular}
        renderItem={({ item }) => <RenderMovieCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Upcoming Movies</Text>
      </View>
      <FlatList
        horizontal
        data={upcoming}
        renderItem={({ item }) => <RenderMovieCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Now Playing</Text>
      </View>
      <FlatList
        horizontal
        data={nowPlaying}
        renderItem={({ item }) => <RenderMovieCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    fontFamily: "RobotoSlab",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
  },
  beforeLine: {
    width: 5,
    height: 30,
    backgroundColor: "#E50914",
    marginRight: 8,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  tags: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 28,
    letterSpacing: 1,
  },
});
