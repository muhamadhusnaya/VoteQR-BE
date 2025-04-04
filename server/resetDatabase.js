import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { createTables } from "./models/database.js";

const uploadsDir = path.resolve("server", "uploads");
const dbFilePath = path.join(uploadsDir, "database.db");

// 🔧 Pastikan folder 'uploads' ada
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📂 Folder 'uploads' telah dibuat.");
}

// 🔄 Tutup koneksi database sebelum reset
function tutupDatabase(callback) {
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if (!err) {
            db.exec("PRAGMA wal_checkpoint(FULL); PRAGMA journal_mode = DELETE;", (err) => {
                db.close((err) => {
                    if (!err) {
                        console.log("✅ Koneksi database ditutup.");
                        setTimeout(callback, 2000);
                    } else {
                        console.error("❌ Gagal menutup koneksi database:", err.message);
                        callback();
                    }
                });
            });
        } else {
            console.warn("⚠ Database tidak terbuka atau sudah ditutup.");
            callback();
        }
    });
}

// 🔥 Reset database tanpa menghapus file
function resetDatabase() {
    const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error("❌ Error saat membuka database:", err.message);
            return;
        }

        db.serialize(() => {
            db.exec(`
                PRAGMA foreign_keys = OFF;
                DROP TABLE IF EXISTS votes;
                DROP TABLE IF EXISTS tokens;
                DROP TABLE IF EXISTS teams;
                PRAGMA foreign_keys = ON;
            `, (err) => {
                if (err) {
                    console.error("❌ Gagal mereset database:", err.message);
                } else {
                    console.log("🔄 Semua tabel telah dihapus.");
                    createTables()
                        .then(() => {
                            console.log("✅ Database telah dibuat ulang dengan tabel kosong.");
                            db.close();
                            process.exit();
                        })
                        .catch((err) => console.error("❌ Error saat membuat ulang tabel:", err));
                }
            });
        });
    });
}

// 🚀 Jalankan proses reset database
tutupDatabase(resetDatabase);
