import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMovieById } from "../../api/main";
import { useFonts } from "expo-font";
import RenderCastCard from "../../components/CastCard";
import RenderMovieCard from "../../components/MovieCard";
import TrailerModal from "@/app/components/ShowTrailer";
import BookmarkModel from "../../components/BookmarkModel";
import { useStore } from "../../store/store";
const { width, height } = Dimensions.get("window");

export default function MovieDetails() {
  const { movieID } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { webSiteUrl } = useStore();
  const onShare = async () => {
    try {
      await Share.share({
        title: "Movie Night",
        message: `Check out ${movie?.title} on Movie Night!
        ${webSiteUrl}/moviedetails/index.html?movieID=${movie.id}
        `,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function loaddata() {
      try {
        let movieData: any = null;
        if (typeof movieID === "string") {
          movieData = await getMovieById(movieID);
        } else if (Array.isArray(movieID) && movieID.length > 0) {
          movieData = await getMovieById(movieID[0]);
        }

        if (movieData) {
          setMovie(movieData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loaddata();
  }, [movieID]);

  function formatRuntime(mins: number) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}min`;
  }

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Backdrop + Poster */}
      <View style={styles.posterSection}>
        <ImageBackground
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
          }}
          style={styles.cover}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.actionButton}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.posterWrapper}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              style={styles.movieposter}
            />
          </View>
        </ImageBackground>
      </View>

      {/* Title + Bookmark */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{movie.title}</Text>
        <BookmarkModel data={movie} />
      </View>
      {/* Overview */}
      <Text style={styles.sectionHeading}>OVERVIEW</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      {/* Metadata */}
      <View style={styles.metaRow}>
        <Text style={styles.metaBox}>{movie.release_date}</Text>
        <Text style={styles.metaBox}>{formatRuntime(movie.runtime)}</Text>
        <Text style={styles.metaBox}>
          ⭐ {movie.vote_average?.toFixed(1)}/10
        </Text>
      </View>
      {/* Genres */}
      <View style={styles.genresRow}>
        {movie.genres?.map((g: any) => (
          <Text key={g.id} style={styles.genreChip}>
            {g.name}
          </Text>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          marginBottom: 20,
          marginHorizontal: 20,
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/pages/player/[player]",
              params: { player: movie.id },
            })
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 30,
            elevation: 5,
          }}
        >
          <Ionicons name="play" size={24} color="#000" />
          <Text
            style={{
              color: "#000",
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            Watch Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTrailer(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#E50914",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 30,
            elevation: 5,
          }}
        >
          <Ionicons name="play-circle-outline" size={24} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            Trailer
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.castSection}>
        <Text style={styles.castTitle}>Cast</Text>
        <View style={styles.underline}></View>
        <FlatList
          horizontal
          data={movie.credits.cast}
          renderItem={({ item }) => <RenderCastCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {movie?.similar?.results?.length > 0 && (
        <View style={styles.castSection}>
          <Text style={styles.castTitle}>Similar Movies</Text>
          <View style={styles.underline}></View>
          <FlatList
            horizontal
            data={movie.similar.results}
            renderItem={({ item }) => <RenderMovieCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      <TrailerModal
        visible={showTrailer}
        onClose={() => setShowTrailer(false)}
        movie={movie}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  posterSection: {
    flex: 1,
    width: "100%",
  },
  cover: {
    width: width,
    height: height * 0.35,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerActions: {
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  actionButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  posterWrapper: {
    alignItems: "flex-start",
    marginLeft: 25,
    marginBottom: -70, // poster يطلع على النص
  },
  movieposter: {
    width: 150,
    height: 220,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 100,
    marginHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
    flex: 1,
    marginRight: 10,
  },
  sectionHeading: {
    color: "#E50914",
    fontSize: 30,
    letterSpacing: 2,
    fontFamily: "BebasNeue",
    marginTop: 10,
    marginHorizontal: 20,
  },
  overview: {
    color: "#ccc",
    fontSize: 15,
    fontFamily: "RobotoSlab",
    marginTop: 8,
    marginHorizontal: 20,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  metaBox: {
    backgroundColor: "#E5091440",
    borderColor: "#E50914",
    borderWidth: 1,
    color: "#fff",
    fontFamily: "BebasNeue",
    letterSpacing: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
    fontSize: 15,
  },
  genresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 16,
    marginHorizontal: 22,
    gap: 8,
  },

  genreChip: {
    backgroundColor: "rgba(255, 255, 255, 0.14)", // أنعم من #B3B3B340
    borderColor: "rgba(255, 255, 255, 0.56)",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,

    // Text alignment handled better inside a Text component
    alignSelf: "flex-start",
    color: "#fff",
    fontFamily: "RobotoSlab",
    fontSize: 13,
    textAlign: "center",
  },
  castSection: {
    marginTop: 5,
    marginBottom: 20,
  },
  castTitle: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 35,
    letterSpacing: 1,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  underline: {
    height: 3,
    width: 80,
    backgroundColor: "#E50914",
    marginTop: 0,
    marginLeft: 16,
    marginBottom: 12,
    borderRadius: 2,
  },
});
