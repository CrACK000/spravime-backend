const passport = require("passport")
const {Strategy: LocalStrategy} = require("passport-local")
const db = require("../config/db")
const bcrypt = require("bcrypt")

passport.use(new LocalStrategy(function(username, password, done) {
    db.query('SELECT * FROM users WHERE username = ?', [username], function(err, results) {
        if (err) {
            done(err)
        }

        if (!results.length) {
            done(null, false)
        } else {
            const user = results[0]

            if (!user.password) {
                return done(null, false)
            }

            bcrypt.compare(password, user.password, function(err, response) {
                if (response) {
                    return done(null, { user_id: user.id })
                } else {
                    return done(null, false)
                }
            })
        }
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.user_id)
})

passport.deserializeUser((user_id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [user_id], (error, results) => {
        if (error) {
            console.error('Error when selecting user on session deserialize', err)
            return done(error)
        }
        done(null, results[0])
    })
})

module.exports = passport