import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
        max: [280, "Content can't exceed 280 characters."],
        trim: true,
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    
    commentsCount: {
        type: Number,
        default: 0,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isOwner: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

const Post = model('Post', postSchema);
export default Post;
