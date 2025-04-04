import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../models/database.js'; // 🔄 Gunakan database.js sebagai model utama
import { deleteFile } from '../utils/fileUtils.js';

const router = express.Router();

// 📂 Konfigurasi multer untuk upload gambar
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

// 📌 Get all teams
router.get('/', (req, res) => {
    db.all(`SELECT * FROM teams`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data tim', error: err.message });
        res.json(rows);
    });
});

// 📌 Get a team by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM teams WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data tim', error: err.message });
        if (!row) return res.status(404).json({ message: 'Tim tidak ditemukan' });
        res.json(row);
    });
});

// 📌 Add a new team
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
            if (err) return res.status(500).json({ message: 'Gagal menambah tim', error: err.message });
            res.json({ id: this.lastID, name, category, image });
        }
    );
});

// 📌 Update a team
router.put('/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const newImage = req.file ? `/uploads/teamImages/${req.file.filename}` : null;

    if (!name || !category) {
        return res.status(400).json({ message: 'Name and category are required' });
    }

    db.get(`SELECT image FROM teams WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data tim', error: err.message });

        db.run(
            `UPDATE teams SET name = ?, category = ?, image = COALESCE(?, image) WHERE id = ?`,
            [name, category, newImage, id],
            function (err) {
                if (err) return res.status(500).json({ message: 'Gagal memperbarui tim', error: err.message });

                // Hapus gambar lama jika ada gambar baru
                if (newImage && row && row.image) {
                    const imagePath = path.join(process.cwd(), 'server', row.image);
                    deleteFile(imagePath);
                }

                res.json({ id, name, category, image: newImage || row.image });
            }
        );
    });
});

// 📌 Delete a team
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT image FROM teams WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus tim', error: err.message });

        db.run(`DELETE FROM teams WHERE id = ?`, [id], function (err) {
            if (err) return res.status(500).json({ message: 'Gagal menghapus tim', error: err.message });

            // Hapus file gambar jika ada
            if (row && row.image) {
                const imagePath = path.join(process.cwd(), 'server', row.image);
                deleteFile(imagePath);
            }

            res.json({ message: 'Tim berhasil dihapus' });
        });
    });
});

export default router;
