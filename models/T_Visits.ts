import mongoose, { Document, Schema } from "mongoose";

interface VisitDoc extends Document {
    propertyId: string,
    visitors: { boarderId: string, count: number }[],
    totalVisits: number,
}

const VisitSchema = new Schema({
    propertyId: { type: String, require: true },
    visitors: [{ boarderId: String, count: Number }],
    totalVisits: Number,
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }
})

const Visit = mongoose.model<VisitDoc>('visit', VisitSchema)

export { Visit }