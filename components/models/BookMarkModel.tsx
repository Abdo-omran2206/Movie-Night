"use client";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FaPlay } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { fetchIsBookMarked, removeBookMark, addBookMark } from "@/lib/services/BookmarkManager";
import { useUserStore } from "@/store/useUserStore";
import { Bookmark } from "@/constant/types";

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
  const userID = useUserStore((state) => state.userId);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!userID) return;

      const bookmarked = await fetchIsBookMarked(userID, movieID);
      if (bookmarked.length > 0) {
        setIsBookmarked(true);
        setStatus(bookmarked[0].status);
      } else {
        setIsBookmarked(false);
      }
    };

    fetchBookmarkStatus();
  }, [movieID, userID]);

  const handleToogleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false);
      removeBookMark(userID, movieID);
      setStatus("");
      return;
    }
    setISWatchList(true);
  };

  const handleAddbookmark = (statusParam?: string) => {
    const finalStatus = statusParam ?? status;
    addBookMark(
      userID,
      movieID,
      title,
      overview,
      backdrop || "",
      poster,
      type,
      finalStatus
    );
  };
  if(!userID){
    return(
      <>
      </>
    )
  }
  return (
    <div
      onClick={handleToogleBookmark}
      className="flex justify-center items-center "
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
          isModel={setISWatchList}
          setStatus={setStatus}
          setIsBookmarked={setIsBookmarked}
          handleAddbookmark={handleAddbookmark}
        />
      ) : null}
    </div>
  );
}

function WatchListModel({
  isModel,
  setStatus,
  setIsBookmarked,
  handleAddbookmark,
}: {
  isModel: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<string>>;
  setIsBookmarked: Dispatch<SetStateAction<boolean>>;
  handleAddbookmark: (status?: string) => void;
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
                onClick={() => {
                  setSelection(opt.label);
                  setStatus(opt.label); // ✅ مهم
                  setIsBookmarked(true); // ✅ يعمل bookmark
                  isModel(false);
                  handleAddbookmark(opt.label);
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
        </ul>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition"
            onClick={() => {
              setSelection(null);
              isModel(false);
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
