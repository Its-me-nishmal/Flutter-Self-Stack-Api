import mongoose from 'mongoose';

const RequestCountSchema = new mongoose.Schema({
    totalRequests: {
        type: Number,
        default: 0
    }
});

const RequestCount = mongoose.model('RequestCount', RequestCountSchema);

export default RequestCount;
