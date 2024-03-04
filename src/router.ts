import express from 'express';
import { Offers } from './app/offers';
import { Cloud } from './app/cloud';
import { Accounts } from './app/accounts';
import { Counter } from './app/counter';
import { Profiles } from './app/profiles';
import { Authentication } from './app/authentication';
import { Reports } from './app/reports';
import { Profile } from './app/auth/profile';

const router = express.Router();



/*      Guest     */
router.get( '/offers',                        Offers.all)
router.get( '/offers/:id',                    Offers.view)
router.get( '/cloud/:dir/:img/:resolution?',  Cloud.getImg)
router.get( '/accounts',                      Accounts.accounts)
router.get( '/profile/:id',                   Profiles.view)
router.post('/counter/views',                 Counter.views)
router.post('/report',                        Reports.create)



/*      Logged in users     */
router.post('/messages/send')
router.post('/messages/check')



/*      Reviews     */
router.get( '/reviews/:key/all')
router.post('/reviews/create')
router.post('/reviews/edit')
router.post('/reviews/delete')



/*      Auth    */
router.post('/auth/offers',         Offers.allMine)
router.post('/auth/offers/create',  Offers.create)
router.post('/auth/offers/edit',    Offers.edit)
router.post('/auth/offers/delete',  Offers.remove)

router.post('/auth/create-account',   Authentication.createAccount)
router.post('/auth/login',            Authentication.login)
router.get( '/auth/check-auth',       Authentication.checkAuth)
router.get( '/auth/logout',           Authentication.logout)

router.post('/auth/profile/update/login-data',      Profile.updateLoginData)
router.post('/auth/profile/update/advanced-data',   Profile.updateAdvancedData)
router.post('/auth/profile/update/social-data',     Profile.updateSocialData)

router.post('/auth/avatar/update')

router.post('/auth/gallery/upload')
router.post('/auth/gallery/delete')

router.post('/auth/security/password')
router.post('/auth/security/remove-account')

router.post('/auth/messages')
router.post('/auth/messages/accounts')
router.post('/auth/messages/add')
router.post('/auth/messages/check')
router.post('/auth/messages/read')


/*

/*router.post('/offers/edit', EditOffer)
router.post('/offers/remove', RemoveOffer)
router.post('/offers/my', MyOffers)
router.post('/offers/send-msg', SendMsg)
router.post('/offers/check-msg', CheckMsg)
router.post('/offers/counter', Counter)

router.get( '/reviews/all/:id', Reviews)
router.post('/reviews/create', createReview)
router.post('/reviews/edit', editReview)
router.post('/reviews/delete', removeReview)
router.post('/reviews/report', reportReview)

router.get( '/users', Users)
router.get( '/top-profiles', TopProfilesPanel)
router.get( '/user/:id', User)
router.post('/profile/counter', ProfileCounter)
router.get( '/user/gallery/:id', UserGallery)
router.get( '/workers', Workers)

router.post('/register', register)
router.post('/login', login)
router.get( '/check-auth', checkAuth)
router.get( '/logout', logout)

router.post('/profile/update/login-data', updateLoginData)
router.post('/profile/update/advanced-data', updateAdvancedData)
router.post('/profile/update/social-data', updateSocialData)
router.post('/avatar/update', avatarUpload)
router.post('/gallery/upload', uploadGallery)
router.post('/gallery/delete', deleteImages)
router.post('/security/password', changePass)
router.post('/security/remove-account', removeAccount)

router.get( '/messages/accounts', selectActiveAccounts)
router.get( '/messages/:id', selectMessages)
router.post('/messages/add', addMessage)
router.get( '/messages/check/:id', checkNewMessage)
router.post('/messages/read', isRead)

router.get( '/images/:dir/:img', getImage)*/

export default router