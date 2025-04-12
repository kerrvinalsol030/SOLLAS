import mongoose, { Document, Schema } from "mongoose";

export interface PropertyTransactionDoc extends Document {
    propertyId: string,
    boarderId: string,
    meetingDate: Date,
    isBoarderShown: boolean,
    isOccupied: boolean,
    remarks: string,
    isActive: boolean //undefined - pending //false - disapprove //true - approved
    //if isActive === undefined/false { the record cannot be changed }
    //else updatable
}

const PropertyTransactionSchema = new Schema({
    propertyId: { type: mongoose.SchemaTypes.ObjectId, ref: 'property' },
    boarderId: { type: mongoose.SchemaTypes.ObjectId, ref: 'boarder' },
    meetingDate: Date,
    isBoarderShown: Boolean,
    isOccupied: Boolean,
    remarks: String,
    isActive: Boolean
})

const PropertyTransaction = mongoose.model<PropertyTransactionDoc>('propertytransaction', PropertyTransactionSchema)

export { PropertyTransaction }