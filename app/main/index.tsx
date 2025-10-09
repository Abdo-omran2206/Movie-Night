import { View, StyleSheet, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Home from "./Home/home";
import Search from "./search/search";
import Bookmark from "./bookmark/bookmark";
import { createBookmarkTable } from "../api/databasecommader";
import Explore from "./Explore/explore";
export default function Index() {
  const [page, setPage] = useState("Home");
  useEffect(() => {
    (async () => {
      try {
        // ✅ ثم أنشئ الجدول
        await createBookmarkTable();
      } catch (err) {
        console.error("App init error:", err);
      }
    })();
  }, []);
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        {/* Main screen content */}
        <View style={styles.mainContent}>
          {page === "Home" && <Home />}
          {page === "Search" && <Search />}
          {page === "Bookmark" && <Bookmark />}
          {page === "explore" && <Explore />}
        </View>

        {/* Bottom navigator */}
        <View style={styles.navigator}>
          <Ionicons
            name="home"
            size={30}
            color={page === "Home" ? "#E50914" : "#fff"}
            onPress={() => setPage("Home")}
          />
          <Ionicons
            name="compass"
            size={30}
            color={page === "explore" ? "#E50914" : "#fff"}
            onPress={() => setPage("explore")}
          />
          <Ionicons
            name="search"
            size={30}
            color={page === "Search" ? "#E50914" : "#fff"}
            onPress={() => setPage("Search")}
          />
          <Ionicons
            name="bookmark"
            size={30}
            color={page === "Bookmark" ? "#E50914" : "#fff"}
            onPress={() => setPage("Bookmark")}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "BebasNeue",
  },
  navigator: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",

    // 🎨 Glass effect
    backgroundColor: "rgba(59,59,59,0.3)", // semi-transparent dark bg
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
});
