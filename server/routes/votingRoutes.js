import express from "express";
import db from "../models/database.js";

const router = express.Router();

// GET voting history dengan JOIN ke tabel tokens
router.get("/", (req, res) => {
    const query = `
        SELECT 
            v.id,
            v.username,
            v.ipPublic,
            v.token_id,
            v.team_id,
            v.createdAt,
            t.token AS tokenString
        FROM votes v
        JOIN tokens t ON v.token_id = t.id
        ORDER BY v.createdAt DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error fetching voting history:", err);
            return res.status(500).json({ message: "Gagal mengambil data voting history" });
        }
        res.json(rows);
    });
});

// POST voting baru dengan validasi IP
router.post("/", (req, res) => {
    let { username, teamId, token, ipPublic } = req.body;

    if (!token || !teamId || !username || !ipPublic) {
        return res.status(400).json({ message: "Token, tim, nama, dan IP harus diisi" });
    }

    username = username.toLowerCase();

    // Validasi token
    db.get(`SELECT id FROM tokens WHERE token = ? AND status = 'Not Used'`, [token], (err, tokenRow) => {
        if (err) return res.status(500).json({ message: "Gagal memverifikasi token" });
        if (!tokenRow) return res.status(400).json({ message: "Token tidak valid atau sudah digunakan" });

        const tokenId = tokenRow.id;

        // Validasi tim
        db.get(`SELECT id FROM teams WHERE id = ?`, [teamId], (err, team) => {
            if (err) return res.status(500).json({ message: "Gagal memvalidasi tim" });
            if (!team) return res.status(400).json({ message: "Tim tidak ditemukan!" });

            // Validasi username dan IP
            db.all(
                `SELECT * FROM votes WHERE username = ? OR (username = ? AND ipPublic = ?)`,
                [username, username, ipPublic],
                (err, rows) => {
                    if (err) return res.status(500).json({ message: "Gagal mengecek data voting sebelumnya" });

                    const isUsernameUsed = rows.some(row => row.username === username);
                    const isUsernameAndIpUsed = rows.some(row => row.username === username && row.ipPublic === ipPublic);

                    if (isUsernameUsed || isUsernameAndIpUsed) {
                        return res.status(400).json({ message: "Username atau IP sudah pernah digunakan untuk voting!" });
                    }

                    // Simpan voting
                    db.run(
                        `INSERT INTO votes (username, token_id, team_id, ipPublic) VALUES (?, ?, ?, ?)`,
                        [username, tokenId, teamId, ipPublic],
                        function (err) {
                            if (err) return res.status(500).json({ message: "Gagal menyimpan data voting" });

                            // Update token status
                            db.run(`UPDATE tokens SET status = 'Used' WHERE id = ?`, [tokenId], (err) => {
                                if (err) console.error("Gagal memperbarui status token:", err);
                            });

                            res.json({ id: this.lastID, username, tokenId, teamId, ipPublic });
                        }
                    );
                }
            );
        });
    });
});

export default router;
