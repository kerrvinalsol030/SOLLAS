import { Request, Response, NextFunction } from "express"
import { VerifierCreateInputs, VerifierLoginInputs, VerifierPayload, VerifierPropertyInputs } from "../dto"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { Property, PropertyOwner, PropertyVerification, Verifier } from "../models"
import { EncryptPassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility"

export const VerifierSignup = async (req: Request, res: Response, next: NextFunction) => {
    const inputs = plainToClass(VerifierCreateInputs, req.body)
    const inputErrors = await validate(inputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors)
        return
    }
    const { name, phone, email, password } = inputs
    const salt = await GenerateSalt()
    const ePassword = await EncryptPassword(password, salt)
    const verifier = await Verifier.create({
        name: name,
        phone: phone,
        email: email,
        password: ePassword,
        salt: salt,
        rating: 0
    })

    if (verifier) {
        const signature = GenerateSignature({ _id: verifier.id, name: verifier.name, email: verifier.email } as VerifierPayload)
        res.status(200).json({ record: verifier, signature })
        return
    }

    res.status(400).json({ message: '' })
    return
}

export const VerifierSignin = async (req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(VerifierLoginInputs, req.body)
    const inputErrors = await validate(loginInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors)
        return
    }
    const { email, password } = loginInputs
    const record = await Verifier.findOne({ email })
    if (record) {
        const isPasswordCorrect = await ValidatePassword(password, record.password, record.salt)
        if (isPasswordCorrect) {
            const payload = { _id: record.id, name: record.name, email: record.email } as VerifierPayload
            const signature = GenerateSignature(payload)
            res.status(200).json({ signature, profile: record })
            return
        }
    }
    res.status(400).json({ message: 'Invalid Credentials' })
    return
}

export const VerifierGetProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const record = await Verifier.findById(user._id)
        res.status(200).json(record)
        return
    }
    res.status(200).json({ message: 'Please sign in' })
    return
}

export const VerifierVerifyProperty = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const { propertyId, remarks, year } = <VerifierPropertyInputs>req.body
    if (user) {
        const property = await Property.findById(propertyId)
        if (property) {
            //get images from multer
            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename)
            //create record on transaction propertyVerification
            const T_record = await PropertyVerification.create({
                propertyId: propertyId,
                verifierId: user._id,
                remarks: remarks,
                year: year,
                documents: images
            })
            if (T_record) {
                //update property.propertyVerification
                property.propertyVerification = T_record.id
                const result = await property.save()
                res.status(200).json({ property: result, Verification: T_record })
                return
            }
        } else {
            res.status(400).json({ message: 'Property not found' })
            return
        }
    }
    res.status(200).json({ message: 'Not Authorized!' })
    return
}

export const VerifierViewPropertyVerificationRecord = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const properties = await PropertyVerification.find({ verifierId: user._id })
        if (properties) {
            res.status(200).json(properties)
            return
        }
    }
    res.status(400).json({ message: 'Please sign in' })
    return
}