import Message from "../models/message.js";
import CrudRepository from "./crud.repository.js";

class MessageRepository extends CrudRepository {
    constructor() {
        super(Message);
    }

    async getConversationsMessages(conversationId) {
        try {
            const messages = await Message.find({ conversationId })
                .sort({ createdAt: 1 });
                // .limit(50)
                // .populate('senderId', '_id username name avatar');
            
            return messages;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageRepository;