import express from "express";
import db from "../models/database.js";

const router = express.Router();

// GET voting history dengan JOIN ke tabel tokens
router.get("/", (req, res) => {
    const query = `
        SELECT v.id, v.username, v.token_id, v.team_id, v.createdAt, t.token as tokenString
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

// POST voting baru tanpa IP publik
router.post("/", (req, res) => {
    const { username, teamId, token } = req.body;

    if (!token || !teamId || !username) {
        return res.status(400).json({ message: "Token, tim, dan nama harus diisi" });
    }

    // Validasi token: pastikan token valid dan status 'Not Used'
    db.get(`SELECT id FROM tokens WHERE token = ? AND status = 'Not Used'`, [token], (err, tokenRow) => {
        if (err) {
            console.error("Error validasi token:", err);
            return res.status(500).json({ message: "Gagal memverifikasi token" });
        }
        if (!tokenRow) {
            return res.status(400).json({ message: "Token tidak valid atau sudah digunakan" });
        }

        const tokenId = tokenRow.id;

        // Validasi apakah tim ada di database
        db.get(`SELECT id FROM teams WHERE id = ?`, [teamId], (err, team) => {
            if (err) {
                console.error("Error validasi team:", err);
                return res.status(500).json({ message: "Gagal memvalidasi team" });
            }
            if (!team) {
                return res.status(400).json({ message: "Tim tidak ditemukan!" });
            }

            // Cek apakah token sudah digunakan untuk voting
            db.get(`SELECT id FROM votes WHERE token_id = ?`, [tokenId], (err, existingVote) => {
                if (err) {
                    console.error("Error checking duplicate vote:", err);
                    return res.status(500).json({ message: "Gagal mengecek voting sebelumnya" });
                }
                if (existingVote) {
                    return res.status(400).json({ message: "Token ini sudah digunakan untuk voting!" });
                }

                // Simpan voting ke database tanpa ipPublic
                db.run(
                    `INSERT INTO votes (username, token_id, team_id) VALUES (?, ?, ?)`,
                    [username, tokenId, teamId],
                    function (err) {
                        if (err) {
                            console.error("Error saat menyimpan voting:", err);
                            return res.status(500).json({ message: "Gagal menambahkan data voting" });
                        }

                        // Tandai token sebagai sudah digunakan
                        db.run(`UPDATE tokens SET status = 'Used' WHERE id = ?`, [tokenId], (err) => {
                            if (err) {
                                console.error("Error updating token status:", err);
                            }
                        });

                        res.json({ id: this.lastID, username, tokenId, teamId });
                    }
                );
            });
        });
    });
});

export default router;
