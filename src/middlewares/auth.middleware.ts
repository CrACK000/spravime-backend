import express from 'express'
import { NextFunction, Request, Response } from 'express'
import { Offers } from '../controllers/offers'
import { Authentication } from '../controllers/authentication'
import { Profile } from '../controllers/auth/profile'
import { Gallery } from '../controllers/auth/gallery'
import { Security } from '../controllers/auth/security'
import { Messages } from '../controllers/messages'

//import * as passportConfig from '../config/passport'
import { upload } from '../config/aws'


const auth = express.Router()

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).send('You are not authenticated')
  } else {
    return next()
  }
}

/*      Auth    */
auth.post('/auth/offers', Offers.allMine)
auth.post('/auth/offers/create', Offers.create)
auth.post('/auth/offers/edit', Offers.edit)
auth.post('/auth/offers/remove', Offers.remove)

auth.post('/auth/create-account', Authentication.createAccount)
auth.post('/auth/login', Authentication.login)
auth.get( '/auth/check-auth', authMiddleware, Authentication.checkAuth)
auth.get( '/auth/logout', Authentication.logout)

auth.post('/auth/profile/update/login-data', Profile.updateLoginData)
auth.post('/auth/profile/update/advanced-data', Profile.updateAdvancedData)
auth.post('/auth/profile/update/social-data', Profile.updateSocialData)

auth.post('/auth/avatar/update',  upload('avatars').single('avatar'), Gallery.avatar)
auth.post('/auth/gallery/upload', upload('galleries').array('files', 10), Gallery.addImages)
auth.post('/auth/gallery/remove', Gallery.removeImages)

auth.post('/auth/security/password', Security.changePassword)
auth.post('/auth/security/remove-account', Security.removeAccount)

auth.post('/auth/messages', Messages.fetchContainer)
auth.post('/auth/messages/accounts', Messages.fetchAccounts)
auth.post('/auth/messages/add', Messages.addMessage)
auth.post('/auth/messages/read', Messages.readMessages)

export default auth