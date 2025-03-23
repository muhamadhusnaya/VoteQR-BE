import QRCode from 'qrcode';
import path from 'path';

async function generateQRCode(token) {
    const filePath = path.join(__dirname, '../uploads/qrcodes', `${token}.png`);
    try {
        await QRCode.toFile(filePath, token);
        return filePath;
    } catch (err) {
        console.error('Gagal membuat QR Code:', err);
        throw err;
    }
}

export default generateQRCode;
