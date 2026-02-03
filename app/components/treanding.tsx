import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SLIDE_HEIGHT = 300;

type TrendProps = {
  id: number;
  cover: string;
  movieTitle: string;
};

export default function Trend({ id, cover, movieTitle }: TrendProps) {
  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: cover }}
        style={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <Text style={styles.title}>{movieTitle}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width,
    height: SLIDE_HEIGHT,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    width: "100%",
    padding: 20,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 20,
    fontFamily: "BebasNeue",
    letterSpacing: 2,
  },
});
