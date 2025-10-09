import * as SQLite from "expo-sqlite";

// 🧱 اسم قاعدة البيانات
const DB_NAME = "Movie_Night.db";
let db: SQLite.SQLiteDatabase | null = null;

// ✅ فتح قاعدة البيانات بأمان
export async function getDB() {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    return db;
  } catch (error) {
    console.error("❌ Failed to open database:", error);
    throw error;
  }
}

// 🛠️ إنشاء جدول الـ Bookmarks
export async function createBookmarkTable() {
  const database = await getDB();

  if (!database) {
    throw new Error("Database is null, cannot create table");
  }

  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bookmark (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movieID TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        overview TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("❌ Error creating bookmark table:", JSON.stringify(error, null, 2));
    throw new Error("Failed to create bookmark table");
  }
}

// ➕ إضافة Bookmark جديد
export async function addBookmark(movie: {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  type:string
}) {
  const database = await getDB();
  try {
    await database.runAsync(
      `INSERT OR IGNORE INTO bookmark (movieID, title, overview, poster_path, backdrop_path,type)
       VALUES (?, ?, ?, ?, ?,?)`,
      [
        movie.id.toString(),
        movie.title,
        movie.overview,
        movie.poster_path,
        movie.backdrop_path,
        movie.type
      ]
    );
  } catch (error) {
    console.error("❌ Error adding bookmark:", error);
  }
}

// 📥 جلب كل الـ Bookmarks
export async function getBookmarks() {
  const database = await getDB();
  try {
    const rows = await database.getAllAsync(
      `SELECT * FROM bookmark ORDER BY id DESC`
    );
    return rows;
  } catch (error) {
    console.error("❌ Error fetching bookmarks:", error);
    return [];
  }
}

// ❌ حذف Bookmark واحد
export async function removeBookmark(id: string) {
  const database = await getDB();
  try {
    await database.runAsync(`DELETE FROM bookmark WHERE movieID = ?`, [id]);
    
  } catch (error) {
    console.error("❌ Error removing bookmark:", error);
  }
}

// 🗑️ حذف كل الـ Bookmarks
export async function clearBookmarks() {
  const database = await getDB();
  try {
    await database.runAsync(`DELETE FROM bookmark`);
  } catch (error) {
    console.error("❌ Error clearing bookmarks:", error);
  }
}

// ✅ التحقق إذا الفيلم موجود بالفعل
export async function isBookmarked(movieID: string) {
  const database = await getDB();
  try {
    const row = await database.getFirstAsync(
      `SELECT 1 FROM bookmark WHERE movieID = ? LIMIT 1`,
      [movieID]
    );
    
    return !!row; // true لو موجود، false لو لأ
  } catch (error) {
    console.error("❌ Error checking bookmark:", error);
    return false;
  }
}
