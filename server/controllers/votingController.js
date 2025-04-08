import db from "../models/database.js";

export const voteHandler = (req, res) => {
    const { token, teamId, username, ipPublic } = req.body;

    if (!token || !teamId || !username || !ipPublic) {
        return res.status(400).json({ message: "Token, tim, nama, dan IP harus diisi" });
    }

    // Validasi 1 & 2
    const validationQuery = `
        SELECT * FROM votes WHERE username = ? OR (username = ? AND ipPublic = ?)
    `;

    db.all(validationQuery, [username, username, ipPublic], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Gagal memeriksa data voting sebelumnya" });
        }

        // Cek kondisi dari hasil
        const isUsernameUsed = rows.some(row => row.username === username);
        const isUsernameAndIpUsed = rows.some(row => row.username === username && row.ipPublic === ipPublic);

        if (isUsernameUsed || isUsernameAndIpUsed) {
            return res.status(400).json({ message: "Username atau IP sudah pernah digunakan untuk voting!" });
        }

        // Lanjut validasi dan voting
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            db.run(
                `UPDATE tokens SET status = 'Used' WHERE token = ? AND LOWER(status) = 'not used'`,
                [token],
                function (err) {
                    if (err || this.changes === 0) {
                        db.run("ROLLBACK");
                        const message = err
                            ? "Gagal memperbarui token"
                            : "Token sudah digunakan atau tidak valid";
                        return res.status(400).json({ message });
                    }

                    // Insert voting dengan ipPublic
                    db.run(
                        `INSERT INTO votes (token_id, team_id, username, ipPublic) VALUES ((SELECT id FROM tokens WHERE token = ?), ?, ?, ?)`,
                        [token, teamId, username, ipPublic],
                        function (err) {
                            if (err) {
                                db.run("ROLLBACK");
                                return res.status(500).json({ message: "Terjadi kesalahan saat menyimpan voting" });
                            }

                            db.run("COMMIT");
                            return res.status(200).json({ message: "Voting berhasil dilakukan" });
                        }
                    );
                }
            );
        });
    });
};
