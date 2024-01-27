const db = require("../config/db");

const Users = function (req, res) {
    db.query('SELECT id, email, username, type, avatar, slogan, description, mobile, verify, created_at, update_at, last_login FROM users', (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    })
}

const User = async function (req, res) {
    const userId = req.params.id;
    const [userRows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    const [socialPageRows] = await db.promise().query('SELECT * FROM social_pages WHERE user_id = ?', [userId]);

    if (userRows.length === 0) {
        res.status(404).send(`No user found with ID: ${userId}`);
        return;
    }

    const userData = userRows[0];
    userData.socialPages = socialPageRows.length > 0 ? socialPageRows : null;

    res.send(userData);
}

const UserLink = function (req, res) {
    const id = req.params.id;

    db.query('SELECT id, username, name, avatar, type, verify FROM users WHERE id = ?', [id], function (error, results) {
        if (error) {
            console.error('An error occurred while executing the query')
            throw error
        }

        res.json(results[0]);
    });
}

const UserGallery = function (req, res) {
    const id = req.params.id;

    db.query('SELECT * FROM galleries WHERE user_id = ? ORDER BY created_at desc', [ id ], (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json(results)
        }
    });
}

const Workers = function (req, res) {
    db.query('select id, avatar, email, username, name, type, address, slogan, description, sections from users where type in (?,?)', ["company", 'worker'], (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json(results)
        }
    })
}

module.exports = {
    Users,
    User,
    UserLink,
    UserGallery,
    Workers
}