import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useStore } from "../store/store";

export default function Navbar() {
  const { page, setPage } = useStore();
  return (
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
        color={page === "Explore" ? "#E50914" : "#fff"}
        onPress={() => setPage("Explore")}
      />
      <Ionicons
        name="bookmark"
        size={30}
        color={page === "Bookmark" ? "#E50914" : "#fff"}
        onPress={() => setPage("Bookmark")}
      />
      <Ionicons
        name="person"
        size={30}
        color={page === "Account" ? "#E50914" : "#fff"}
        onPress={() => setPage("Account")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
