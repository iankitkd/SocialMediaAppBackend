import Conversation from "../models/conversation.js";
import CrudRepository from "./crud.repository.js";

class ConversationRepository extends CrudRepository {
    constructor() {
        super(Conversation);
    }

    async getConversation({userId, receiverId}) {
        try {
            let conversation = null;
            if (userId === receiverId) {
                // Special case query for self chat
                conversation = await Conversation.findOne({
                    participants: [userId, userId]
                });
            } else {
                // Normal conversation between two users
                conversation = await Conversation.findOne({
                    participants: { $all: [userId, receiverId], $size: 2 }
                });
            }
            return conversation;
        } catch (error) {
            throw error;
        }
    }

    async getUserConversations(userId) {
        try {
            const conversations = await Conversation.find({ participants: userId })
                .sort({ updatedAt: -1 })
                .populate('participants', '_id name username avatar')
                .populate('lastMessage');
            
            return conversations;
        } catch (error) {
            throw error;
        }
    }
}

export default ConversationRepository;