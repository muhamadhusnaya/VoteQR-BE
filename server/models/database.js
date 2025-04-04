import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

// 🔍 Menentukan lokasi file database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../uploads/database.db');

// 📡 Membuka koneksi ke database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
    }
});

// 🚀 Aktifkan foreign key constraint
db.run("PRAGMA foreign_keys = ON;");

// 📌 Fungsi untuk membuat tabel
export function createTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log("🔄 Membuat ulang tabel...");

            // Tabel teams
            db.run(`
                CREATE TABLE IF NOT EXISTS teams (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    category TEXT CHECK(category IN ('Software', 'Hardware')) NOT NULL,
                    image TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error("❌ Error creating 'teams' table:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabel 'teams' dibuat.");
            });

            // Tabel tokens
            db.run(`
                CREATE TABLE IF NOT EXISTS tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    token TEXT UNIQUE NOT NULL,
                    status TEXT CHECK(status IN ('Used', 'Not Used')) DEFAULT 'Not Used',
                    pathQrcode TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error("❌ Error creating 'tokens' table:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabel 'tokens' dibuat.");
            });

            // Tabel votes
            db.run(`
                CREATE TABLE IF NOT EXISTS votes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    token_id INTEGER NOT NULL,
                    team_id INTEGER NOT NULL,
                    username TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (token_id) REFERENCES tokens(id) ON DELETE CASCADE,
                    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
                    UNIQUE (token_id)
                )
            `, (err) => {
                if (err) {
                    console.error("❌ Error creating 'votes' table:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabel 'votes' dibuat.");
                resolve(); // Resolve hanya setelah tabel terakhir selesai dibuat
            });

            // Tabel admin
            db.run(`
                CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, async (err) => {
                if (err) {
                    console.error("❌ Error creating 'admin' table:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabel 'admin' dibuat.");

                // Seeder admin default
                db.get(`SELECT COUNT(*) AS count FROM admin WHERE email = 'admin@example.com'`, async (err, row) => {
                    if (err) return console.error("❌ Gagal mengecek admin:", err.message);

                    if (row.count === 0) {
                        const hashedPassword = await bcrypt.hash('admin123', 10);
                        db.run(`INSERT INTO admin (email, password) VALUES (?, ?)`, ['admin@example.com', hashedPassword], (err) => {
                            if (err) return console.error("❌ Gagal membuat akun admin:", err.message);
                            console.log("✅ Admin default 'admin@example.com:admin123' berhasil dibuat.");
                        });
                    } else {
                        console.log("ℹ️ Admin default sudah tersedia, tidak perlu membuat ulang.");
                    }
                });
            });
        });
    });
}

// 🚀 Jalankan fungsi pembuatan tabel saat pertama kali dijalankan
createTables().catch((err) => {
    console.error(err);
});

export default db;
