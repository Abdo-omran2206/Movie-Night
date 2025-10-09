import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  StatusBar
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getActorById } from "../api/main";
import { useFonts } from "expo-font";
import RenderMovieCard from "../main/Home/components/moviecard";

export default function ActorDetails() {
  const { actorID } = useLocalSearchParams();
  const [actor, setActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function loadActor() {
      try {
        if (typeof actorID === "string") {
          const data = await getActorById(actorID);
          setActor(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActor();
  }, [actorID]);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Actor not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
        {/* صورة الممثل */}
        <View style={styles.profileWrapper}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}`,
            }}
            style={styles.profileImage}
          />
          <Text style={styles.actorName}>{actor.name}</Text>
          <Text style={styles.subInfo}>
            {actor.birthday} • {actor.place_of_birth}
          </Text>
        </View>

        {/* Biography */}
        <Text style={styles.sectionHeading}>BIOGRAPHY</Text>
        <Text style={styles.biography}>
          {actor.biography || "No biography available."}
        </Text>

        {/* Movies */}
        <View style={styles.moviesSection}>
          <Text style={styles.sectionHeading}>Filmography</Text>
          <FlatList
            horizontal
            data={actor.movie_credits.cast}
            renderItem={({ item }) => <RenderMovieCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  profileWrapper: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 180,
    height: 260,
    borderRadius: 12,
    marginBottom: 10,
  },
  actorName: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "BebasNeue",
    marginBottom: 6,
  },
  subInfo: {
    color: "#aaa",
    fontSize: 14,
    fontFamily: "RobotoSlab",
  },
  sectionHeading: {
    color: "#E50914",
    fontSize: 26,
    fontFamily: "BebasNeue",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  biography: {
    color: "#ccc",
    fontSize: 15,
    fontFamily: "RobotoSlab",
    marginHorizontal: 20,
    lineHeight: 22,
  },
  moviesSection: {
    marginVertical: 20,
  },
  movieCard: {
    width: 120,
    marginLeft: 16,
    alignItems: "center",
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "RobotoSlab",
    textAlign: "center",
  },
});
