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
    image: { type: String, default: "https://i.imgur.com/epIrs27.jpeg" },
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
    domain: { type: String, default: 'No' },
    batch: { type: String },
    dateOfBirth: { type: Date },
    age: { type: Number },
    gender: { type: String },
    guardian: { type: String },
    place: { type: String },
    educationQualification: { type: String },
    workExperience: { type: String },
    address: { type: String },
    notifyId: { type: String }
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
userSchema.statics.updateUserById = async function (userId, updateFields) {
    // Your update logic here
    const user = await this.findByIdAndUpdate(
        { _id: userId },
        {
            $set: updateFields,
            $currentDate: { updatedAt: true } // Optionally update the updatedAt field
        },
        { new: true } // Return the modified document
    );

    if (user && user.dateOfBirth) {
        const currentDate = new Date();
        const birthDate = new Date(user.dateOfBirth);
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        // Adjust age if birthday hasn't occurred yet this year
        if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
            user.age = age - 1;
        } else {
            user.age = age;
        }

        await user.save(); // Save the document after updating the age
    }

    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
