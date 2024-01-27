const db = require("../config/db")

const Reviews = function (req, res) {
    const profileId = req.params.id;
    const sql = 'select r.*, u.username as author_username, u.name as author_name, u.avatar as author_avatar from reviews r left join users u on r.author_id = u.id where r.profile_id = ? order by r.created_at desc';

    db.query(sql, [profileId], (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json(results)
        }
    });
}

const createReview = function (req, res) {
    const userId = req.user.id
    const { profile_id, star, recommendation, description } = req.body
    let dateObject = new Date();
    dateObject.setHours(dateObject.getHours() + 1);
    const created_at = dateObject.toISOString().slice(0, 19).replace('T', ' ');

    db.query('insert into reviews (author_id, profile_id, rating, recommendation, description, created_at, updated_at) values (?,?,?,?,?,?,?)', [userId, profile_id, star, recommendation, description, created_at, created_at], (err, results) => {
        if (err) {
            res.send({ success: false, message: 'Chyba pri aktualizácii údajov.' });
        } else {
            res.send({ success: true });
        }
    })
}

const removeReview = function (req, res) {
    const reviewId = req.body.review_id

    db.query('delete from reviews where id = ?', [reviewId], (err, results) => {
        if (err) {
            res.send({ success: false, message: 'Chyba pri aktualizácii údajov.' });
        } else {
            res.send({ success: true });
        }
    })
}

const editReview = function (req, res) {

}

const reportReview = function (req, res) {

}

module.exports = {
    Reviews,
    createReview,
    editReview,
    removeReview,
    reportReview
}