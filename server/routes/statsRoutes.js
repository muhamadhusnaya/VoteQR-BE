// routes/statsRoutes.js
import express from 'express';
import db from '../models/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const stats = {
            totalTeams: 0,
            totalTokens: 0,
            totalVotes: 0,
            votesPerTeam: []
        };

        // Total tim
        await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM teams`, (err, row) => {
                if (err) return reject(err);
                stats.totalTeams = row.count;
                resolve();
            });
        });

        // Total token
        await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM tokens`, (err, row) => {
                if (err) return reject(err);
                stats.totalTokens = row.count;
                resolve();
            });
        });

        // Total voting
        await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM votes`, (err, row) => {
                if (err) return reject(err);
                stats.totalVotes = row.count;
                resolve();
            });
        });

        // Vote per team
        await new Promise((resolve, reject) => {
            db.all(`
                SELECT teams.id, teams.name, COUNT(votes.id) as voteCount
                FROM teams
                LEFT JOIN votes ON teams.id = votes.team_id
                GROUP BY teams.id
                ORDER BY voteCount DESC
            `, (err, rows) => {
                if (err) return reject(err);
                stats.votesPerTeam = rows;
                resolve();
            });
        });

        res.json(stats);
    } catch (error) {
        console.error("❌ Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Gagal mengambil statistik dashboard' });
    }
});

export default router;
