import mongoose, { Schema, Document } from "mongoose";

interface PropertyDoc extends Document {
    propertyName: string;
    description: string;
    address: {
        houseNo: string,
        street: string,
        barangay: string,
        municipality: string;
        province: string,
        postalCode: string
    };
    propertyType: string; //House, Apartment, BedSpace in Object ID
    headCount: number,
    images: [string];
    amenities: string;
    safetyItems: string;
    secuirity: string;
    price: number;
    ratings: number;
    reviews: string;
    propertyVerification: string;
    lat: number;
    lng: number;
}

const PropertySchema = new Schema({
    propertyName: { type: String, require: true },
    description: { type: String },
    address: {
        type: {
            houseNo: String,
            street: String,
            barangay: String,
            municipality: String,
            province: String,
            postalCode: String
        }, require: true
    },
    propertyType: { type: mongoose.SchemaTypes.ObjectId, ref: 'propertytypes', required: true },
    headCount: { type: Number, require: true },
    images: { type: [String] },
    amenities: { type: String },
    safetyItems: { type: String },
    secuirity: { type: String },
    price: { type: Number, require: true },
    ratings: { type: Number },
    reviews: { type: String },
    propertyVerification: { type: String },
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
})

const Property = mongoose.model<PropertyDoc>('property', PropertySchema)

export { Property }