import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useCallback } from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getBookmarks, removeBookmark } from "@/app/api/databasecommader";
import BookmarkCard from "@/app/components/BookmarkCard";
import React from "react";

export default function Bookmark() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  // 🔁 تحميل البيانات عند فتح الشاشة أو الرجوع لها
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      async function fetchBookmarks() {
        try {
          const bridge = await getBookmarks();
          if (active) setData(bridge);
        } catch (err) {
          console.error("Error loading bookmarks:", err);
        } finally {
          if (active) setLoading(false);
        }
      }

      fetchBookmarks();
      return () => {
        active = false;
      };
    }, [])
  );

  const handleRemove = useCallback(async (id: string) => {
    try {
      await removeBookmark(id);
      setData((prev) => prev.filter((item) => item.movieID !== id));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  }, []);

  // ⏳ حالة التحميل أو الخطوط
  if (!fontsLoaded || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookmarkCard item={item} onRemove={handleRemove} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Ionicons name="bookmark-outline" size={60} color="#555" />
            <Text style={styles.emptyText}>There are no saved movies yet.</Text>
          </View>
        )}
        initialNumToRender={6}
        windowSize={10}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
  },
  center: {
    flex: 1,
    height:"100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  emptyText: {
    color: "#777",
    marginTop: 10,
    fontFamily: "RobotoSlab",
    fontSize: 16,
  },
});
