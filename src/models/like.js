import { Schema, model } from 'mongoose';

const likeSchema = new Schema({
  post: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
}, { timestamps: true });

// Prevent duplicate likes by same user on same post
likeSchema.index({ post: 1, user: 1 }, { unique: true });


const Like = model('Like', likeSchema);
export default Like;