import { Length } from "class-validator";

export class CreatePropertyInputs {
    @Length(5, 50)
    propertyName: string;
    @Length(5, 50)
    description: string;
    address: propertyAddress;
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

export interface propertyAddress {
    houseNo: string,
    street: string,
    barangay: string,
    municipality: string;
    province: string,
    postalCode: string
}

export interface PropertyGetVisits {
    propertyIds: string[]
}