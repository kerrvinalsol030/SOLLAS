import { Request, Response, NextFunction } from "express";
import { ValidateSignature } from "../utility";

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const isAuth = await ValidateSignature(req)
    if(isAuth)
        next()
    else
        res.status(400).json({message : 'Not Authorized'})
}