import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import React from "react";
import Navbar from "./components/Navbar";
import { useStore } from "@/app/store/store";
import { createBookmarkTable } from "@/app/api/databasecommader";
import Home from "@/app/pages/Home";
import Search from "@/app/pages/Search";
import Bookmark from "@/app/pages/Bookmark";
import Explore from "@/app/pages/Explore";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const { page } = useStore();

  useEffect(() => {
    (async () => {
      try {
        await createBookmarkTable();
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        console.error("App init error:", err);
      }
    })();
  }, []);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  // Show splash screen until fonts load
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        {loading ? (
          <>
            <StatusBar hidden barStyle="light-content" backgroundColor="#000" />
            <LoadingMainBox />
          </>
        ) : (
          <>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.mainContent}>
              {page === "Home" && <Home />}
              {page === "Search" && <Search />}
              {page === "Bookmark" && <Bookmark />}
              {page === "Explore" && <Explore />}
            </View>
            <Navbar />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function LoadingMainBox() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={styles.center}>
          <Text style={styles.h1}>Movie</Text>
          <Text style={styles.h2}>Night</Text>
          <ActivityIndicator
            size="large"
            color="#E50914"
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 120,
    fontFamily: "BebasNeue",
    letterSpacing: 5,
    color: "#E50914",
  },
  h2: {
    fontSize: 100,
    fontFamily: "BebasNeue",
    letterSpacing: 5,
    color: "#E50914",
  },
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
});
