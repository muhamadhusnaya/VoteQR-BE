import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Secret key untuk JWT
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// **Login Admin**
export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    db.get(`SELECT * FROM admin WHERE email = ?`, [email], async (err, admin) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data admin' });

        if (!admin) return res.status(401).json({ message: 'Akun tidak ditemukan' });

        // Cek password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah' });

        // **JWT Token**
        const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, {
            expiresIn: '15m', // Expired dalam 15 menit
        });

        res.json({ message: 'Login berhasil', token });
    });
};


// **Logout (Opsional, untuk frontend hapus token)**
export const logout = (req, res) => {
    res.json({ message: 'Logout berhasil' });
};
