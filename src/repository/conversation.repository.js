import Conversation from "../models/conversation.js";
import CrudRepository from "./crud.repository.js";

class ConversationRepository extends CrudRepository {
    constructor() {
        super(Conversation);
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