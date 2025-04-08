import express from 'express';
import cors from 'cors';
import teamRoutes from './routes/teamRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import votingHistoryRoutes from './routes/votingRoutes.js';
import authRoutes from './routes/authRoutes.js'
import statsRoutes from './routes/statsRoutes.js';


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('server/uploads'));
app.use('/auth', authRoutes);

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/voting-history', votingHistoryRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/stats', statsRoutes);


// API  Reset Database
app.post("/api/reset-database", async (req, res) => {
    try {
        const dbFilePath = path.resolve("server", "database.sqlite");

        // Hapus database jika ada
        if (fs.existsSync(dbFilePath)) {
            fs.unlinkSync(dbFilePath);
            console.log("🗑️ Database lama telah dihapus.");
        }

        // Buat ulang database dan tabel
        await createTables();
        console.log("✅ Database telah dibuat ulang dengan tabel kosong.");
        res.status(200).json({ message: "Database berhasil di-reset." });
    } catch (error) {
        console.error("❌ Error saat reset database:", error);
        res.status(500).json({ error: "Gagal mereset database." });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
