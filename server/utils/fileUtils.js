const fs = require('fs');
const path = require('path');

function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ File dihapus: ${filePath}`);
    } catch (err) {
        console.error(`⚠️ Gagal menghapus file: ${filePath}`, err);
    }
}

module.exports = { deleteFile };
