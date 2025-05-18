import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { SALT_ROUNDS } from "../config/serverConfig.js"

const userSchema = new Schema({
    name: {
        type: String,
        minLength: [2, "Name must be at least 2 characters."],
        trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true,
        minLength: [6, "Password must be at least 6 characters."],
        // select: false
    },
    username: {
        type: String,
        sparse: true,
        unique: true,
        trim: true,
        minLength: [3, "Username must be at least 3 characters long."]
    },
    bio: {
        type: String,
        max: [500, "Bio cannot exceed 500 characters."],
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    birthDate: {
        type: Date,
    },
    avatar: {
        type: String,
    },
    location: {
        type: String,
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    isCurrentUser: {
        type: Boolean,
        default: false,
    },

    // posts: [{ 
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Post',
    // }],
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
