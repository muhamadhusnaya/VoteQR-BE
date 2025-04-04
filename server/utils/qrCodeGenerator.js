// server/utils/qrCodeGenerator.js
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateQRCode(token) {
    // Tentukan folder untuk menyimpan QR Code
    const folderPath = path.join(__dirname, '../uploads/qrcodes');
    // Buat folder jika belum ada
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const fileName = `${token}.png`;
    const filePath = path.join(folderPath, fileName);
    
    try {
        await QRCode.toFile(filePath, token);
        return fileName;
    } catch (err) {
        console.error('Gagal membuat QR Code:', err);
        throw err;
    }
}

export default generateQRCode;
