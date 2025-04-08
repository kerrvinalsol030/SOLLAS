import mongoose, { Document, Schema } from "mongoose";

interface BoarderDoc extends Document {
    name: string,
    phone: string,
    email: string,
    password: string,
    salt: string,
    ratings: number
}

const BoardeSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    ratings: { type: Number, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    }
})


const Boarder = mongoose.model<BoarderDoc>('boarder', BoardeSchema)

export { Boarder }