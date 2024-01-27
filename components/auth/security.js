const db = require("../../config/db");
const bcrypt = require("bcrypt");

const changePass = (req, res) => {
    const errors = [];
    const { currentPass, newPass } = req.body;
    const saltRounds = 10;
    const userId = req.user.id;

    db.query('SELECT password FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            errors.push({
                where: 'error',
                message: 'Chyba pri načítavaní používateľa.',
            })

            return res.send({
                success: false,
                errors: errors,
            })
        }

        const hashedPassword = results[0].password;

        bcrypt.compare(currentPass, hashedPassword, (compareError, isMatch) => {
            if (compareError) {
                errors.push({
                    where: 'error',
                    message: 'Chyba pri porovnávaní hesla.',
                })

                return res.send({
                    success: false,
                    errors: errors,
                })
            }

            if (!isMatch) {
                errors.push({
                    where: 'error',
                    message: 'Súčasné heslo je nesprávne.',
                })

                return res.send({
                    success: false,
                    errors: errors,
                })
            }

            bcrypt.hash(newPass, saltRounds, (hashError, hash) => {
                if (hashError) {
                    errors.push({
                        where: 'error',
                        message: 'Chyba pri zmene hesla.',
                    })

                    return res.send({
                        success: false,
                        errors: errors,
                    })
                }

                db.query('UPDATE users SET password = ? WHERE id = ?', [hash, userId], (updateError, updateResults) => {
                    if (updateError) {
                        errors.push({
                            where: 'error',
                            message: 'Chyba pri zmene hesla.',
                        })

                        return res.send({
                            success: false,
                            errors: errors,
                        })
                    }

                    res.send({
                        success: true,
                        message: 'Heslo bolo aktualizované.',
                    })
                });
            });
        });
    });
}

module.exports = { changePass };