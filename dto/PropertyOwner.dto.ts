import { IsEmail, IsEmpty, IsNumber, Length } from 'class-validator'


export class PropertyOwnerCreateInputs {
    @Length(10, 50)
    name: string

    @IsEmail()
    email: string

    @Length(5, 30)
    password: string

    @Length(10, 50)
    address: string

    @Length(9, 15)
    phone: string;

    gender: string;
}

export interface PropertyOwnerPayload {
    _id: string,
    email: string,
}

export class PropertyOwnerLoginInputs {
    @IsEmail()
    email: string;

    @Length(5, 30)
    password: string;
}

export class PropertyOwnerReviewBoarderInputs {
    review: string;
    @IsNumber()
    ratings: number;
    boarderId: string;
    propertyId: string;
    propertyTransactionId: string
}