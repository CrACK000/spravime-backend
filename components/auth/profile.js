const db = require("../../config/db");

const updateLoginData = function (req, res) {
    const errors = []
    const userId = req.user.id
    const userName = req.user.username
    const userEmail = req.user.email
    const { username, email, mobile } = req.body

    db.query('SELECT id FROM users WHERE email = ?', [email], function(err, results) {

        if (userEmail !== email) {
            if (err) {
                errors.push({
                    where: 'error',
                    message: 'Chyba pri kontrole emailu.'
                });
            }
            if (results.length > 0) {
                errors.push({
                    where: 'email',
                    message: 'Email je už obsadený.'
                });
            }
        }

        db.query('SELECT id FROM users WHERE username = ?', [username], function(err, results) {

            if (userName !== username) {
                if (err) {
                    errors.push({
                        where: 'error',
                        message: 'Chyba pri kontrole používateľského mena.'
                    });
                }
                if (results.length > 0) {
                    errors.push({
                        where: 'username',
                        message: 'Používateľské meno je už obsadené.'
                    });
                }
            }

            if (errors.length) {
                res.send({
                    success: false,
                    errors: errors
                })
            } else {
                db.query('UPDATE users SET username = ?, email = ?, mobile = ? WHERE id = ?', [username, email, mobile, userId], function(err, results) {
                    if (err) {
                        errors.push({
                            where: 'error',
                            message: 'Chyba pri aktualizácii údajov.'
                        });

                        res.send({
                            success: false,
                            errors: errors
                        })
                    } else {
                        res.send({
                            success: true,
                            message: 'Prihlasovacie údaje boli aktualizované.'
                        })
                    }
                })
            }
        });
    });
}

const updateAdvancedData = function (req, res) {
    const errors = []
    const userId = req.user.id
    const { type, address, name, sections, slogan, description } = req.body

    console.log(sections)

    db.query('UPDATE users SET type = ?, address = ?, name = ?, sections = JSON_ARRAY(?), slogan = ?, description = ? WHERE id = ?', [type, address, name, sections, slogan, description, userId], function(err, results) {
        if (err) {
            errors.push({
                where: 'error',
                message: 'Chyba pri aktualizácii údajov.'
            });

            res.send({
                success: false,
                errors: errors
            })
        } else {
            res.send({
                success: true,
                message: 'Detaily účtu boli aktualizované.'
            })
        }
    })
}

module.exports = { updateLoginData, updateAdvancedData };