import { Request, Response, NextFunction } from 'express'
import { Property } from '../models'


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