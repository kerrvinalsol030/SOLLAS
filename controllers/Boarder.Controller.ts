import { plainToClass } from 'class-transformer'
import { Request, Response, NextFunction } from 'express'
import { BoarderCreateInputs, BoarderLoginInputs, BoarderPayload, BoarderReviewPropertyInputs } from '../dto'
import { validate } from 'class-validator'
import { EncryptPassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utility'
import { Boarder, BoarderReview, Property, PropertyReview } from '../models'
import { PropertyTransaction } from '../models/T_PropertyTransaction'
import { APIError, NotFoundError } from '../utility/Error/ErrorTypes'

export const BoarderSignup = async (req: Request, res: Response, next: NextFunction) => {
    const createInputs = plainToClass(BoarderCreateInputs, req.body)
    const inputErrors = await validate(createInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors)
        return
    }

    const { name, phone, email, password } = createInputs

    const isExists = await Boarder.findOne({ email })

    if (isExists) {
        res.status(400).json({ message: 'Account already exists!' })
        return
    }

    const salt = await GenerateSalt()
    const ePassword = await EncryptPassword(password, salt)



    const boarder = await Boarder.create({
        name: name,
        phone: phone,
        email: email,
        password: ePassword,
        salt: salt,
        ratings: 0
    })

    if (boarder) {
        const signature = GenerateSignature({ _id: boarder.id, email, name } as BoarderPayload)
        res.status(200).json({ boarder, signature })
        return
    }


    res.status(400).json({ message: 'Something went wrong' })
    return
}

export const BoarderSignin = async (req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(BoarderLoginInputs, req.body)
    const inputErrors = await validate(loginInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors)
        return
    }

    const { email, password } = loginInputs
    const boarder = await Boarder.findOne({ email })

    if (boarder) {
        const isPasswordValid = await ValidatePassword(password, boarder.password, boarder.salt)
        if (isPasswordValid) {
            const signature = GenerateSignature({ _id: boarder.id, email, name: boarder.name } as BoarderPayload)
            res.status(200).json({ boarder, signature })
            return
        }
    }
    res.status(400).json({ message: 'invalid credential' })
    return
}

export const BoarderProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const boarder = await Boarder.findById(user._id)
        if (boarder) {
            res.status(400).json(boarder)
            return
        }
    }
    res.status(400).json({ message: 'invalid credential' })
    return
}

export const BoarderTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const boarder = await Boarder.findById(user._id)
        if (boarder) {
            const transactions = await PropertyTransaction.find({ boarderId: user._id })
            res.status(200).json(transactions)
            return
        }
    }
    res.status(400).json({ message: 'invalid credential' })
    return
}

export const BoarderReviews = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const boarder = await Boarder.findById(user._id)
        if (boarder) {
            const transactions = await BoarderReview.find({ boarderId: user._id })
            res.status(200).json(transactions)
            return
        }
    }
    res.status(400).json({ message: 'invalid credential' })
    return
}

export const SetUpPropertyViewing = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const propertyId = req.params.propertyId
    const { meetingDate } = req.body
    let isExists = false

    if (user) {
        const records = await PropertyTransaction.find({ boarderId: user._id, propertyId })
        if (records) {
            records.map(record => {
                if (new Date(record.meetingDate).toISOString() == new Date(meetingDate).toISOString()) {
                    isExists = true
                }
            })
        }
        if (isExists) {
            res.status(400).json({ message: "Record alread exists!." })
            return
        }

        const propertyTransaction = await PropertyTransaction.create({
            propertyId: propertyId,
            boarderId: user._id,
            meetingDate: meetingDate,
            isBoarderShown: undefined,
            isOccupied: undefined,
            remarks: '',
            isActive: undefined
        })
        if (propertyTransaction) {
            res.status(200).json(propertyTransaction)
            return
        }
    }
    res.status(400).json({ message: 'Please sign in' })
    return
}


//REVIEW PROPERTY
export const BoarderReviewProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const propertyId = req.params.propertyId
        const reviewInputs = plainToClass(BoarderReviewPropertyInputs, req.body)
        const inputErrors = await validate(reviewInputs, { validationError: { target: true } })

        if (inputErrors.length > 0) {
            res.status(400).json(inputErrors)
            return
        }

        const { review, propertyTransactionId, ratings } = reviewInputs

        let checkValues: any[] = [];
        checkValues.push(Property.findById(propertyId))
        checkValues.push(Boarder.findById(req.user!._id))
        checkValues.push(PropertyTransaction.findById(propertyTransactionId))

        const result = await Promise.all(checkValues)

        if (result[0] == null) throw new NotFoundError('Property not found. failed to save review')
        if (result[1] == null) throw new NotFoundError('Boarder not found. failed to save review')
        if (result[2] == null) throw new NotFoundError('transaction not found. failed to save review')


        const newReview = await PropertyReview.create({
            review: review,
            ratings: ratings,
            boarderId: req.user!._id,
            propertyId: propertyId,
            propertyTransactionId: propertyTransactionId,
            isEnabled: true
        })

        if (!newReview) throw new APIError('Failed to save review.')

        res.status(200).json({ review: newReview })
        return


    } catch (error) {
        next(error)
    }
}

