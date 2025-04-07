import mongoose, { Schema, Document } from "mongoose";

interface PropertyTypeDoc extends Document {
    propertyType: string,
    description: string,
    shared: []
}

const propertyTypeSchema = new Schema({
    propertyType: { type: String, required: true },
    description: { type: String },
    shared: [String]
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
        }
    }
})


const PropertyType = mongoose.model<PropertyTypeDoc>('propertytypes', propertyTypeSchema)

export { PropertyType }