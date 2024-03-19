import passport from 'passport';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { MessagesContainer } from '../models/message';
import mongoose from 'mongoose';
import { generateToken } from '../utils/jwtHelper';
import jwt from 'jsonwebtoken';

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

        const id = new mongoose.Types.ObjectId(String(user._id))
        const last_login = User.updateOne({ _id: id }, { $set: { last_login: new Date().toISOString() } })

        if (!last_login) {
          console.log('Error DB: last_login not updated.')
        }

        const token = generateToken(user._id)

        return res.header('auth-token', token)
          .send({
            success: true,
            message: 'Si prihlásený.',
            loggedIn: true,
            user: user,
            token: token
          })

      })

    })(req, res, next)

  }

  static async createAccount(req: any, res: any) {

    const { username, email, password } = req.body

    const alreadyUsername = await User.findOne({ username: username })
    const alreadyEmail = await User.findOne({ email: email })

    if(alreadyUsername) {
      return res.status(400).send({ success: false, message: 'Username already exists.' })
    }

    if(alreadyEmail) {
      return res.status(400).send({ success: false, message: 'Email already exists.' })
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log('[Create-account] Error hashing password.')
        return res.status(500).send({ success: false, message: 'Error hashing password.' })
      }

      try {

        const create = new User({ username: username, email: email, password: hash })
        await create.save()
        return res.status(200).send({ success: true, message: 'Account created successfully.' })

      } catch (e) {
        console.error('[Create-account] Server connection failed.', e)
        return res.status(500).send({ success: false, message: 'Server connection failed.' })
      }

    })

  }

  static async checkAuth(req: any, res: any) {

    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      req.token = bearer[1];
    } else {
      res.sendStatus(403);
    }

    jwt.verify(req.token, process.env.SESSION_SECRET, async (err: any, data: any) => {
      if (err) {
        res.status(403).send('Auth sa nepodaril')
      } else {

        const userId = new mongoose.Types.ObjectId(String(req.session.passport.user))

        const user = await User.findOne({ _id: userId })

        const newMsgCount = await MessagesContainer.countDocuments({
          $or:[
            { 'container.from.user_id': userId, 'container.to.messages.new': true },
            { 'container.to.user_id': userId, 'container.from.messages.new': true }
          ]
        })

        res.send({ loggedIn: true, user: user, newMsgCount: newMsgCount })

      }
    })

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