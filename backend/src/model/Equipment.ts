import mongoose, {Schema, model} from "mongoose";
import { IEquipment } from "../types/custom";

const equipmentSchema: Schema = new mongoose.Schema<IEquipment>({
    name: { 
        type: String, required: true
    },
    type: { 
        type: String, required: true
    },
    description: { type: String },
    status: {
        type: String,
        enum: ['available', 'reserved', 'maintenance'],
        default: 'available'
    },
    location: { type: String },
    reservationCount: { type: Number, default: 0 }
},{timestamps: true});
export default model<IEquipment>("Equipment", equipmentSchema)