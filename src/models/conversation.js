import { Schema, model } from 'mongoose';

const conversationSchema = new Schema({
    participants: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }],

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        // required: true,
    },
    
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

const Conversation = model('Conversation', conversationSchema);
export default Conversation;
