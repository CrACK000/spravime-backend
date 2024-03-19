import express from 'express'
import { Offers } from '../controllers/offers'
import { Authentication } from '../controllers/authentication'
import { Profile } from '../controllers/auth/profile'
import { Gallery } from '../controllers/auth/gallery'
import { Security } from '../controllers/auth/security'
import { Messages } from '../controllers/messages'

import * as passportConfig from '../config/passport'
import { upload } from '../config/aws'


const auth = express.Router()

/*      Auth    */
auth.post('/auth/offers', passportConfig.authMiddleware, Offers.allMine)
auth.post('/auth/offers/create', passportConfig.authMiddleware, Offers.create)
auth.post('/auth/offers/edit', passportConfig.authMiddleware, Offers.edit)
auth.post('/auth/offers/remove', passportConfig.authMiddleware, Offers.remove)

auth.post('/auth/create-account', Authentication.createAccount)
auth.post('/auth/login', Authentication.login)
auth.get( '/auth/check-auth', passportConfig.authMiddleware, Authentication.checkAuth)
auth.get( '/auth/logout', passportConfig.authMiddleware, Authentication.logout)

auth.post('/auth/profile/update/login-data', passportConfig.authMiddleware, Profile.updateLoginData)
auth.post('/auth/profile/update/advanced-data', passportConfig.authMiddleware, Profile.updateAdvancedData)
auth.post('/auth/profile/update/social-data', passportConfig.authMiddleware, Profile.updateSocialData)

auth.post('/auth/avatar/update', passportConfig.authMiddleware,  upload('avatars').single('avatar'), Gallery.avatar)
auth.post('/auth/gallery/upload', passportConfig.authMiddleware, upload('galleries').array('files', 10), Gallery.addImages)
auth.post('/auth/gallery/remove', passportConfig.authMiddleware, Gallery.removeImages)

auth.post('/auth/security/password', passportConfig.authMiddleware, Security.changePassword)
auth.post('/auth/security/remove-account', passportConfig.authMiddleware, Security.removeAccount)

auth.post('/auth/messages', passportConfig.authMiddleware, Messages.fetchContainer)
auth.post('/auth/messages/accounts', passportConfig.authMiddleware, Messages.fetchAccounts)
auth.post('/auth/messages/add', passportConfig.authMiddleware, Messages.addMessage)
auth.post('/auth/messages/read', passportConfig.authMiddleware, Messages.readMessages)

export default auth