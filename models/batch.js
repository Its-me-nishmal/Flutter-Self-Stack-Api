// batch.model.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const batchSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    studentIds: [{ type: String, ref: 'User' }] // Array of Student IDs referencing the User model
    // Add other fields as needed
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
