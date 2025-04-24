import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { PropertyOwnerLoginInputs, PropertyOwnerReviewBoarderInputs } from '../dto'
import { Boarder, BoarderReview, Property, PropertyOwner, PropertyReview, Visit } from '../models'
import { ValidatePassword, GenerateSignature } from '../utility'
import { CreatePropertyInputs, PropertyGetVisits } from '../dto/Property.dto'
import { PropertyTransaction, PropertyTransactionDoc } from '../models/T_PropertyTransaction'
import { NotFoundError, AuthorizeError, ValidationError, APIError } from '../utility/Error/ErrorTypes'

//sign in
export const PropertyOwnerSignin = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const signinInputs = plainToClass(PropertyOwnerLoginInputs, req.body)

        const inputErrors = await validate(signinInputs, { validationError: { target: true } })

        if (inputErrors.length > 0) {
            res.status(400).json(inputErrors)
            return
        }

        const { email, password } = signinInputs
        const record = await PropertyOwner.findOne({ email })
        if (!record) throw new NotFoundError('Property Owner not found.')

        const isPasswordValid = await ValidatePassword(password, record.password, record.salt)
        if (!isPasswordValid) throw new ValidationError('Invalid credentials.')

        const signature = GenerateSignature({ _id: record.id, email: record.email })
        res.status(200).json({ record, signature })
        return

    } catch (error) {
        next(error)
    }
}

//GET PROPERTY OWNER PROFILE

export const GetPropertyOwnerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AuthorizeError('Not authorized. Please sign in.')

        const record = await PropertyOwner.findById(req.user._id)
        if (!record) throw new NotFoundError('Property owner record not found.')

        res.status(200).json(record)
        return

    } catch (error) {
        next(error)
    }
}

// CRUD PROPERTY

export const CreateProperty = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (!req.user) throw new AuthorizeError('Not authorized. Please sign in')

        req.body = { ...req.body, address: JSON.parse(req.body.address) }
        const propertyInputs = plainToClass(CreatePropertyInputs, req.body)
        const inputErrors = await validate(propertyInputs, { validationError: { target: true } })

        if (inputErrors.length > 0) {
            res.status(400).json({ message: 'invalid data', errors: inputErrors })
            return
        }

        const { propertyName, description, address, propertyType, headCount, amenities, safetyItems, secuirity, price, lat, lng } = propertyInputs

        const files = req.files as [Express.Multer.File]
        const mImages = files.map(i => i.filename)
        const newProperty = await Property.create({
            propertyName: propertyName,
            description: description,
            address: address,
            propertyType: propertyType, //House, Apartment, BedSpace
            headCount: headCount,
            images: mImages,
            amenities: amenities,
            safetyItems: safetyItems,
            secuirity: secuirity,
            price: price,
            ratings: 0,
            reviews: 0,
            propertyVerification: '',
            lat: lat,
            lng: lng,
        })

        if (!newProperty) throw new APIError('Error saving property.')
        const profile = await PropertyOwner.findById(req.user._id)
        if (!profile) throw new NotFoundError('Error finding the property owner. failed to update property owner.')
        profile.properties.push(newProperty)
        await profile.save()

        res.status(200).json({ property: newProperty })
        return


    } catch (error) {
        next(error)
    }
}


export const PropertyOwnerGetProperties = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (!req.user) throw new AuthorizeError('Not authorized. please sign in.')
        const profile = await PropertyOwner.findById(req.user._id).populate({ path: 'properties', populate: { path: 'propertyType', model: 'propertytypes' } }).exec()
        if (!profile) throw new NotFoundError('Property owner not found.')
        if (profile.properties.length <= 0) throw new NotFoundError('No properties found')
        res.status(200).json(profile.properties)
        return
    } catch (error) {
        next(error)
    }

}


export const PropertyOwnerUpdateProperty = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (!req.user) throw new NotFoundError('Not authorized. please sign in')

        const propertyId = req.params.propertyId
        let record = await PropertyOwner.findById(req.user._id)
        if (!record) throw new NotFoundError('Property owner not found')

        const isProperty = record.properties.find(id => id.toString() === propertyId)
        if (!isProperty) throw new NotFoundError('Property not found in owner property lists.')

        req.body = { ...req.body, address: JSON.parse(req.body.address) }
        const propertyInputs = plainToClass(CreatePropertyInputs, req.body)
        const inputErrors = await validate(propertyInputs, { validationError: { target: true } })

        if (inputErrors.length > 0) {
            res.status(400).json(inputErrors)
            return
        }

        const property = await Property.findById(propertyId)
        if (!property) throw new NotFoundError('Property record not found')

        const { propertyName, description, address, propertyType, headCount, amenities, safetyItems, secuirity, price, lat, lng } = propertyInputs
        const files = req.files as [Express.Multer.File]
        const mImages = files.map((file: Express.Multer.File) => file.filename)

        property.propertyName = propertyName;
        property.description = description;
        property.address = address;
        property.propertyType = propertyType;
        property.headCount = headCount;
        property.images = mImages as [string];
        property.amenities = amenities;
        property.safetyItems = safetyItems;
        property.secuirity = secuirity;
        property.price = price;
        property.lat = lat;
        property.lng = lng;

        const result = await property.save()
        if (!result) throw new APIError('Error updating record.')

        res.status(200).json(result)
        return

    } catch (error) {
        next(error)
    }
}

const ViewMeetings = async (req: Request, isActive: boolean | undefined, next: NextFunction): Promise<PropertyTransactionDoc[] | undefined> => {

    try {
        if (!req.user) throw new AuthorizeError('Not authorized! Please sign in.')

        const propertyOwner = await PropertyOwner.findById(req.user._id)

        if (!propertyOwner) throw new NotFoundError('property owner not found')

        const propertyTransactions = await PropertyTransaction.find({ isActive: isActive }).where('propertyId').in(propertyOwner.properties).exec()

        if (propertyTransactions.length <= 0) throw new NotFoundError('No meetings found')

        return propertyTransactions

    } catch (error) {
        next(error)
    }
}

//view pending request meetings
export const ViewPendingRequestMeetings = async (req: Request, res: Response, next: NextFunction) => {
    const pendingRequest = await ViewMeetings(req, undefined, next)
    res.status(200).json(pendingRequest)
}

//view active meeting
export const ViewActiveMeetings = async (req: Request, res: Response, next: NextFunction) => {
    const activeMeetings = await ViewMeetings(req, true, next)
    res.status(200).json(activeMeetings)
}

//approve or not approve request meetings
const updateMeetingRequest = async (transactionId: string, isApprove: boolean, remarks: string = '', next: NextFunction) => {

    try {
        const transaction = await PropertyTransaction.findById(transactionId)
        let record: PropertyTransactionDoc

        if (!transaction) throw new NotFoundError('Record not found')

        if (transaction.isActive !== undefined) throw new ValidationError('Transaction record cannot be changed')

        transaction.isActive = isApprove
        transaction.remarks = remarks

        record = await transaction.save()

        return record

    } catch (error) {
        next(error)
    }

}
export const ApproveRequestMeeting = async (req: Request, res: Response, next: NextFunction) => {

    const transaction = await updateMeetingRequest(req.params.transactionId, true, undefined, next)

    res.status(200).json(transaction)
    return
}

export const DisapproveRequestMeeting = async (req: Request, res: Response, next: NextFunction) => {
    const { remarks } = req.body
    const transaction = await updateMeetingRequest(req.params.transactionId, false, remarks, next)

    res.status(200).json(transaction)
    return
}



//update request meetings record
export const UpdateMeetingRequestDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AuthorizeError('not authorized!, please sign in.')
        const transactionId = req.params.transactionId
        const { isBoarderShown, isOccupied, remarks } = req.body
        const propertyTransaction = await PropertyTransaction.findById(transactionId)

        if (!propertyTransaction) throw new NotFoundError('Transaction not found')


        if (propertyTransaction.isActive != true) throw new ValidationError('Record cannot be changed!')

        propertyTransaction.isBoarderShown = isBoarderShown
        propertyTransaction.isOccupied = isOccupied
        propertyTransaction.remarks = remarks
        propertyTransaction.isActive = false
        const transaction = await propertyTransaction.save()
        res.status(200).json(transaction)
        return
    } catch (error) {
        next(error)
    }
}

export const ViewAllPropertyRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AuthorizeError("Not Authorized! please sign in!")
        const propertyOwner = await PropertyOwner.findById(req.user._id)

        if (!propertyOwner) throw new NotFoundError("Property Owner not found")

        const propertyTransactions = await PropertyTransaction.find().where('propertyId').in(propertyOwner.properties).exec()

        if (propertyTransactions.length <= 0) throw new NotFoundError("No Transactions Found")

        res.status(200).json(propertyTransactions)
        return
    } catch (error) {
        next(error)
    }
}

const computeBoarderRatings = async (boarderId: string): Promise<number> => {
    const BoarderRatings = await BoarderReview.find({ boarderId })
    let totalRatings = 0
    console.log(BoarderRatings)
    BoarderRatings.forEach(record => totalRatings = totalRatings + record.ratings) // total all ratings
    console.log(totalRatings + ' - ' + BoarderRatings.length)
    return totalRatings = (totalRatings) / BoarderRatings.length
}

//Review Boarder
export const PropertyOwnerReviewBoarder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boarderId = req.params.boarderId
        const reviewInputs = plainToClass(PropertyOwnerReviewBoarderInputs, req.body)
        const inputErrors = await validate(reviewInputs, { validationError: { target: true } })

        if (inputErrors.length > 0) {
            res.status(400).json(inputErrors)
            return
        }

        const { review, propertyId, propertyTransactionId, ratings } = reviewInputs

        let checkValues: any[] = [];
        checkValues.push(Property.findById(propertyId))
        checkValues.push(Boarder.findById(boarderId))
        checkValues.push(PropertyTransaction.findById(propertyTransactionId))

        const result = await Promise.all(checkValues)

        if (result[0] == null) throw new NotFoundError('Property not found. failed to save review')
        if (result[1] == null) throw new NotFoundError('Boarder not found. failed to save review')
        if (result[2] == null) throw new NotFoundError('transaction not found. failed to save review')


        const newReview = await BoarderReview.create({
            review: review,
            ratings: ratings,
            boarderId: boarderId,
            propertyId: propertyId,
            propertyTransactionId: propertyTransactionId,
            isEnabled: true
        })

        if (!newReview) throw new APIError('Failed to save review.')
        // Update Property Ratings
        const rating = await computeBoarderRatings(boarderId)
        result[1].ratings = rating
        await result[1].save()

        res.status(200).json({ review: newReview, boarder: result[1] })
        return


    } catch (error) {
        next(error)
    }
}

export const PropertyOwnerPropertyReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.propertyId) throw new ValidationError('Invalid property ID')
        const reviews = await PropertyReview.find({ propertyId: req.params.propertyId })
        res.status(200).json(reviews)
    } catch (error) {
        next(error)
    }
}


//VISITS
export const GetPropertyVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { propertyIds } = <PropertyGetVisits>req.body

        if (propertyIds.length <= 0) throw new ValidationError('Invalid property IDS')
        const VisitRecord = await Visit.find({ propertyId: { $in: propertyIds } })

        if (!VisitRecord) throw new NotFoundError('No record found')

        res.status(200).json(VisitRecord)
    } catch (error) {
        next(error)
    }
}