import express from 'express'
import { RequestsClass } from '../controllers/requests'
import { Cloud } from '../controllers/cloud'
import { Accounts } from '../controllers/accounts'
import { Counter } from '../controllers/counter'
import { Profiles } from '../controllers/profiles'
import { Reports } from '../controllers/reports'
import { Reviews } from '../controllers/reviews'
import { Messages } from '../controllers/messages'

const router = express.Router()

/*      Guest     */
router.get( '/requests',                              RequestsClass.all)
router.get( '/requests/:id',                          RequestsClass.view)
router.get( '/cloud/:dir/:img/:resolution?',        Cloud.getImg)
router.get( '/accounts',                            Accounts.accounts)
router.get( '/profile/:id',                         Profiles.view)
router.post('/counter/views',                       Counter.views)
router.post('/report',                              Reports.create)

/*      Logged in users     */
router.post('/messages/send',                       Messages.sendMsgFromRequest)
router.post('/messages/check',                      Messages.checkAlreadyContainer)

/*      Reviews     */
router.get( '/reviews/:key/all',                    Reviews.all)
router.post('/reviews/create',                      Reviews.create)
router.post('/reviews/edit',                        Reviews.edit)
router.post('/reviews/remove',                      Reviews.remove)

export default router