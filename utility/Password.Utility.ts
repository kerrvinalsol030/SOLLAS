import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config/config'
import { Request } from 'express'
import { AuthPayload } from '../dto/Auth.dto'


export const GenerateSalt = async () => await bcrypt.genSalt(10)

export const EncryptPassword = async (password: string, salt: string) => await bcrypt.hash(password, salt)

export const ValidatePassword = async (enteredPassword: string, recordPassword: string, salt: string) => await EncryptPassword(enteredPassword, salt) === recordPassword

export const GenerateSignature = (payload: AuthPayload) => jwt.sign(payload, APP_SECRET, { expiresIn: '1d' })

export const ValidateSignature = async (req: Request) => {
    const signature = req.get('Authorization')
    if (!signature) return false
    try {
        const payload = jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload
        req.user = payload
        return true
    } catch (error) {
        return false
    }

}