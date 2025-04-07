import { Length } from "class-validator";

export class CreatePropertyInputs {
    @Length(5, 50)
    propertyName: string;
    @Length(5, 50)
    description: string;
    @Length(5, 50)
    address: string;
    @Length(5, 50)
    propertyType: string; //House, Apartment, BedSpace
    headCount: number;
    images: [string];
    @Length(1, 50)
    amenities: string;
    @Length(1, 50)
    safetyItems: string;
    @Length(1, 50)
    secuirity: string;
    price: number;
    lat: number;
    lng: number;
}

