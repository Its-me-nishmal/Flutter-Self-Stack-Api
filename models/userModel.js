import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, default: () => `self-stack-user-${uuidv4()}`, required: true },
    username: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    password: { type: String },
    phone: { type: Number },
    passwordResetOTP: { type: String },
    passwordResetExpires: { type: Date },
    roll: { type: String, default: "Student" },
    profile: { type: String },
    googleId: { type: String },
    tasksStarted: [{ 
        _id: { type: String, default: () => `self-stack-taskStarted-${uuidv4()}`, required: true },
        taskId: { type: String, ref: 'tasks' },
        date: { type: Date, default: Date.now }
    }],
    tasksCompleted: [{ 
        _id: { type: String, default: () => `self-stack-taskCompleted-${uuidv4()}`, required: true },
        taskId: { type: String, ref: 'tasks' },
        date: { type: Date }
    }],
    courseId: { type: String, ref: 'tasks' },
    domain: { type: String, default: 'No' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const hashpass = await bcrypt.hash(this.password, 10);
        this.password = hashpass;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (pass) {
    return bcrypt.compare(pass, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
