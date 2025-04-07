import express from 'express'
import { CreateProperty, GetPropertyOwnerProfile, PropertyOwnerGetProperties, PropertyOwnerSignin, PropertyOwnerUpdateProperty } from '../controllers'
import { Authenticate } from '../middlewares/Authentication'
import { images } from '../utility/Multer.Utility'

const router = express.Router()



router.post('/signin', PropertyOwnerSignin)

router.use(Authenticate)
router.get('/', GetPropertyOwnerProfile)
router.post('/property', images, CreateProperty)
router.get('/property', PropertyOwnerGetProperties)
router.put('/property/:propertyId', images, PropertyOwnerUpdateProperty)


export { router as PropertyOwnerRoutes }