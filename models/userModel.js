import mongoose from "mongoose";
import { v4  as uuidv4 } from 'uuid'
import bcrypt from "bcrypt"

const userSchema = new Schema({
    _id: { type: String, default: () => `self-stack-user-${uuidv4()}`, required: true },
    username: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    password: { type: String },
    phone: { type: Number, unique: true },
    passwordResetOTP: { type: String },
    passwordResetExpires: { type: Date },
    roll: { type: String, default: "Student" },
    profile: { type: String },
    googleId: { type: String },
    tasksStarted: [{ taskId: { type: Schema.Types.ObjectId, ref: 'tasks' }, date: { type: Date, default: Date.now } }],
    tasksCompleted: [{ taskId: { type: Schema.Types.ObjectId, ref: 'tasks' }, date: { type: Date } }]
}, { timestamps: true });

// Set a default task for the tasksStarted array
userSchema.pre('save', function (next) {
    if (!this.tasksStarted || this.tasksStarted.length === 0) {
        // Set default task (replace 'defaultTaskId' with the actual ID of the default task)
        this.tasksStarted.push({ taskId: mongoose.Types.ObjectId('65b4dcbf99ed8f5bfb782a9e') });
    }
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const hashpass = await bcrypt.hash(this.password, 10);
        this.password = hashpass;
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (pass){
    return bcrypt.compare(pass,this.password)
}

const User = mongoose.model('User', userSchema);

export default User;
