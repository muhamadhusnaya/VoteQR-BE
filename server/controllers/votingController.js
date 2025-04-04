import db from "../models/database.js";

// Contoh penggunaan di controller
export const voteHandler = (req, res) => {
    const { token, teamId, username } = req.body;
    if (!token || !teamId || !username) {
        return res.status(400).json({ message: "Token, tim, dan nama harus diisi" });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Update token jika status masih 'Not Used'
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

                // Lakukan pencatatan voting
                db.run(
                    `INSERT INTO votes (token_id, team_id, username) VALUES ((SELECT id FROM tokens WHERE token = ?), ?, ?)`,
                    [token, teamId, username],
                    function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return res.status(500).json({ message: "Terjadi kesalahan pada server (voting)" });
                        }
                        db.run("COMMIT");
                        return res.status(200).json({ message: "Voting berhasil dilakukan" });
                    }
                );
            }
        );
    });
};
