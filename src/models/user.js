import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { SALT_ROUNDS } from "../config/serverConfig.js"

const userSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true,
        // select: false
    },
}, { timestamps: true });


userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = model('User', userSchema);
export default User;
