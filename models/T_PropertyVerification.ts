import mongoose, { Document, Schema } from "mongoose";

interface PropertyVerificationDoc extends Document {
    propertyId: string,
    verifierId: string,
    remarks: string,
    documents: [string],
    year: number
}

const PropertyVerificationSchema = new Schema({
    propertyId: String,
    verifierId: String,
    remarks: String,
    documents: [String],
    year: Number
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    }
})

const PropertyVerification = mongoose.model<PropertyVerificationDoc>('propertyVerification', PropertyVerificationSchema)

export { PropertyVerification }