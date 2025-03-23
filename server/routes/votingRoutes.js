import express from 'express';
import db from '../models/votingHistoryModel.js';

const router = express.Router();

// Get all voting history
router.get('/voting-history', (req, res) => {
    db.all(`SELECT * FROM voting_history ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data voting history' });
        res.json(rows);
    });
});

// Add new voting data
router.post('/voting-history', (req, res) => {
    const { username, token, ipPublic } = req.body;

    if (!username || !token || !ipPublic) {
        return res.status(400).json({ message: 'Username, token, dan IP public harus diisi' });
    }

    db.run(
        `INSERT INTO voting_history (username, token, ipPublic) VALUES (?, ?, ?)`,
        [username, token, ipPublic],
        function (err) {
            if (err) return res.status(500).json({ message: 'Gagal menambahkan data voting history' });
            res.json({ id: this.lastID, username, token, ipPublic, createdAt: new Date().toISOString() });
        }
    );
});

export default router;
