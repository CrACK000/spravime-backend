import passport from 'passport';
import { ObjectId } from 'mongodb';
import { getDb } from '../plugins/database';

export class Authentication {

  static async login(req: any, res: any, next: any) {

    await passport.authenticate('local', function (err: any, user: any) {

      if (err) {
        return res.send({ success: false, message: 'Server error' })
      }

      if (!user) {
        return res.send({ success: false, message: 'Server error' })
      }

      req.logIn(user, function(err: any) {

        if (err) {
          return res.send({ success: false, message: 'Server error' })
        }

        const id = new ObjectId(String(user._id))
        const last_login = getDb().collection('users').updateOne({ _id: id }, { $set: { last_login: new Date() } })

        if (!last_login) {
          console.log('Error DB: last_login not updated.')
        }

        return res.send({ success: true, loggedIn: true, user: user })

      })

    })(req, res, next)

  }

  static async createAccount(req: any, res: any) {

    // @todo register
    //const { username, email, password } = req.body

  }

  static async checkAuth(req: any, res: any) {

    if(req.user) {

      res.send({ loggedIn: true, user: req.user });

    } else {

      res.send({ loggedIn: false, user: null });

    }

  }

  static async logout(req: any, res: any) {

    req.logout(function (err: any) {

      if (err) {

        console.log(err);
        res.send({ success: false })

      } else {

        res.send({ success: true, message: "Bol si odhlásený z účtu." })

      }

    })

  }

}