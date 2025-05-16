import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
        min: [2, "Content must be at least 2 characters."],
        trim: true,
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    
}, { timestamps: true });

const Post = model('Post', postSchema);
export default Post;
