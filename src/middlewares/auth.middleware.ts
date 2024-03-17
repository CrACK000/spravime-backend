import express, { NextFunction, Request, Response } from 'express';
import { Offers } from '../controllers/offers'
import { Authentication } from '../controllers/authentication'
import { Profile } from '../controllers/auth/profile'
import { Gallery } from '../controllers/auth/gallery'
import { Security } from '../controllers/auth/security'
import { Messages } from '../controllers/messages'

//import * as passportConfig from '../config/passport'
import { upload } from '../config/aws'
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

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

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).send('You are not authenticated')
  } else {
    return next()
  }
}


const auth = express.Router()

/*      Auth    */
auth.post('/auth/offers', authMiddleware, Offers.allMine)
auth.post('/auth/offers/create', authMiddleware, Offers.create)
auth.post('/auth/offers/edit', authMiddleware, Offers.edit)
auth.post('/auth/offers/remove', authMiddleware, Offers.remove)

auth.post('/auth/create-account', Authentication.createAccount)
auth.post('/auth/login', Authentication.login)
auth.get( '/auth/check-auth', authMiddleware, Authentication.checkAuth)
auth.get( '/auth/logout', authMiddleware, Authentication.logout)

auth.post('/auth/profile/update/login-data', authMiddleware, Profile.updateLoginData)
auth.post('/auth/profile/update/advanced-data', authMiddleware, Profile.updateAdvancedData)
auth.post('/auth/profile/update/social-data', authMiddleware, Profile.updateSocialData)

auth.post('/auth/avatar/update', authMiddleware,  upload('avatars').single('avatar'), Gallery.avatar)
auth.post('/auth/gallery/upload', authMiddleware, upload('galleries').array('files', 10), Gallery.addImages)
auth.post('/auth/gallery/remove', authMiddleware, Gallery.removeImages)

auth.post('/auth/security/password', authMiddleware, Security.changePassword)
auth.post('/auth/security/remove-account', authMiddleware, Security.removeAccount)

auth.post('/auth/messages', authMiddleware, Messages.fetchContainer)
auth.post('/auth/messages/accounts', authMiddleware, Messages.fetchAccounts)
auth.post('/auth/messages/add', authMiddleware, Messages.addMessage)
auth.post('/auth/messages/read', authMiddleware, Messages.readMessages)

export default auth