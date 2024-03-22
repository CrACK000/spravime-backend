import { User } from '../models/user'
import bcrypt from 'bcrypt'
import { MessagesContainer } from '../models/message'
import mongoose from 'mongoose'
import { generateToken, validateToken } from '../utils/jwtHelper'

export class Authentication {

  static async login(req: any, res: any) {
    const user = await User.findOne({ username: req.body.username })

    if (!user) {
      return res.status(400).json({ error: "Invalid username" })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" })
    }

    const id = new mongoose.Types.ObjectId(String(user._id))
    const last_login = User.updateOne({ _id: id }, { $set: { last_login: new Date().toISOString() } })

    if (!last_login) {
      console.error('Error DB: last_login not updated.')
    }

    const token = generateToken(user._id)

    res
      .header('Authorization', `Bearer ${token}`)
      .json({
        success: true,
        message: 'Si prihlásený.',
        token
      })
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
    const authHeader = req.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    let userId: any

    try {
      const payload = validateToken(token) as any
      userId = payload.id
    } catch (error) {
      console.log('[checkAuth] Invalid or missing token')
    }

    const user = await User.findOne({ _id: userId }).select('-password')

    if (!user) {
      return res.status(401).json({ loggedIn: false })
    }

    const newMsgCount = await MessagesContainer.countDocuments({
      $or: [
        { 'container.from.user_id': userId, 'container.to.messages.new': true },
        { 'container.to.user_id': userId, 'container.from.messages.new': true }
      ],
    });

    res.send({ loggedIn: true, user: user, newMsgCount: newMsgCount })
  }

  static async logout(req: any, res: any) {
    res.send({ success: true, message: "Bol si odhlásený z účtu." })
  }

}