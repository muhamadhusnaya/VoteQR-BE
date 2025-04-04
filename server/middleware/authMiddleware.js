import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// **Middleware untuk proteksi route**
export const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ message: 'Akses ditolak, silakan login' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa' });

        req.admin = decoded; // Simpan data admin di request
        next();
    });
};
