import { Request, Response, NextFunction } from 'express'
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { PropertyOwnerCreateInputs, PropertyOwnerLoginInputs, PropertyOwnerPayload } from "../dto"
import { Property, PropertyOwner, PropertyType } from "../models"
import { GenerateSalt, EncryptPassword, GenerateSignature, ValidatePassword } from "../utility"

//Sign up
export const PropertyOwnerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const POInputs = plainToClass(PropertyOwnerCreateInputs, req.body)

    const inputErrors = await validate(POInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors)
        return
    }

    const { name, email, address, gender, phone, password } = POInputs

    const isExists = await PropertyOwner.findOne({ email })

    if (isExists !== null) {
        res.status(400).json({ message: 'Email already exists.' })
        return
    }

    const salt = await GenerateSalt()
    const encryptedPassword = await EncryptPassword(password, salt)

    //GENERATE SIGNATURE

    const newPropertyOwner = {
        name: name,
        email: email,
        password: encryptedPassword,
        salt: salt,
        address: address,
        phone: phone,
        gender: gender,
    }

    const newRecord = await PropertyOwner.create(newPropertyOwner)

    if (newRecord) {
        const payload = { _id: newRecord.id, email: newRecord.email } as PropertyOwnerPayload
        const signature = GenerateSignature(payload)
        res.status(200).json({ Property_Owner: newRecord, signature })
        return
    }


    res.status(500).json({ message: 'Something went wrong' })
    return

}

export const GetPropertyOwner = async (req: Request, res: Response, next: NextFunction) => {
    const record = await PropertyOwner.find()
    if (record)
        res.status(200).json(record)
    return
}

//GET ALL PROPERTIES
export const GetAllPropertyTypes = async (req: Request, res: Response, next: NextFunction) => {
    const POTypes = await PropertyType.find()
    if (POTypes !== null) {
        res.status(200).json(POTypes)
        return
    }
    res.json(400).json({ message: "No property types found" })
    return
}

const ViewProperties = async (isVerified: boolean = true) => {
    const properties = await Property.find()
    if (isVerified)
        return properties.filter(property => property.propertyVerification != "")
    else
        return properties.filter(property => property.propertyVerification === "")
}

export const ViewVerifiedProperties = async (req: Request, res: Response, next: NextFunction) => {
    const properties = await ViewProperties()
    res.status(200).json(properties)
    return
}
export const ViewNotVerifiedProperties = async (req: Request, res: Response, next: NextFunction) => {
    const properties = await ViewProperties(false)
    res.status(200).json(properties)
    return
}


//get owners
//updateOwners
//Get Owners By ID