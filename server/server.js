import express from 'express';
import cors from 'cors';
import teamRoutes from './routes/teamRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import votingHistoryRoutes from './routes/votingRoutes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('server/uploads'));

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/voting-history', votingHistoryRoutes);
app.use('/api/teams', teamRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
