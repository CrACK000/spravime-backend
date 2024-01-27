const db = require("../../config/db");

const selectActiveAccounts = function (req, res) {
    const userId = req.user.id;

    db.query('(SELECT from_id AS id, MAX(created_at) as LastMessageTime FROM messages WHERE to_id = ? GROUP BY from_id) UNION (SELECT to_id AS id, MAX(created_at) as LastMessageTime FROM messages WHERE from_id = ? GROUP BY to_id) ORDER BY LastMessageTime DESC', [userId, userId], (err, ids) => {
        if (err) {
            return res.send(err)
        }
        const usersIds = ids.map(idObj => idObj.id);

        db.query('SELECT id, username, name, type, avatar, last_login FROM users WHERE id IN (?)', [usersIds], (err, userInfo) => {
            if (err) {
                return res.send(err);
            }
            const promises = userInfo.map(user => {
                return new Promise((resolve, reject) => {
                    db.query('SELECT message, is_read, created_at FROM messages WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) ORDER BY created_at DESC LIMIT 1', [userId, user.id, user.id, userId], (err, messages) => {
                        if(err) {
                            return reject(err);
                        }
                        if(messages.length) {
                            user.last_message = messages[0];
                        } else {
                            user.last_message = null;
                        }
                        resolve();
                    });
                });
            });
            Promise.all(promises)
                .then(() => res.json({ users: userInfo }))
                .catch(err => res.send(err));
        });
    });
}

const selectMessages = function (req, res) {
    const userId = req.user.id;
    const otherUserId = req.params.id;

    db.query('SELECT id, offer_id, from_id, to_id, message, is_read, created_at, updated_at FROM messages WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) ORDER BY created_at', [userId, otherUserId, otherUserId, userId], (err, messages) => {
        if (err) {
            return res.send(err);
        }

        if(messages.length > 0) {
            const offerId = messages[0].offer_id;

            db.query('SELECT title FROM offers WHERE id = ?', [offerId], (error, offers) => {
                if (error) {
                    return res.send(error)
                }

                const offerTitle = offers[0].title;

                return res.json(
                    {
                        messages: messages,
                        offer: {
                            id: offerId,
                            title: offerTitle,
                        }
                    });
            })
        } else {
            return res.json({ messages: messages, offer: null });
        }
    });
}

const addMessage = function (req, res) {
    const errors = [];
    const userId = req.user.id;
    const otherUserId = req.body.id;
    const message = req.body.message;
    const offerId = req.body.offerId;
    let dateObject = new Date();
    dateObject.setHours(dateObject.getHours() + 1);
    const created_at = dateObject.toISOString().slice(0, 19).replace('T', ' ');

    db.query('INSERT INTO messages (offer_id, from_id, to_id, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?)', [offerId, userId, otherUserId, message, false, created_at], (err, result) => {
        if (err) {
            errors.push({
                where: 'error',
                message: 'Chyba pri odosielaní údajov.'
            });

            return res.send({
                success: false,
                errors: errors
            })
        }
        return res.json({ success: true, message: 'Správa bola odoslaná.' });
    });
}

const checkNewMessage = function (req, res) {
    const userId = req.params.id;

    db.query('SELECT COUNT(*) as countMsg FROM messages WHERE to_id = ? AND is_read = false', [userId], (err, result) => {
        if (err) {
            return res.send({
                status: false,
                error: err
            })
        }
        return res.send({ status: true, count: result[0].countMsg });
    });
}

const isRead = function (req, res) {
    const { fromId, toId } = req.body;

    db.query('UPDATE messages SET is_read = true WHERE from_id = ? and to_id = ?', [fromId, toId], (err, result) => {
        if (err) {
            return res.send({
                success: false,
                message: err,
            })
        }
        return res.send({
            success: true,
            message: 'Správy boli označené ako prečítané.',
        })
    });
}

module.exports = { selectActiveAccounts, selectMessages, addMessage, checkNewMessage, isRead };