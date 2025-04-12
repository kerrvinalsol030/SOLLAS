import { Request, Response, NextFunction } from "express";
import { ValidateSignature } from "../utility";
import { AuthorizeError } from "../utility/Error/ErrorTypes";

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isAuth = await ValidateSignature(req)
        if (isAuth)
            next()
        else
            throw new AuthorizeError('Not authorized! Please sign in')
    } catch (error) {
        next(error)
    }

}