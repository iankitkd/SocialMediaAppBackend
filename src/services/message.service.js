import MessageRepository from "../repository/message.repository.js";
import ConversationRepository from "../repository/conversation.repository.js";

class MessageService {
    constructor() {
        this.messageRepository = new MessageRepository();
        this.conversationRepository = new ConversationRepository();
    }
    
    async createMessage({content, senderId, receiverId}) {
        try {
            const conversation = await this.getOrCreateConversation({senderId, receiverId});
            const message = await this.messageRepository.create({content, senderId, conversationId: conversation._id});
            await this.conversationRepository.update(conversation._id, {
                lastMessage: message._id,
            })
            return message;
        } catch (error) {
            throw error;
        }
    }
    
    async getMessages({userId, receiverId}) {
        try {
            const conversation = await this.conversationRepository.getOne({
                participants: { $all: [userId, receiverId], $size: 2 }
            });
            
            if(!conversation) {
                return [];
            }
            const messages = await this.messageRepository.getConversationsMessages(conversation.id);
            return messages;
        } catch (error) {
            throw error;
        }
    }

    async getOrCreateConversation({senderId, receiverId}) {
        try {
            let conversation = await this.conversationRepository.getOne({
                participants: { $all: [senderId, receiverId], $size: 2 }
            });

            if (!conversation) {
                conversation = await this.conversationRepository.create({
                    participants: [senderId, receiverId],
                });
            } 

            // conversation = await conversation.populate('participants', '_id name username avatar').execPopulate();
            return conversation;
        } catch (error) {
            throw error;
        }
    }

    async getConversations(userId) {
        try {
            const conversations = await this.conversationRepository.getUserConversations(userId);
            return conversations;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageService;