const express = require('express')
const router = express.Router()

const { allOffers, Offer, Counter, SendMsg, CheckMsg } = require('../components/offers')
const { Reviews, createReview, editReview, removeReview, reportReview } = require('../components/reviews')

const { Users, User, UserLink, UserGallery, Workers } = require('../components/users')

const { updateLoginData, updateAdvancedData } = require('../components/auth/profile')
const { avatarUpload } = require('../components/auth/design')
const { login, register, logout, checkAuth} = require("../components/auth")
const { uploadGallery, deleteImages } = require('../components/auth/gallery')
const { changePass } = require('../components/auth/security')
const { selectActiveAccounts, selectMessages, addMessage, checkNewMessage, isRead } = require('../components/auth/messages')
const { getImage } = require('../components/images')

router.get('/api/offers', allOffers)
router.get('/api/offers/:id', Offer)
router.post('/api/offers/send-msg', SendMsg)
router.post('/api/offers/check-msg', CheckMsg)
router.post('/api/offers/counter', Counter)

router.get('/api/reviews/all/:id', Reviews)
router.post('/api/reviews/create', createReview)
router.post('/api/reviews/edit', editReview)
router.post('/api/reviews/delete', removeReview)
router.post('/api/reviews/report', reportReview)

router.get('/api/users', Users)
router.get('/api/user/:id', User)
router.get('/api/user/link/:id', UserLink)
router.get('/api/user/gallery/:id', UserGallery)
router.get('/api/workers', Workers)

router.post('/api/register', register)
router.post('/api/login', login)
router.get('/api/check-auth', checkAuth)
router.get('/api/logout', logout)

router.post('/api/profile/update/login-data', updateLoginData)
router.post('/api/profile/update/advanced-data', updateAdvancedData)
router.post('/api/avatar/update', avatarUpload)
router.post('/api/gallery/upload', uploadGallery)
router.post('/api/gallery/delete', deleteImages)
router.post('/api/security/password', changePass)

router.get('/api/messages/accounts', selectActiveAccounts)
router.get('/api/messages/:id', selectMessages)
router.post('/api/messages/add', addMessage)
router.get('/api/messages/check/:id', checkNewMessage)
router.post('/api/messages/read', isRead)

router.get('/images/:dir/:img', getImage)

module.exports = router