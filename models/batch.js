// batch.model.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const Schema = mongoose.Schema;

const batchSchema = new Schema({
    _id: { type: String, default: () => `self-stack-batch-${uuidv4()}`, required: true },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    studentIds: [{ type: String, ref: 'User' }] // Array of Student IDs referencing the User model
    // Add other fields as needed
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
