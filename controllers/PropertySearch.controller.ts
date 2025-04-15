import { Request, Response, NextFunction } from 'express'
import { Property, Visit } from '../models'
import { AuthPayload } from '../dto'
import { AuthorizeError, NotFoundError } from '../utility/Error/ErrorTypes'


//native enum
const propertySearchType = {
    Municipality: "Municipality 123",
    PostalCode: "PostalCode 123",
    All: "All"
} as const

type searchType = keyof typeof propertySearchType
// type searchTypeValue = typeof propertySearchType[searchType]


const SearchProperty = async (propertySearchType: searchType, value: string) => {
    let properties;
    if (propertySearchType === 'Municipality') {
        properties = await Property.find({ "address.municipality": value })
    } else if (propertySearchType === 'PostalCode') {
        properties = await Property.find({ "address.postalCode": value })
    } else {
        properties = await Property.find()
    }

    return properties

}

export const ViewListProperty = async (req: Request, res: Response, next: NextFunction) => {
    //view listings sorted: ratings

    if (req.user) {
        console.log(req.user)
    }
    const properties = await SearchProperty('All', req.params.key)
    res.status(200).json(properties)
    return

}

export const ViewListPropertyByMunicipality = async (req: Request, res: Response, next: NextFunction) => {
    const properties = await SearchProperty('Municipality', req.params.key)
    res.status(200).json(properties)
    return
}

export const ViewListPropertyByPostalCode = async (req: Request, res: Response, next: NextFunction) => {
    const properties = await SearchProperty('PostalCode', req.params.key)
    res.status(200).json(properties)
    return
}

const UpdateVisitRecord = async (user: AuthPayload, propertyId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0) // start of the day
    const todayLasthour = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const visitRecord = await Visit.findOne({ createdAt: { $gte: today, $lt: todayLasthour }, propertyId })

    if (visitRecord) {
        const visitor = visitRecord.visitors.find(visitor => visitor.boarderId === user._id)
        if (visitor !== undefined) {
            visitRecord.visitors = visitRecord.visitors.filter(visitor => visitor.boarderId !== user._id)
            visitRecord.visitors = [...visitRecord.visitors, { boarderId: visitor.boarderId, count: visitor.count + 1 }]
        } else {
            visitRecord.visitors = [...visitRecord.visitors, { boarderId: user._id, count: 1 }]
        }
        visitRecord.totalVisits += 1
        const newRecord = await visitRecord.save()
        console.log(newRecord)
    } else {
        const newRecord = await Visit.create({
            propertyId: propertyId,
            visitors: [{ boarderId: user._id, count: 1 }],
            totalVisits: 1
        })
        console.log(newRecord)
    }
}

export const PropertySearchById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AuthorizeError('Not authorized. Please sign in')

        const propertyId = req.params.propertyId
        const property = await Property.findById(propertyId)
        if (!property) throw new NotFoundError('property not found')
        //save user info to VISIT Model
        await UpdateVisitRecord(req.user, property.id)
        res.status(200).json(property)
        return
    } catch (error) {
        next(error)
    }
}   