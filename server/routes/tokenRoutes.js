import express from 'express';
import db from '../models/database.js'; // 🔄 Gunakan database.js sebagai model utama
import generateToken from '../utils/tokenGenerator.js';
import generateQRCode from '../utils/qrCodeGenerator.js';

const router = express.Router();

// 📌 Endpoint untuk generate token
router.post('/generate', async (req, res) => {
    try {
        const newToken = generateToken(10);
        console.log("✅ Token generated:", newToken);
        const fileName = await generateQRCode(newToken);
        console.log("✅ QR Code generated:", fileName);

        // Simpan data token ke database
        db.run(
            `INSERT INTO tokens (token, pathQrcode, status) VALUES (?, ?, ?)`,
            [newToken, fileName, 'Not Used'],
            function (err) {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan token.', error: err.message });
                res.json({ id: this.lastID, token: newToken, pathQrcode: fileName, status: 'Not Used' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat token.', error: error.message });
    }
});

// 📌 Endpoint untuk melihat semua token
router.get('/list', (req, res) => {
    db.all(`SELECT * FROM tokens`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data token.', error: err.message });
        res.json(rows);
    });
});

// 📌 Endpoint untuk menghapus token berdasarkan ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Dapatkan path QR code sebelum menghapus token
    db.get(`SELECT pathQrcode FROM tokens WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data token.', error: err.message });

        db.run(`DELETE FROM tokens WHERE id = ?`, [id], function (err) {
            if (err) return res.status(500).json({ message: 'Gagal menghapus token.', error: err.message });

            // Hapus file QR code jika ada
            if (row && row.pathQrcode) {
                const filePath = `server/uploads/qrcodes/${row.pathQrcode}`;
                import('fs').then(fs => {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                            console.error('❌ Gagal menghapus file QR code:', unlinkErr);
                        }
                    });
                });
            }

            res.json({ message: 'Token berhasil dihapus.' });
        });
    });
});

export default router;
