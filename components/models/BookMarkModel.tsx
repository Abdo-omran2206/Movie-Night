"use client";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Bookmark } from "@/constant/types";
import {
  fetchIsBookMarked,
  removeBookMark,
  addBookMark,
  UpdateBookMark,
} from "@/lib/services/BookmarkManager";
import { toast } from "react-toastify";
import { FaBookmark, FaPlay, FaRegBookmark, FaTimes } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineFilm } from "react-icons/hi";

export default function BookMarkModel({
  movieID,
  title,
  overview,
  backdrop,
  poster,
  type,
}: Bookmark) {
  const [isBookmark, setBookmark] = useState(false);
  const [isBookmarkModel, setIsBookmarkModel] = useState(false);
  const [status, setStatus] = useState("");
  const userID = useUserStore((state) => state.user);

  useEffect(() => {
    if (!userID?.id) return;

    const fetchStatus = async () => {
      const bookmarked = await fetchIsBookMarked(movieID);
      if (bookmarked.length > 0) {
        setBookmark(true);
        setStatus(bookmarked[0].status);
      } else {
        setBookmark(false);
        setStatus("");
      }
    };

    fetchStatus();
  }, [movieID, userID]);

  const handleToggleBookmark = () => {
    setIsBookmarkModel(true);
  };

  const handleRemoveFromBookmark = async () => {
    const result = await removeBookMark(movieID);
    if (result.success) {
      toast.success("Removed from Bookmark 🗑");
      setBookmark(false);
      setStatus("");
    } else {
      toast.error("Failed to remove ❌");
    }
  };

  const handleUpdateBookmark = async (newStatus: string) => {
    const result = await UpdateBookMark(movieID, newStatus);
    if (result.success) {
      toast.success(`Bookmark updated to "${newStatus}" 🎬`);
      setBookmark(true);
      setStatus(newStatus);
    } else {
      toast.error("Failed to update ❌");
    }
  };

  const handleAddToBookmark = async (newStatus: string) => {
    const result = await addBookMark(
      movieID,
      title,
      overview,
      backdrop || "",
      poster,
      type,
      newStatus
    );
    if (result.success) {
      toast.success(`Added to Bookmark as "${newStatus}" ✅`);
      setBookmark(true);
      setStatus(newStatus);
    } else {
      toast.error("Failed to add ❌");
    }
  };

  if (!userID?.id) return null;

  return (
    <div
      onClick={handleToggleBookmark}
      className="flex justify-center items-center"
    >
      <div className="relative group">
        {isBookmark ? (
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

        {/* Tooltip */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10">
          {isBookmarkModel ? status || "In Bookmark" : "Add to Bookmark"}
        </span>
      </div>

      {isBookmarkModel && (
        <BookmarkModal
          setIsOpen={setIsBookmarkModel}
          status={status}
          setStatus={setStatus}
          isBookmark={isBookmark}
          setBookmark={setBookmark}
          title={title}
          handleAddToBookmark={handleAddToBookmark}
          handleRemoveFromBookmark={handleRemoveFromBookmark}
          handleUpdateBookmark={handleUpdateBookmark}
        />
      )}
    </div>
  );
}

// ─── Status Options ──────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  {
    icon: FaPlay,
    label: "Watching",
    color: "#4CAF50",
    bgGlow: "rgba(76,175,80,0.15)",
    borderActive: "#4CAF50",
    description: "Currently watching",
  },
  {
    icon: MdOutlineAccessTimeFilled,
    label: "Watch Later",
    color: "#2196F3",
    bgGlow: "rgba(33,150,243,0.15)",
    borderActive: "#2196F3",
    description: "Add to queue",
  },
  {
    icon: IoCheckmarkCircle,
    label: "Completed",
    color: "#9C27B0",
    bgGlow: "rgba(156,39,176,0.15)",
    borderActive: "#9C27B0",
    description: "Finished watching",
  },
  {
    icon: IoCloseCircle,
    label: "Dropped",
    color: "#F44336",
    bgGlow: "rgba(244,67,54,0.15)",
    borderActive: "#F44336",
    description: "Stopped watching",
  },
];

// ─── Modal Component ─────────────────────────────────────────────────────────

function BookmarkModal({
  setIsOpen,
  status,
  setStatus,
  isBookmark,
  setBookmark,
  title,
  handleAddToBookmark,
  handleRemoveFromBookmark,
  handleUpdateBookmark,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  isBookmark: boolean;
  setBookmark: Dispatch<SetStateAction<boolean>>;
  title: string;
  handleAddToBookmark: (status: string) => void;
  handleRemoveFromBookmark: () => void;
  handleUpdateBookmark: (status: string) => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsOpen(false), 220);
  };

  const handleSelectStatus = async (newStatus: string) => {
    setLoadingStatus(newStatus);
    if (isBookmark) {
      await handleUpdateBookmark(newStatus);
    } else {
      await handleAddToBookmark(newStatus);
    }
    setLoadingStatus(null);
    handleClose();
  };

  const handleRemove = async () => {
    setLoadingStatus("remove");
    await handleRemoveFromBookmark();
    setBookmark(false);
    setStatus("");
    setLoadingStatus(null);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: isClosing
          ? "fadeOut 0.22s ease forwards"
          : "fadeIn 0.22s ease forwards",
      }}
    >
      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bookmark options"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isClosing
            ? "slideDown 0.22s ease forwards"
            : "slideUp 0.22s ease forwards",
        }}
        className="w-full max-w-[420px] mx-4 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Glass card */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.98) 100%)",
            border: "1px solid rgba(229,9,20,0.18)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.8), 0 0 40px rgba(229,9,20,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="relative flex items-center justify-between px-6 pt-6 pb-4"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Red accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #e50914, #ff4d4f, transparent)",
              }}
            />

            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background: "rgba(229,9,20,0.12)",
                  border: "1px solid rgba(229,9,20,0.25)",
                }}
              >
                <HiOutlineFilm className="text-red-500" size={18} />
              </div>
              <div>
                <h2
                  className="text-white font-bold tracking-wider text-lg leading-tight"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  My Bookmark
                </h2>
                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 max-w-[200px]">
                  {title}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close bookmark modal"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-white/10 hover:cursor-pointer"
              style={{ color: "#888" }}
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Status label */}
          <div className="px-6 pt-4 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {isBookmark ? "Update Status" : "Choose Status"}
            </p>
          </div>

          {/* Status Options */}
          <ul className="px-6 pb-4 grid gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = status === opt.label;
              const isLoading = loadingStatus === opt.label;

              return (
                <li key={opt.label}>
                  <button
                    type="button"
                    id={`bookmark-status-${opt.label.toLowerCase().replace(" ", "-")}`}
                    disabled={isLoading}
                    onClick={() => handleSelectStatus(opt.label)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between hover:cursor-pointer group/btn relative overflow-hidden"
                    style={{
                      background: isSelected
                        ? opt.bgGlow
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        isSelected
                          ? opt.borderActive
                          : "rgba(255,255,255,0.07)"
                      }`,
                      boxShadow: isSelected
                        ? `0 0 16px ${opt.bgGlow}, inset 0 0 16px ${opt.bgGlow}`
                        : "none",
                    }}
                  >
                    {/* Hover shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                      }}
                    />

                    <span className="flex items-center gap-3 z-10">
                      {/* Icon circle */}
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-transform duration-200 group-hover/btn:scale-110"
                        style={{
                          background: `${opt.bgGlow}`,
                          border: `1px solid ${opt.color}33`,
                        }}
                      >
                        {isLoading ? (
                          <span
                            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: `${opt.color} transparent` }}
                          />
                        ) : (
                          <opt.icon color={opt.color} size={15} />
                        )}
                      </span>

                      <span className="flex flex-col">
                        <span
                          className="text-sm font-semibold leading-tight"
                          style={{
                            color: isSelected ? opt.color : "#e0e0e0",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span className="text-xs text-gray-500 leading-tight">
                          {opt.description}
                        </span>
                      </span>
                    </span>

                    {/* Selected badge */}
                    {isSelected && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full z-10 flex-shrink-0"
                        style={{
                          background: `${opt.color}22`,
                          color: opt.color,
                          border: `1px solid ${opt.color}44`,
                        }}
                      >
                        Active
                      </span>
                    )}
                  </button>
                </li>
              );
            })}

            {/* Remove Option — only when already in bookmark */}
            {isBookmark && (
              <li>
                <button
                  type="button"
                  id="bookmark-remove-btn"
                  disabled={loadingStatus === "remove"}
                  onClick={handleRemove}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 hover:cursor-pointer group/remove"
                  style={{
                    background: "rgba(229,9,20,0.06)",
                    border: "1px solid rgba(229,9,20,0.2)",
                  }}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-transform duration-200 group-hover/remove:scale-110"
                    style={{
                      background: "rgba(229,9,20,0.1)",
                      border: "1px solid rgba(229,9,20,0.3)",
                    }}
                  >
                    {loadingStatus === "remove" ? (
                      <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 size={14} className="text-red-500" />
                    )}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-red-400 leading-tight">
                      Remove from Bookmark
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">
                      Permanently remove this entry
                    </span>
                  </span>
                </button>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-gray-600">
              {isBookmark
                ? `Currently: `
                : "Track what you're watching"}
              {isBookmark && (
                <span className="text-gray-400 font-medium">{status}</span>
              )}
            </p>
            <button
              type="button"
              id="bookmark-cancel-btn"
              onClick={handleClose}
              className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-all duration-200 hover:bg-white/8 hover:cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(24px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}
