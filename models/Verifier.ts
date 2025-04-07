import mongoose, { Schema, Document } from "mongoose";

interface VerifierDoc extends Document {
    name: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    rating: number;
}


const VerifierSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    salt: String,
    rating: Number
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    }
}
)


const Verifier = mongoose.model<VerifierDoc>('verifier', VerifierSchema)

export { Verifier }