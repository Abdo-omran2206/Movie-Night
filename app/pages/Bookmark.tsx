import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getBookmarks, removeBookmark } from "@/app/api/databasecommader";
import BookmarkCard from "@/app/components/BookmarkCard";
const { height } = Dimensions.get("window");

export default function Bookmark() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>();
  const [renderData, setRenderData] = useState<any>([]);
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
    }, []),
  );

  useEffect(() => {
    if (!filter || filter === "All") {
      setRenderData(data);
    } else {
      const filtered = data.filter((item) => item.status === filter);
      setRenderData(filtered);
    }
  }, [filter, data]);

  const handleRemove = useCallback(async (id: string) => {
    try {
      await removeBookmark(id);
      setData((prev) => prev.filter((item) => item.movieID !== id));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  }, []);

  const options = [
    { icon: "apps", label: "All", color: "#fff" },
    { icon: "play", label: "Watching", color: "#4CAF50" },
    { icon: "time", label: "Watch Later", color: "#2196F3" },
    { icon: "checkmark-done", label: "Completed", color: "#9C27B0" },
    { icon: "close-circle", label: "Dropped", color: "#F44336" },
  ];
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
          backgroundColor: "#111",
        }}
      >
        {options.map((item) => {
          const isActive =
            filter === item.label || (!filter && item.label === "All");
          return (
            <Pressable
              key={item.label}
              style={{
                alignItems: "center",
                flex: 1,
                opacity: isActive ? 1 : 0.5,
                transform: [{ scale: isActive ? 1.1 : 1 }],
              }}
              onPress={() => setFilter(item.label)}
            >
              <Ionicons name={item.icon as any} size={22} color={item.color} />
              <Text
                style={{
                  color: isActive ? item.color : "#fff",
                  fontSize: 10,
                  marginTop: 4,
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={renderData}
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
    height: height,
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
