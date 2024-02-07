import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true
    },
    advisor: {
        type: String,
        required: true
    },
    reviewver: {
        type: String,
    },
    student: {
        type: String,
        required: true
    },
    scheduleDate: {
        type: Date,
        default: Date.now
    },
    completedDate: {
        type: Date
    },
    reviewDetails: {
        type: [
            {
                status: {
                    type: String,
                    required: true
                },
                color: {
                    type: String,
                    required: true
                }
            }
        ],
        default: [
            { status: 'scheduled', color: 'blue' }
        ]
    },
    pendingTopics: {
        type: String
    },
    remarks: {
        type: String
    },
    points: {
        type: Number,
        min: 1,
        max: 10
    }
});

const ReviewTask = mongoose.model('ReviewTask', reviewSchema);

export default ReviewTask;
