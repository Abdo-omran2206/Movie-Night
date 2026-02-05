import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  Dimensions
} from "react-native";
import { fetchFilter, search } from "@/app/api/main";
import { Ionicons } from "@expo/vector-icons";
import RenderMovieCard from "@/app/components/ExploreCard";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");
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
  const [year, setYear] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔍 Search State
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const countries = [
    { code: "US", label: "🇺🇸 USA" },
    { code: "GB", label: "🇬🇧 UK" },
    { code: "FR", label: "🇫🇷 France" },
    { code: "EG", label: "🇪🇬 Egypt" },
    { code: "JP", label: "🇯🇵 Japan" },
    { code: "KR", label: "🇰🇷 Korea" },
    { code: "IN", label: "🇮🇳 India" },
    { code: "TR", label: "🇹🇷 Turkey" },
    { code: "BR", label: "🇧🇷 Brazil" },
    { code: "MX", label: "🇲🇽 Mexico" },
    { code: "CN", label: "🇨🇳 China" },
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
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 99, name: "Doc" },
    { id: 10751, name: "Family" },
    { id: 9648, name: "Mystery" },
    { id: 53, name: "Thriller" },
    { id: 37, name: "Western" },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let i = currentYear; i >= 2000; i--) {
      yearList.push(i.toString());
    }
    return ["All", ...yearList];
  }, []);

  // 🌍 Load Explore Data
  const loadData = useCallback(
    async (targetPage: number, isReset = true) => {
      try {
        if (isReset) {
          setLoading(true);
        }

        const data = await fetchFilter({
          type,
          category: status,
          region: country,
          genre:
            selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
          year: year === "All" ? "" : year,
          page: targetPage,
        });

        if (isReset) {
          setItems(data?.results || []);
          setPage(1);
        } else {
          setItems((prev) => [...prev, ...(data?.results || [])]);
          setPage(targetPage);
        }
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [type, status, country, selectedGenres, year],
  );

  // 🔍 Handle Search Logic
  useEffect(() => {
    if (query.trim().length > 2) {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(async () => {
        setIsSearching(true);
        setSearchPage(1);
        const data = await search(query, 1);
        setSearchResults(data || []);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  // 🚀 Load More Logic (Handles both Explore & Search)
  const loadMore = async () => {
    if (loadingMore || loading || isSearching) return;

    if (query.trim().length > 2) {
      // Load more search results
      setIsSearching(true);
      const nextPage = searchPage + 1;
      const data = await search(query, nextPage);
      setSearchResults((prev) => [...prev, ...(data || [])]);
      setSearchPage(nextPage);
      setIsSearching(false);
    } else {
      // Load more explore results
      setLoadingMore(true);
      loadData(page + 1, false);
    }
  };

  useEffect(() => {
    if (query.trim().length <= 2) {
      loadData(1, true);
    }
  }, [loadData, query]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const renderHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Explore</Text>
            <View style={styles.titleUnderline} />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.filterIconButton}
          >
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🔍 Unified Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#777" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, tv shows..."
              placeholderTextColor="#777"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={20} color="#777" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    ),
    [query],
  );

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filtersSection}>
                <Text style={styles.filterGroupTitle}>🎬 Type</Text>
                <View style={styles.filterGroup}>
                  {["movie", "tv"].map((item) => (
                    <TouchableOpacity
                      key={item}
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
                  ))}
                </View>

                <Text style={styles.filterGroupTitle}>⭐ Status</Text>
                <View style={styles.filterGroup}>
                  {["popular", "top_rated", "upcoming", "now_playing"].map(
                    (item) => (
                      <TouchableOpacity
                        key={item}
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
                    ),
                  )}
                </View>

                <Text style={styles.filterGroupTitle}>📅 Year</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.yearScrollContainer}
                >
                  {years.map((y) => (
                    <TouchableOpacity
                      key={y}
                      onPress={() => setYear(y === "All" ? "" : y)}
                      style={[
                        styles.yearButton,
                        (year === y || (y === "All" && year === "")) &&
                          styles.filterButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          (year === y || (y === "All" && year === "")) &&
                            styles.filterTextActive,
                        ]}
                      >
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.filterGroupTitle}>🌍 Country</Text>
                <View style={styles.filterGroup}>
                  {countries.map((item) => (
                    <TouchableOpacity
                      key={item.code}
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
                  ))}
                </View>

                <Text style={styles.filterGroupTitle}>🎭 Genres</Text>
                <View style={styles.filterGroup}>
                  {genres.map((item) => {
                    const active = selectedGenres.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleGenre(item.id)}
                        style={[
                          styles.filterButton,
                          active && styles.filterButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterText,
                            active && styles.filterTextActive,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {renderHeader}
      {(loading || isSearching) &&
      items.length === 0 &&
      searchResults.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : (
        <FlatList
          data={query.trim().length > 2 ? searchResults : items}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={2}
          renderItem={({ item }) => <RenderMovieCard item={item} />}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore || isSearching ? (
              <ActivityIndicator
                size="small"
                color="#E50914"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
        />
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#0a0a0a",
    paddingBottom: 10,
    width:width,
  },
  headerTop: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterIconButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
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
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginRight: 10,
    marginBottom: 10,
  },
  filterGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  yearScrollContainer: {
    paddingVertical: 5,
    paddingRight: 20,
  },
  yearButton: {
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginRight: 10,
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
    paddingBottom: 100,
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  modalTitle: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#fff",
  },
  applyButton: {
    backgroundColor: "#E50914",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    fontFamily: "RobotoSlab",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontFamily: "RobotoSlab",
    fontSize: 15,
    marginLeft: 10,
  },
});
