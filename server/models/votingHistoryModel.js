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

// Buat tabel voting_history jika belum ada
db.run(`
    CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_id INTEGER NOT NULL,
        team_id INTEGER NOT NULL,
        username TEXT,
        ipPublic TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (token_id) REFERENCES tokens(id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        UNIQUE (token_id) -- Each token can only vote once
    )
`);

export default db;
