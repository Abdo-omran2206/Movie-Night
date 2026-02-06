import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BookmarkManager } from "../api/BookmarkManager";
import { useFocusEffect } from "@react-navigation/native";
import { useStore } from "../store/store";
import { useRouter } from "expo-router";
import { supabase } from "../api/supabase";

const { width } = Dimensions.get("window");

export default function Account() {
  const { mood, setMood, user, setUser, setPage } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    watching: 0,
    watchLater: 0,
    completed: 0,
    dropped: 0,
    total: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const allBookmarks: any = await BookmarkManager.getBookmarks();
      if (allBookmarks) {
        const counts = allBookmarks.reduce(
          (acc: any, curr: any) => {
            if (curr.status === "Watching") acc.watching++;
            else if (curr.status === "Watch Later") acc.watchLater++;
            else if (curr.status === "Completed") acc.completed++;
            else if (curr.status === "Dropped") acc.dropped++;
            return acc;
          },
          { watching: 0, watchLater: 0, completed: 0, dropped: 0 },
        );
        setStats({ ...counts, total: allBookmarks.length });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    // Auth is now handled globally in app/index.tsx
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await supabase.auth.signOut();
            setMood("Guest");
            setUser(null);
            if (Platform.OS === "android") {
              ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
            }
            setPage("Home");
            router.replace("/");
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  if (mood === "Guest") {
    return (
      <>
        <AccountRequired router={router} />
      </>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 👤 Profile Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: `https://api.dicebear.com/9.x/initials/png?seed=${
                user?.user_metadata?.username || user?.email || "Guest"
              }&backgroundColor=E50914`,
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatar}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>
          {user?.user_metadata?.username ||
            user?.email?.split("@")[0] ||
            "Username"}
        </Text>
        <Text style={styles.userHandle}>
          @{user?.user_metadata?.username || "user_handle"}
        </Text>
      </View>

      {/* 📊 Stats Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Watched</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Hours Watched</Text>
          <Text style={styles.statValue}>
            {Math.round(stats.completed * 1.8)}h
          </Text>
        </View>
      </View>

      {/* 🎬 My Movies Section */}
      <Text style={styles.sectionTitle}>My Movies</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.movieCategory}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: "rgba(76, 175, 80, 0.1)" },
            ]}
          >
            <Ionicons name="play" size={24} color="#4CAF50" />
          </View>
          <View>
            <Text style={styles.categoryLabel}>Watching</Text>
            <Text style={styles.categoryCount}>{stats.watching} movies</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.movieCategory}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: "rgba(33, 150, 243, 0.1)" },
            ]}
          >
            <Ionicons name="time" size={24} color="#2196F3" />
          </View>
          <View>
            <Text style={styles.categoryLabel}>Watch Later</Text>
            <Text style={styles.categoryCount}>{stats.watchLater} movies</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.movieCategory}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: "rgba(156, 39, 176, 0.1)" },
            ]}
          >
            <Ionicons name="checkmark-done" size={24} color="#9C27B0" />
          </View>
          <View>
            <Text style={styles.categoryLabel}>Completed</Text>
            <Text style={styles.categoryCount}>{stats.completed} movies</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.movieCategory}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: "rgba(244, 67, 54, 0.1)" },
            ]}
          >
            <Ionicons name="close" size={24} color="#F44336" />
          </View>
          <View>
            <Text style={styles.categoryLabel}>Dropped</Text>
            <Text style={styles.categoryCount}>{stats.dropped} movie</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ⚙️ Settings Section */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsBox}>
        {/* <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="menu-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="contrast-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Theme: Dark / AMOLED</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={22} color="#fff" />
            <Text style={styles.settingText}>Language</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555" />
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomWidth: 0 }]}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="log-out-outline" size={22} color="#E50914" />
            <Text style={[styles.settingText, { color: "#E50914" }]}>
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E50914",
    backgroundColor: "#1C1C1E",
  },
  editAvatar: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#E50914",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  userName: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#fff",
    letterSpacing: 1,
  },
  userHandle: {
    fontFamily: "RobotoSlab",
    fontSize: 14,
    color: "#777",
    marginTop: -5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  statBox: {
    width: (width - 45) / 2,
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  statLabel: {
    color: "#777",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  statLabelSmall: {
    color: "#777",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: 5,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statValue: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "BebasNeue",
  },
  sectionTitle: {
    fontFamily: "BebasNeue",
    fontSize: 24,
    color: "#fff",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 15,
    letterSpacing: 1,
  },
  movieCategory: {
    width: (width - 45) / 2,
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoryCount: {
    color: "#777",
    fontSize: 11,
  },
  settingsBox: {
    backgroundColor: "#1C1C1E",
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 15,
    fontFamily: "RobotoSlab",
  },
});

function AccountRequired({ router }: { router: any }) {
  return (
    <View style={style.container}>
      <Text style={style.title}>Account Required</Text>

      <Text style={style.subtitle}>
        You need to create an account or sign in to continue.
      </Text>

      <TouchableOpacity
        style={style.primaryBtn}
        onPress={() => router.push("/pages/account/register")}
      >
        <Text style={style.primaryText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style.secondaryBtn}
        onPress={() => router.push("/pages/account/login")}
      >
        <Text style={style.secondaryText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: "#E50914",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryBtn: {
    padding: 10,
  },
  secondaryText: {
    color: "#E50914",
    fontSize: 14,
  },
});
