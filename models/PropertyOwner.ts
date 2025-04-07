import mongoose, { Schema, Document } from 'mongoose'

interface PropertOwnerDoc extends Document {
    name: string;
    email: string;
    password: string;
    salt: string;
    address: string;
    phone: string;
    gender: string;
    image: string;
    properties: [any];
}

const PropertyOwnerSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    address: { type: String },
    phone: { type: String },
    gender: { type: String },
    image: { type: String },
    properties: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'property'
    }]
})




const PropertyOwner = mongoose.model<PropertOwnerDoc>('propertyOwner', PropertyOwnerSchema)

export { PropertyOwner }
