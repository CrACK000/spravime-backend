import express from 'express';
import { Offers } from './app/offers';

const router = express.Router();

router.get( '/offers', Offers.all)
router.get( '/offers/:id', Offers.view)
router.post('/offers/create', Offers.create)
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