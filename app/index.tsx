import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      router.replace("/main");
    }, 5000);
  }, []);

  // Show splash screen until fonts load
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Main UI once fonts are ready
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
});
