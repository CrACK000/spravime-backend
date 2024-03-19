import { NextFunction, Response } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import passport from 'passport';
import { User } from '../models/user';
import { validateToken } from '../utils/jwtHelper';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username })
    if (!user) {
      return done(null, false, { message: "No user with that username" })
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: "Wrong password" })
    }

    return done(null, user)

  } catch (error) {
    return done(error)
  }
}))

passport.serializeUser((user:any, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (user: any, done) => {

  const userId = new mongoose.Types.ObjectId(String(user))

  try {
    const user = await User.findById(userId)
    done(null, user)
  } catch(err) {
    done(err)
  }
})

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  let token = req.header('Authorization')

  if (!token) return res.status(401).send('Access Denied')

  if (token?.startsWith("Bearer ")){
    token = token.slice(7, token.length)
  }

  try {
    req.user._id = validateToken(token)
    return next()
  } catch (err) {
    return res.status(400).send('Invalid token')
  }
}