import express, { Request, Response, NextFunction } from 'express'
import { Offers } from './app/offers'
import { Cloud } from './app/cloud'
import { Accounts } from './app/accounts'
import { Counter } from './app/counter'
import { Profiles } from './app/profiles'
import { Authentication } from './app/authentication'
import { Reports } from './app/reports'
import { Profile } from './app/auth/profile'
import { Reviews } from './app/reviews'
import { Messages } from './app/messages'
import { Security } from './app/auth/security'
import { Gallery } from './app/auth/gallery'
import { upload } from './plugins/aws'

const router = express.Router()

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).send('You are not authenticated')
  } else {
    return next()
  }
}



/*      Guest     */
router.get( '/offers',                              Offers.all)
router.get( '/offers/:id',                          Offers.view)
router.get( '/cloud/:dir/:img/:resolution?',        Cloud.getImg)
router.get( '/accounts',                            Accounts.accounts)
router.get( '/profile/:id',                         Profiles.view)
router.post('/counter/views',                       Counter.views)
router.post('/report',                              Reports.create)



/*      Logged in users     */
router.post('/messages/send',                       Messages.sendMsgFromOffer)
router.post('/messages/check',                      Messages.checkAlreadyContainer)



/*      Reviews     */
router.get( '/reviews/:key/all',                    Reviews.all)
router.post('/reviews/create',                      Reviews.create)
router.post('/reviews/edit',                        Reviews.edit)
router.post('/reviews/remove',                      Reviews.remove)



/*      Auth    */
router.post('/auth/offers',                         Offers.allMine)
router.post('/auth/offers/create',                  Offers.create)
router.post('/auth/offers/edit',                    Offers.edit)
router.post('/auth/offers/remove',                  Offers.remove)

router.post('/auth/create-account',                 Authentication.createAccount)
router.post('/auth/login',                          Authentication.login)
router.get( '/auth/check-auth',   authMiddleware,                  Authentication.checkAuth)
router.get( '/auth/logout',                         Authentication.logout)

router.post('/auth/profile/update/login-data',      Profile.updateLoginData)
router.post('/auth/profile/update/advanced-data',   Profile.updateAdvancedData)
router.post('/auth/profile/update/social-data',     Profile.updateSocialData)

router.post('/auth/avatar/update',  upload('avatars').single('avatar'),       Gallery.avatar)
router.post('/auth/gallery/upload', upload('galleries').array('files', 10),   Gallery.addImages)
router.post('/auth/gallery/remove',                                           Gallery.removeImages)

router.post('/auth/security/password',              Security.changePassword)
router.post('/auth/security/remove-account',        Security.removeAccount)

router.post('/auth/messages',                       Messages.fetchContainer)
router.post('/auth/messages/accounts',              Messages.fetchAccounts)
router.post('/auth/messages/add',                   Messages.addMessage)
router.post('/auth/messages/read',                  Messages.readMessages)

export default router