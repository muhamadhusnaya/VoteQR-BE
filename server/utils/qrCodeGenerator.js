const QRCode = require('qrcode');
const path = require('path');

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

module.exports = generateQRCode;
