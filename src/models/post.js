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
    
}, { timestamps: true });

const Post = model('Post', postSchema);
export default Post;
