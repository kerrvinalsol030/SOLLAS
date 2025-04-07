import express from 'express'
import { VerifierGetProfile, VerifierSignin, VerifierVerifyProperty, VerifierViewPropertyVerificationRecord } from '../controllers/Verifier.Controller'
import { Authenticate } from '../middlewares/Authentication'
import { images } from '../utility/Multer.Utility'

const router = express.Router()

router.post('/signin', VerifierSignin)

router.use(Authenticate)
router.get('/', VerifierGetProfile)
router.post('/verify-property', images, VerifierVerifyProperty)
router.get('/property-verification-record', VerifierViewPropertyVerificationRecord)

export { router as VerifierRoute }