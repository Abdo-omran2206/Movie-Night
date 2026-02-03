import { useFonts } from "expo-font";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { fetchFilter } from "@/app/api/main";
import { useEffect, useState } from "react";
import RenderMovieCard from "@/app/components/ExploreCard";
import React from "react";

export default function Explore() {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  const [type, setType] = useState<"movie" | "tv">("movie");
  const [status, setStatus] = useState<
    "popular" | "top_rated" | "upcoming" | "now_playing"
  >("popular");
  const [country, setCountry] = useState("US");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const countries = [
    { code: "US", label: "🇺🇸 USA" },
    { code: "GB", label: "🇬🇧 UK" },
    { code: "FR", label: "🇫🇷 France" },
    { code: "EG", label: "🇪🇬 Egypt" },
    { code: "JP", label: "🇯🇵 Japan" },
    { code: "KR", label: "🇰🇷 Korea" },
    { code: "IN", label: "🇮🇳 India" },
  ];

  const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 27, name: "Horror" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 878, name: "Sci-Fi" },
    { id: 10749, name: "Romance" },
    { id: 80, name: "Crime" },
  ];

  async function loadData(resetPage = true) {
    try {
      if (resetPage) {
        setLoading(true);
        setPage(1);
      }
      const data = await fetchFilter({
        type,
        category: status,
        region: country,
        genre: selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
        page: resetPage ? 1 : page + 1,
      });

      if (resetPage) {
        setItems(data?.results || []);
      } else {
        setItems((prev) => [...prev, ...(data?.results || [])]);
      }
      setPage((prev) => (resetPage ? 1 : prev + 1));
    } catch (err) {
      console.error("❌ Failed to load data:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadData(true);
  }, [type, status, country, selectedGenres]);

  const loadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      loadData(false);
    }
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  if (!fontsLoaded) return null;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* Filter Sections */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterGroupTitle}>🎬 Type</Text>
        <FlatList
          data={["movie", "tv"]}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setType(item as any)}
              style={[
                styles.filterButton,
                type === item && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  type === item && styles.filterTextActive,
                ]}
              >
                {item === "movie" ? "Movie" : "TV Show"}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.filterGroupTitle}>⭐ Status</Text>
        <FlatList
          data={["popular", "top_rated", "upcoming", "now_playing"]}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setStatus(item as any)}
              style={[
                styles.filterButton,
                status === item && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  status === item && styles.filterTextActive,
                ]}
              >
                {item === "popular"
                  ? "Popular"
                  : item === "top_rated"
                  ? "Top Rated"
                  : item === "upcoming"
                  ? "Upcoming"
                  : "Now Playing"}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.filterGroupTitle}>🌍 Country</Text>
        <FlatList
          data={countries}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCountry(item.code)}
              style={[
                styles.filterButton,
                country === item.code && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  country === item.code && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.code}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.filterGroupTitle}>🎭 Genres</Text>
        <FlatList
          data={genres}
          horizontal
          renderItem={({ item }) => {
            const active = selectedGenres.includes(item.id);
            return (
              <TouchableOpacity
                onPress={() => toggleGenre(item.id)}
                style={[
                  styles.filterButton,
                  active && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[styles.filterText, active && styles.filterTextActive]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );

  return loading ? (
    <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 40 }} />
  ) : (
    <FlatList
      data={items}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={2}
      renderItem={({ item }) => <RenderMovieCard item={item} />}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            size="small"
            color="#E50914"
            style={{ marginVertical: 20 }}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#0a0a0a",
    paddingBottom: 10,
  },
  headerTop: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontFamily: "BebasNeue",
    fontSize: 48,
    color: "#fff",
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 120,
    height: 4,
    backgroundColor: "#E50914",
    marginTop: 4,
  },
  filtersSection: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  filterGroupTitle: {
    fontFamily: "RobotoSlab",
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  filterButton: {
    borderColor: "#E50914",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#E50914",
    borderColor: "#E50914",
  },
  filterText: {
    fontFamily: "RobotoSlab",
    color: "#ccc",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: "space-between", // ensures even spacing for 2 columns
  },
});
