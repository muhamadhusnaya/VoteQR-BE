import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../uploads/database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Terhubung ke database SQLite');
    }
});

// Buat tabel token jika belum ada
db.run(`
    CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT UNIQUE NOT NULL,
        status TEXT CHECK(status IN ('Used', 'Not Used')) DEFAULT 'Not Used',
        pathQrcode TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

export default db;