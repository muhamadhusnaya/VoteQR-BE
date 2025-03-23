import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../models/teamModel.js';
import { deleteFile } from '../utils/fileUtils.js';

const router = express.Router();

// Konfigurasi multer untuk upload gambar
const upload = multer({
    dest: 'server/uploads/teamImages/',
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extName) return cb(null, true);
        cb(new Error('Hanya menerima file gambar dengan format jpeg, jpg, atau png'));
    }
});

// Get all teams - gunakan path "/" karena sudah di-mount di '/api/teams'
router.get('/', (req, res) => {
    db.all(`SELECT * FROM teams`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data tim' });
        res.json(rows);
    });
});

// Add a new team
router.post('/', upload.single('image'), (req, res) => {
    const { name, category } = req.body;
    const image = req.file ? `/uploads/teamImages/${req.file.filename}` : null;

    if (!name || !category) {
        return res.status(400).json({ message: 'Name and category are required' });
    }

    db.run(
        `INSERT INTO teams (name, category, image) VALUES (?, ?, ?)`,
        [name, category, image],
        function (err) {
            if (err) return res.status(500).json({ message: 'Gagal menambah tim' });
            res.json({ id: this.lastID, name, category, image });
        }
    );
});

// Delete a team
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Dapatkan data tim untuk menghapus file gambar jika ada
    db.get(`SELECT image FROM teams WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus tim' });

        // Hapus data dari database
        db.run(`DELETE FROM teams WHERE id = ?`, [id], function (err) {
            if (err) return res.status(500).json({ message: 'Gagal menghapus tim' });

            // Hapus file gambar jika ada
            if (row && row.image) {
                const imagePath = path.join(__dirname, '..', row.image);
                deleteFile(imagePath);
            }

            res.json({ message: 'Tim berhasil dihapus' });
        });
    });
});

export default router;
