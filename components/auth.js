const db = require("../config/db");
const bcrypt = require("bcrypt");
const passport = require("passport");

const register = function (req, res) {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error in registration:', error);
            res.send({ success: false, where: 'main', message: 'Chyba pri registrácii.' });
        } else if (results.length > 0) {
            res.send({ success: false, where: 'username', message: 'Používateľské meno je už obsadené.' });
        } else {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) {
                    console.error('Error in registration:', error);
                    res.send({ success: false, where: 'main', message: 'Chyba pri registrácii.' });
                } else if (results.length > 0) {
                    res.send({ success: false, where: 'email', message: 'Email sa už používa.' });
                } else {
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        if (err) {
                            console.error('Error in hashing password:', err);
                            res.send({ success: false, where: 'main', message: 'Chyba pri vytváraní používateľa.' });
                        } else {
                            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], (error, results) => {
                                if (error) {
                                    console.error('Error in creating user:', error);
                                    res.send({ success: false, where: 'main', message: 'Chyba pri vytváraní používateľa.' });
                                } else {
                                    res.send({ success: true });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

const login = function (req, res, next) {
    const errors = []

    passport.authenticate('local', function (err, user, info) {

        if (err) {
            errors.push({
                where: 'error',
                message: 'Server neodpovedá.'
            });

            return res.send({
                success: false,
                errors: errors
            })
        }

        if (!user) {
            errors.push({
                where: 'box',
                message: 'Nesprávne meno alebo heslo.'
            });

            return res.send({
                success: false,
                errors: errors
            })
        }

        req.logIn(user, function(err) {
            if (err) {
                errors.push({
                    where: 'error',
                    message: 'Server neodpovedá.'
                });

                return res.send({
                    success: false,
                    errors: errors
                })
            }

            db.query('SELECT id, email, username, name, type, address, avatar, sections, slogan, description, mobile, verify, created_at, update_at, last_login FROM users WHERE id = ?', [req.user.user_id], function (error, results) {
                if (error) {
                    errors.push({
                        where: 'error',
                        message: 'Server neodpovedá.'
                    });

                    return res.send({
                        success: false,
                        errors: errors
                    })
                }
                res.send({ success: true, loggedIn: true, user: results[0] });
            });
        });

    })(req, res, next);
}

const logout = function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
}

const checkAuth = function (req, res) {
    if(req.user) {
        res.send({ loggedIn: true, user: req.user });
    } else {
        res.send({ loggedIn: false });
    }
}

module.exports = { register, login, logout, checkAuth };