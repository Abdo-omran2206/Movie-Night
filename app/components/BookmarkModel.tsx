import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BookmarkManager } from "../api/BookmarkManager";

interface BookmarkModalProps {
  data: any;
}

export default function BookmarkModal({ data }: BookmarkModalProps) {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isbookmarked = !!currentStatus;

  useEffect(() => {
    async function checkStatus() {
      if (data?.id) {
        const status = await BookmarkManager.isBookmarked(data.id.toString());
        setCurrentStatus(status);
      }
    }
    checkStatus();
  }, [data]);

  async function handleBookmarkSelection(status: string) {
    if (!data) return;

    try {
      if (isbookmarked) {
        // If already bookmarked, update the status
        await BookmarkManager.updateBookmarkStatus(data.id.toString(), status);
      } else {
        // If not bookmarked, add a new one
        await BookmarkManager.addBookmark({
          id: data.id,
          title: data.title || data.name, // Handle both movies and TV shows
          overview: data.overview,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          type: data.title ? "movie" : "tv",
          status: status,
        });
      }
      setCurrentStatus(status);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error handling bookmark selection:", error);
    }
  }

  async function handleRemoveBookmark() {
    if (!data) return;

    try {
      await BookmarkManager.removeBookmark(data.id.toString());
      setCurrentStatus(null);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error removing bookmark:", error);
    }
  }

  const options = [
    { icon: "play", label: "Watching", color: "#4CAF50" },
    { icon: "time", label: "Watch Later", color: "#2196F3" },
    { icon: "checkmark-done", label: "Completed", color: "#9C27B0" },
    { icon: "close-circle", label: "Dropped", color: "#F44336" },
  ];

  return (
    <View>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <Ionicons
          name={isbookmarked ? "bookmark" : "bookmark-outline"}
          size={28}
          color={isbookmarked ? "#FED400" : "#fff"}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Bookmark Options</Text>

            {options.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[
                  styles.optionButton,
                  currentStatus === opt.label && styles.selectedOption,
                ]}
                onPress={() => handleBookmarkSelection(opt.label)}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={24}
                  color={opt.color}
                  style={{ marginRight: 15 }}
                />
                <Text
                  style={[
                    styles.optionText,
                    currentStatus === opt.label && {
                      color: opt.color,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                {currentStatus === opt.label && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={opt.color}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            ))}

            {isbookmarked && (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { marginTop: 10, borderBottomWidth: 0 },
                ]}
                onPress={handleRemoveBookmark}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="#FF3B30"
                  style={{ marginRight: 15 }}
                />
                <Text style={[styles.optionText, { color: "#FF3B30" }]}>
                  Remove Bookmark
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "100%",
    padding: 24,
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
    borderRadius: 12,
  },
  selectedOption: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2C2C2E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
