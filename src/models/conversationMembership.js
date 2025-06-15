import { Schema, model } from 'mongoose';

const conversationMembershipSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    lastReadAt: {
        type: Date,
        default: new Date(0)
    },
    unreadCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

conversationMembershipSchema.index({ userId: 1, conversationId: 1 }, { unique: true });

const ConversationMembership = model("ConversationMembership", conversationMembershipSchema);

export default ConversationMembership;
