import express from 'express'
import { Authenticate } from '../middlewares/Authentication'
import { BoarderProfile, BoarderReviews, BoarderSignin, BoarderSignup, BoarderTransactions } from '../controllers'

const router = express.Router()

router.post('/signup', BoarderSignup)
router.post('/signin', BoarderSignin)

router.use(Authenticate)
router.get('/', BoarderProfile)//profile
router.get('/transactions', BoarderTransactions)//view all previous transactions
router.get('/reviews', BoarderReviews)

export { router as BoarderRoutes }