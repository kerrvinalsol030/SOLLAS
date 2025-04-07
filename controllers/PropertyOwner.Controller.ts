import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { PropertyOwnerLoginInputs } from '../dto'
import { Property, PropertyOwner } from '../models'
import { ValidatePassword, GenerateSignature } from '../utility'
import { CreatePropertyInputs } from '../dto/Property.dto'

//sign in
export const PropertyOwnerSignin = async (req: Request, res: Response, next: NextFunction) => {
    const signinInputs = plainToClass(PropertyOwnerLoginInputs, req.body)

    const inputErrors = await validate(signinInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors)
        return
    }

    const { email, password } = signinInputs

    const record = await PropertyOwner.findOne({ email })

    if (record !== null) {
        const isPasswordValid = await ValidatePassword(password, record.password, record.salt)
        if (isPasswordValid) {
            const signature = GenerateSignature({ _id: record.id, email: record.email })
            res.status(200).json({ record, signature })
            return
        }
        res.status(400).json({ message: 'invalid credentials' })
        return
    }
    res.status(400).json({ message: "Account not exists" })
    return
}

//GET PROPERTY OWNER PROFILE

export const GetPropertyOwnerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const record = await PropertyOwner.findById(user._id)
        if (record !== null) {
            res.status(200).json(record)
            return
        }
    }
    res.status(400).json('No record found')
    return
}

// CRUD PROPERTY

export const CreateProperty = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const propertyInputs = plainToClass(CreatePropertyInputs, req.body)
        const inputErrors = await validate(propertyInputs, { validationError: { target: true } })
        if (inputErrors.length > 0) {
            res.status(400).json({ message: 'invalid data', errors: inputErrors })
            return
        }

        const { propertyName, description, address, propertyType, headCount, images, amenities, safetyItems, secuirity, price, lat, lng } = propertyInputs

        const newProperty = await Property.create({
            propertyName: propertyName,
            description: description,
            address: address,
            propertyType: propertyType, //House, Apartment, BedSpace
            headCount: headCount,
            images: [],
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
        console.log(newProperty)
        if (newProperty) {
            const profile = await PropertyOwner.findById(user._id)
            if (profile) {
                profile.properties.push(newProperty)
                await profile.save()
            }
            res.status(200).json({ property: newProperty })
            return
        }

    }
    res.status(400).json({ message: "Please sign in" })
    return
}


export const PropertyOwnerGetProperties = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const profile = await PropertyOwner.findById(user._id).populate({ path: 'properties', populate: { path: 'propertyType', model: 'propertytypes' } }).exec()
        if (profile)
            res.status(200).json(profile.properties)
        return
    }
    res.status(400).json({ message: "Please sign in" })
    return
}


export const PropertyOwnerUpdateProperty = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const propertyId = req.params.propertyId
    if (user) {
        let record = await PropertyOwner.findById(user._id)
        if (record) {
            const isProperty = record.properties.find(id => id.toString() === propertyId)
            if (isProperty) {
                const propertyInputs = plainToClass(CreatePropertyInputs, req.body)
                const inputErrors = await validate(propertyInputs, { validationError: { target: true } })

                if (inputErrors.length > 0) {
                    res.status(400).json(inputErrors)
                    return
                }
                const property = await Property.findById(propertyId)
                if (property) {
                    const { propertyName, description, address, propertyType, headCount, images, amenities, safetyItems, secuirity, price, lat, lng } = propertyInputs
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
                    if (result) {
                        res.status(200).json(result)
                        return
                    }
                }
            } else {
                res.status(400).json({ message: 'Not Authorized!' })
                return
            }
        }
    }
    res.status(400).json('Please sign in')
    return
}

