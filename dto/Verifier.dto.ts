import { IsEmail, Length } from "class-validator";

export class VerifierCreateInputs {
    name: string;
    phone: string;
    @IsEmail()
    email: string;
    @Length(9, 30)
    password: string;
}

export interface VerifierPayload {
    _id: string,
    email: string,
    name: string
}

export class VerifierLoginInputs {
    @IsEmail()
    email: string
    password: string
}

export class VerifierPropertyInputs {
    propertyId: string;
    remarks: string;
    // documents: [string]; //be handled by multer
    year: number
}