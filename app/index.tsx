import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import Navbar from "./components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/app/store/store";
import Home from "@/app/pages/Home";
import Bookmark from "@/app/pages/Bookmark";
import Explore from "@/app/pages/Explore";
import Account from "./pages/Profile";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const { page } = useStore();

  useEffect(() => {
    // 🌐 Subscribe to network state
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Keep a simple splash delay in index
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {loading ? (
          <>
            <LoadingMainBox isConnected={isConnected} />
          </>
        ) : (
          <>
            <StatusBar
              style="light"
              translucent
              backgroundColor="transparent"
            />
            <View style={styles.mainContent}>
              {page === "Home" && <Home />}
              {page === "Bookmark" && <Bookmark />}
              {page === "Explore" && <Explore />}
              {page === "Account" && <Account />}
            </View>
            <Navbar />
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

function LoadingMainBox({ isConnected }: { isConnected: boolean | null }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar
        style="light"
        translucent
        backgroundColor="transparent"
        hidden
      />
      <View style={styles.center}>
        <Text style={styles.h1}>Movie</Text>
        <Text style={styles.h2}>Night</Text>

        {isConnected === false ? (
          <View style={styles.offlineContainer}>
            <Ionicons name="cloud-offline-outline" size={50} color="#E50914" />
            <Text style={styles.offlineText}>No Internet Connection</Text>
            <Text style={styles.offlineSubText}>
              Please check your network settings.
            </Text>
          </View>
        ) : (
          <ActivityIndicator
            size="large"
            color="#E50914"
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    </View>
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
  offlineContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  offlineText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "BebasNeue",
    marginTop: 10,
    letterSpacing: 1,
  },
  offlineSubText: {
    color: "#777",
    fontSize: 14,
    fontFamily: "RobotoSlab",
    marginTop: 5,
  },
});
