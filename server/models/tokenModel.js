import sqlite3 from 'sqlite3';
import path from 'path';


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
        token TEXT UNIQUE,
        status TEXT DEFAULT 'belum digunakan',
        pathQrcode TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
