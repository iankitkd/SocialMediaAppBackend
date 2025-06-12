import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        // max: [280, "Content can't exceed 280 characters."],
    },
    senderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    conversationId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Conversation',
        required: true 
    },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = model('Message', messageSchema);
export default Message;
