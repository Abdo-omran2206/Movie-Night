"use client";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import {
  fetchIsBookMarked,
  removeBookMark,
  addBookMark,
  UpdateBookMark,
} from "@/lib/services/BookmarkManager";
import { useUserStore } from "@/store/useUserStore";
import { Bookmark } from "@/constant/types";
import { toast } from "react-toastify";

export default function BookMarkModel({
  movieID,
  title,
  overview,
  backdrop,
  poster,
  type,
}: Bookmark) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isWatshList, setISWatchList] = useState(false);
  const [status, setStatus] = useState("");
  const userID = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const bookmarked = await fetchIsBookMarked(movieID);
      if (bookmarked.length > 0) {
        setIsBookmarked(true);
        setStatus(bookmarked[0].status);
      } else {
        setIsBookmarked(false);
      }
    };

    fetchBookmarkStatus();
  }, [movieID]);

  const handleToogleBookmark = async () => {
    setISWatchList(true);
  };

  const handleRemoveBookMark = async () => {
    const isbookmarkremoved = await removeBookMark(movieID);
    if (isbookmarkremoved.success) {
      toast.success("Removed from bookmarks 🗑");
      setIsBookmarked(false);
      return;
    } else {
      toast.error("Failed to remove bookmark ❌");
    }
  };

  const handleUpdateBookMark = async (statusParam?: string) => {
    const finalStatus = statusParam ?? status;
    const updateBookMark = await UpdateBookMark(movieID, finalStatus);
    if (updateBookMark.success) {
      toast.success(`Bookmark updated to ${finalStatus} 🎬`);
      setIsBookmarked(true);
      return;
    } else {
      toast.error("Failed to update bookmark ❌");
    }
  };

  const handleAddbookmark = async (statusParam?: string) => {
    const finalStatus = statusParam ?? status;
    const newbookmark = await addBookMark(
      movieID,
      title,
      overview,
      backdrop || "",
      poster,
      type,
      finalStatus,
    );
    if (newbookmark.success) {
      toast.success("Added to bookmarks ✅");
      setIsBookmarked(true);
    } else {
      toast.error("Failed to add bookmark ❌");
    }
  };

  if (!userID?.id) {
    return <></>;
  }
  return (
    <div
      onClick={handleToogleBookmark}
      className="flex justify-center items-center"
    >
      {isBookmarked ? (
        <FaBookmark
          size={30}
          color="#ffff00"
          className="flex hover:scale-125 transition-all duration-100 hover:cursor-pointer"
        />
      ) : (
        <FaRegBookmark
          size={30}
          color="#ffffff"
          className="flex hover:scale-125 transition-all duration-100 hover:cursor-pointer"
        />
      )}
      {isWatshList ? (
        <WatchListModel
          setisModel={setISWatchList}
          setStatus={setStatus}
          isBookmarked={isBookmarked}
          handleAddbookmark={handleAddbookmark}
          handleRemoveBookMark={handleRemoveBookMark}
          handleUpdateBookMark={handleUpdateBookMark}
        />
      ) : null}
    </div>
  );
}

function WatchListModel({
  setisModel,
  setStatus,
  isBookmarked,
  handleAddbookmark,
  handleRemoveBookMark,
  handleUpdateBookMark,
}: {
  setisModel: Dispatch<SetStateAction<boolean>>;
  isBookmarked: boolean;
  setStatus: Dispatch<SetStateAction<string>>;
  handleAddbookmark: (status?: string) => void;
  handleRemoveBookMark: (status?: string) => void;
  handleUpdateBookMark: (status?: string) => void;
}) {
  const [selection, setSelection] = useState<string | null>(null);
  const options = [
    { icon: FaPlay, label: "Watching", color: "#4CAF50" },
    { icon: MdOutlineAccessTimeFilled, label: "Watch Later", color: "#2196F3" },
    { icon: IoCheckmarkCircle, label: "Completed", color: "#9C27B0" },
    { icon: IoCloseCircle, label: "Dropped", color: "#F44336" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        e.stopPropagation(); // ✅ يمنع وصول الكليك للـ parent
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md bg-neutral-900 text-white rounded-xl shadow-xl p-6 mx-4"
      >
        <div className="flex items-center justify-center mb-4">
          <h4 className="text-2xl text-center tracking-widest font-semibold">
            Bookmark Options
          </h4>
        </div>

        <ul className="grid gap-3">
          {options.map((opt, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={async () => {
                  const status = opt.label;

                  setSelection(status);
                  setStatus(status);
                  setisModel(false);

                  if (isBookmarked) {
                    await handleUpdateBookMark(status);
                  } else {
                    await handleAddbookmark(status);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-md border transition-colors duration-150 flex items-center justify-between hover:cursor-pointer ${
                  selection === opt.label
                    ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-800/80"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-xl">
                    <opt.icon color={opt.color} />
                  </span>
                  <span className="font-medium">{opt.label}</span>
                </span>
                {selection === opt.label ? (
                  <span className="text-sm text-yellow-300">Selected</span>
                ) : null}
              </button>
            </li>
          ))}

          {isBookmarked && (
            <li>
              <button
                type="button"
                onClick={() => {
                  setSelection("Delete");
                  setisModel(false);
                  handleRemoveBookMark();
                }}
                className="w-full text-left px-4 py-3 rounded-md border transition-all duration-200 flex items-center justify-between hover:cursor-pointer bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
              >
                <span className="flex items-center gap-3">
                  <FiTrash2 className="text-xl text-red-400" />
                  <span className="font-medium text-red-400">
                    Remove from Watchlist
                  </span>
                </span>

                <span className="text-sm text-red-400/70">Delete</span>
              </button>
            </li>
          )}
        </ul>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition"
            onClick={() => {
              setSelection(null);
              setisModel(false);
              setStatus("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
