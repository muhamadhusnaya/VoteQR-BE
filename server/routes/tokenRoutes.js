import express from 'express';
import db from '../models/tokenModel.js';
import generateToken from '../utils/tokenGenerator.js';
import generateQRCode from '../utils/qrCodeGenerator.js';

const router = express.Router();

// Endpoint untuk generate token
router.post('/tokens/generate', async (req, res) => {
    try {
        const newToken = generateToken(10);
        const fileName = await generateQRCode(newToken);

        // Simpan data token ke database
        db.run(
            `INSERT INTO tokens (token, pathQrcode, status) VALUES (?, ?, ?)`,
            [newToken, fileName, 'belum digunakan'],
            function (err) {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan token.' });
                res.json({ id: this.lastID, token: newToken, pathQrcode: fileName, status: 'belum digunakan' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat token.' });
    }
});

// Endpoint untuk melihat semua token
router.get('/tokens/list', (req, res) => {
    db.all(`SELECT * FROM tokens`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data token.' });
        res.json(rows);
    });
});

export default router;
