import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { search } from "@/app/api/main";
import RenderMovieCard from "@/app/components/MovieCard";
import React from "react";


export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // ✅ صفحة البداية
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length > 2) {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(async () => {
        setLoading(true);
        setPage(1); // ✅ أول بحث يرجع للصفحة 1
        const data = await search(query, 1);
        setResults(data);
        setLoading(false);
      }, 500); // ⏳ نصف ثانية تأخير
    } else {
      setResults([]);
    }
  }, [query]);

  // 🟢 تحميل المزيد عند الوصول لنهاية القائمة
  const loadMore = async () => {
    if (!loading && query.length > 2) {
      setLoading(true);
      const nextPage = page + 1;
      const data = await search(query, nextPage);
      setResults((prev) => [...prev, ...data]); // ✅ ضيف على القديم
      setPage(nextPage);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={22} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* 🟢 نتائج البحث */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RenderMovieCard item={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "center" }}
        contentContainerStyle={{ paddingTop: 20 }}
        onEndReached={loadMore} // ✅ تحميل المزيد
        onEndReachedThreshold={0.5} // نص الشاشة قبل ما يوصل للنهاية
        ListEmptyComponent={
          !loading && query.length > 2 ? (
            <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
              No results found
            </Text>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#E50914"
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 15 },
  searchBar: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: "#fff", fontSize: 16 },
});
