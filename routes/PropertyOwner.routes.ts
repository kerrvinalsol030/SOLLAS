import express from 'express'
import { ApproveRequestMeeting, CreateProperty, DisapproveRequestMeeting, GetPropertyOwnerProfile, GetPropertyVisits, PropertyOwnerGetProperties, PropertyOwnerPropertyReviews, PropertyOwnerReviewBoarder, PropertyOwnerSignin, PropertyOwnerUpdateProperty, UpdateMeetingRequestDetail, ViewActiveMeetings, ViewAllPropertyRecords, ViewPendingRequestMeetings } from '../controllers'
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
router.post('/review-boarder/:boarderId', PropertyOwnerReviewBoarder)
router.get('/property-reviews/:propertyId', PropertyOwnerPropertyReviews)
router.get('/property-visits', GetPropertyVisits)


export { router as PropertyOwnerRoutes }