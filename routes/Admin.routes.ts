import express from 'express'
import { GetAllPropertyTypes, PropertyOwnerSignin, PropertyOwnerSignUp, VerifierSignup, ViewNotVerifiedProperties, ViewVerifiedProperties } from '../controllers'


const router = express.Router()

router.post('/propertyOwner', PropertyOwnerSignUp)
router.post('/propertyOwner/signin', PropertyOwnerSignin)

router.get('/propertyTypes', GetAllPropertyTypes)
router.post('/verifier', VerifierSignup)
router.get('/property-verified', ViewVerifiedProperties)
router.get('/property-not-verified', ViewNotVerifiedProperties)






export { router as AdminRoutes }