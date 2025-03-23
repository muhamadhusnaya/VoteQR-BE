import fs from 'fs';
import path from 'path';

export function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ File dihapus: ${filePath}`);
    } catch (err) {
        console.error(`⚠️ Gagal menghapus file: ${filePath}`, err);
    }
}