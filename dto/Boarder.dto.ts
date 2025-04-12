import { IsEmail, IsNumber } from "class-validator";

export class BoarderCreateInputs {
    name: string
    phone: string
    @IsEmail()
    email: string
    password: string
}

export class BoarderLoginInputs {
    @IsEmail()
    email: string;
    password: string
}

export interface BoarderPayload {
    _id: string
    email: string,
    name: string
}

export class BoarderReviewPropertyInputs {
    review: string;
    @IsNumber()
    ratings: number;
    boarderId: string;
    propertyTransactionId: string
}