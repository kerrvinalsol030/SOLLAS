import express from 'express'
import { Authenticate } from '../middlewares/Authentication'
import { BoarderProfile, BoarderReviewProperty, BoarderReviews, BoarderSignin, BoarderSignup, BoarderTransactions, SetUpPropertyViewing } from '../controllers'

const router = express.Router()

router.post('/signup', BoarderSignup)
router.post('/signin', BoarderSignin)

router.use(Authenticate)
router.get('/', BoarderProfile)//profile
router.get('/transactions', BoarderTransactions)//view all previous transactions
router.get('/reviews', BoarderReviews)
router.post('/setup-property-viewing/:propertyId', SetUpPropertyViewing)
router.post('/property-review/:propertyId', BoarderReviewProperty)


export { router as BoarderRoutes }