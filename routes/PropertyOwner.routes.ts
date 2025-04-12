import express from 'express'
import { ApproveRequestMeeting, CreateProperty, DisapproveRequestMeeting, GetPropertyOwnerProfile, PropertyOwnerGetProperties, PropertyOwnerSignin, PropertyOwnerUpdateProperty, UpdateMeetingRequestDetail, ViewActiveMeetings, ViewAllPropertyRecords, ViewPendingRequestMeetings } from '../controllers'
import { Authenticate } from '../middlewares/Authentication'
import { images } from '../utility/Multer.Utility'

const router = express.Router()



router.post('/signin', PropertyOwnerSignin)

router.use(Authenticate)
router.get('/', GetPropertyOwnerProfile)
router.post('/property', images, CreateProperty)
router.get('/property', PropertyOwnerGetProperties)
router.put('/property/:propertyId', images, PropertyOwnerUpdateProperty)
router.get('/PendingRequestMeetings', ViewPendingRequestMeetings)
router.patch('/transaction/:transactionId/approve', ApproveRequestMeeting)
router.patch('/transaction/:transactionId/disapprove', DisapproveRequestMeeting)
router.get('/ViewActiveMeetings', ViewActiveMeetings)
router.get('/propertyTransactions', ViewAllPropertyRecords)
router.patch('/updateMeetingDetails/:transactionId', UpdateMeetingRequestDetail)


export { router as PropertyOwnerRoutes }