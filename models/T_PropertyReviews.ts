import mongoose, { Document, Schema } from "mongoose";

interface PropertyReviewsDoc extends Document {
    review: string,
    ratings: number,
    boarderId: string,
    propertyId: string,
    propertyTransactionId: string
    isEnabled: boolean
}

const PropertyReviewSchema = new Schema({
    review: String,
    ratings: Number,
    boarderId: String,
    propertyId: String,
    propertyTransactionId: String,
    isEnabled: Boolean
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    }
})

const PropertyReview = mongoose.model<PropertyReviewsDoc>('propertyreview', PropertyReviewSchema)

export { PropertyReview }