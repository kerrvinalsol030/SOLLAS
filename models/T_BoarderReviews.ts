import mongoose, { Document, Schema } from "mongoose";

interface BoarderReviewsDoc extends Document {
    review: string,
    ratings: number,
    boarderId: string,
    propertyId: string,
    propertyTransactionId: string
    isEnabled: boolean
}

const BoarderReviewSchema = new Schema({
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

const BoarderReview = mongoose.model<BoarderReviewsDoc>('boarderreview', BoarderReviewSchema)

export { BoarderReview }