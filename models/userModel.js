import mongoose from "mongoose";
import { v4  as uuidv4 } from 'uuid'
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    _id: { type: String, default: ()=> `sefl-stack-${ uuidv4() }`, required : true},
    username: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    password: { type: String },
    phone: { type: Number, unique: true },
    roll: { type: String, default: "Student" }
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
