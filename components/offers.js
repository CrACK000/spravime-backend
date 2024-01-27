const db = require("../config/db")

const allOffers = function (req, res) {

    const sql = 'select * from offers where disabled = false and approved = true order by status and created_at desc';

    db.query(sql, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json(results)
        }
    });
}

const Offer = function (req, res) {
    const id = req.params.id
    const sql = 'select offers.*, s.title as section_title, c.title as category_title from offers left join sections s on offers.section = s.id left join categories c on offers.category = c.id where offers.id = ?'

    db.query(sql, [id], function (error, results) {
        if (error) {
            console.error('An error occurred while executing the query')
            throw error
        }

        res.json(results[0])
    })
}

const CheckMsg = function (req, res) {
    const id = req.body.offerId
    let checkMsg = false
    let checkAuthor = false

    db.query('SELECT id, author FROM offers WHERE id = ?', [id], function (error, results) {
        if (error) {
            console.error('An error occurred while executing the query')
            throw error
        }

        const author = results[0].author;

        if (!req.user || req.user.id === undefined) {
            console.log('neni prihlásený')
            checkAuthor = false
            return res.send({check_msg: checkMsg, check_author: checkAuthor})
        } else if (req.user.id === author) {
            console.log('si prihláseny ale si majitel')
            checkAuthor = true
            return res.send({check_msg: checkMsg, check_author: checkAuthor})
        } else {
            db.query('SELECT * FROM messages WHERE from_id = ? AND to_id = ? AND offer_id = ?', [req.user.id, author, id], function (error2, results2) {
                if (error2) {
                    console.error('An error occurred while executing the query')
                    throw error2
                }
                checkMsg = results2.length <= 0;
                console.log('kontrolujem či už si ešte napisal správu a vysledok je : ' + checkMsg)
                return res.send({check_msg: checkMsg, check_author: checkAuthor})
            })
        }
    })
}

const Counter = function (req, res) {
    const userId = req.user && req.user.id
    const offerId = req.body.offer_id
    let dateObject = new Date()
    dateObject.setHours(dateObject.getHours() + 1)
    const currentTime = dateObject.toISOString().slice(0, 19).replace('T', ' ')

    db.query('SELECT * FROM views_offers WHERE offer_id = ?', [offerId], (err, results) => {
        if (err) {
            return res.send({ status: false, message: err })
        }

        if (results.length > 0) {
            if(userId) {
                db.query('UPDATE views_offers SET logged = logged + 1, uploaded_at = ? WHERE offer_id = ?', [currentTime, offerId],
                    (err, results) => {
                        if (err) {
                            return res.send({ status: false, message: err })
                        }
                        return res.send({ status: true })
                    })
            }
            else {
                db.query('UPDATE views_offers SET unlogged = unlogged + 1, uploaded_at = ? WHERE offer_id = ?', [currentTime, offerId],
                    (err, results) => {
                        if (err) {
                            return res.send({ status: false, message: err })
                        }
                        return res.send({ status: true })
                    })
            }
        } else {
            const query = userId ?
                'INSERT INTO views_offers (offer_id, logged, uploaded_at) VALUES (?, 1, ?)' :
                'INSERT INTO views_offers (offer_id, unlogged, uploaded_at) VALUES (?, 1, ?)';

            db.query(query, [offerId, currentTime], (err, results) => {
                if (err) {
                    return res.send({ status: false, message: err })
                }
                return res.send({ status: true })
            });
        }
    });
}

const SendMsg = function (req, res) {
    if (!req.user || req.user.id === undefined) {
        return console.log('req.user.id is not defined')
    }

    const offerId = req.body.offerId;
    const message = req.body.msg;
    let dateObject = new Date();
    dateObject.setHours(dateObject.getHours() + 1);
    const created_at = dateObject.toISOString().slice(0, 19).replace('T', ' ');

    db.query('SELECT * FROM offers WHERE id = ?', [offerId], function (error, results) {
        if (error) {
            console.error('An error occurred while executing the query')
            throw error
        }

        db.query('INSERT INTO messages (offer_id, from_id, to_id, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [offerId, req.user.id, results[0].author, message, 0, created_at],
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.send({ status: false, message: error })
                }
                console.log('MSG send ok')
                return res.send({ status: true })
            })
    })

}

module.exports = {
    allOffers,
    Offer,
    Counter,
    SendMsg,
    CheckMsg
}