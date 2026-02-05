import { useStore } from "../store/store";
import * as GuestMood from "./GustMood";
import * as OnlineMood from "./OnlineMood";

// Unified Bookmark Interface
export const BookmarkManager = {
  // ➕ Add Bookmark
  addBookmark: async (movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    type: string;
    status: string;
  }) => {
    const mood = useStore.getState().mood;
    if (mood === "Account") {
      return await OnlineMood.addBookmark(movie);
    } else {
      return await GuestMood.addBookmark(movie);
    }
  },

  // 📥 Get All Bookmarks (Normalized)
  getBookmarks: async () => {
    const mood = useStore.getState().mood;
    if (mood === "Account") {
      const onlineData = await OnlineMood.getBookmarks();
      // Normalize Online data (which now uses movieID/type) to match Guest structure
      // If OnlineMood uses the same column names as App, we just pass efficiently.
      // Online DB renamed movie_id -> movieID, media_type -> type
      return onlineData.map((item: any) => ({
        ...item,
        movieID: item.movieID, // Already correct from DB
        type: item.type,       // Already correct from DB
      }));
    } else {
      return await GuestMood.getBookmarks();
    }
  },

  // ❌ Remove Bookmark
  removeBookmark: async (id: string) => {
    const mood = useStore.getState().mood;
    if (mood === "Account") {
      return await OnlineMood.removeBookmark(id);
    } else {
      return await GuestMood.removeBookmark(id);
    }
  },

  // 🗑️ Clear Bookmarks
  clearBookmarks: async () => {
    const mood = useStore.getState().mood;
    if (mood === "Account") {
      return await OnlineMood.clearBookmarks();
    } else {
      return await GuestMood.clearBookmarks();
    }
  },

  // ✅ Check if Bookmarked
  isBookmarked: async (id: string) => {
    const mood = useStore.getState().mood;
    if (mood === "Account") {
      return await OnlineMood.isBookmarked(id);
    } else {
      return await GuestMood.isBookmarked(id);
    }
  },

  // 🔄 Update Status
  updateBookmarkStatus: async (id: string, status: string) => {
    const mood = useStore.getState().mood;
    if (mood === "Account") {
      return await OnlineMood.updateBookmarkStatus(id, status);
    } else {
      return await GuestMood.updateBookmarkStatus(id, status);
    }
  },

  // 🔄 Sync Guest Data to Online
  syncGuestToOnline: async () => {
    const guestBookmarks = await GuestMood.getBookmarks();
    
    if (guestBookmarks && guestBookmarks.length > 0) {
      // console.log(`Syncing ${guestBookmarks.length} bookmarks to cloud...`);
      
      // Upload all bookmarks using OnlineMood
      for (const item of guestBookmarks) {
        // Need to parse ID back to number if it was stored as string, 
        // or ensure addBookmark handles it. GuestMood stores movieID as string, 
        // but addBookmark expects number for 'id'.
        const numericId = parseInt(item.movieID || item.id); 
        
        await OnlineMood.addBookmark({
            id: numericId,
            title: item.title,
            overview: item.overview,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            type: item.type,
            status: item.status
        });
      }
      
      // Clear Guest DB after successful sync
      await GuestMood.clearBookmarks();
      // console.log("Sync complete. Guest DB cleared.");
    }
  },

  // 🚀 Initialize
  init: async () => {
    await GuestMood.createBookmarkTable();
  },
};
