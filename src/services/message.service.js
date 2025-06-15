import MessageRepository from "../repository/message.repository.js";
import ConversationRepository from "../repository/conversation.repository.js";
import ConversationMembershipRepository from "../repository/conversationMembership.repository.js";

class MessageService {
    constructor() {
        this.messageRepository = new MessageRepository();
        this.conversationRepository = new ConversationRepository();
        this.conversationMembershipRepository = new ConversationMembershipRepository();
    }
    
    async createMessage({content, senderId, receiverId}) {
        try {
            const conversation = await this.getOrCreateConversation({senderId, receiverId});
            const message = await this.messageRepository.create({content, senderId, conversationId: conversation._id});
            await Promise.all([
                this.conversationRepository.update(conversation._id, {lastMessage: message._id}),
                this.conversationMembershipRepository.increaseUnreadCount({userId:senderId, conversationId:conversation._id})
            ]);
            return message;
        } catch (error) {
            throw error;
        }
    }
    
    async getMessages({userId, receiverId}) {
        try {
            const conversation = await this.conversationRepository.getConversation({userId, receiverId});
            
            if(!conversation) {
                return [];
            }
            const [messages, _] = await Promise.all([
                this.messageRepository.getConversationsMessages(conversation._id),
                this.conversationMembershipRepository.updateConversationMembership({userId, conversationId: conversation._id})
            ]);
            return messages;
        } catch (error) {
            throw error;
        }
    }

    async getOrCreateConversation({senderId, receiverId}) {
        try {
            let conversation = await this.conversationRepository.getConversation({userId:senderId, receiverId});
            if (!conversation) {
                conversation = await this.conversationRepository.create({
                    participants: [senderId, receiverId],
                });
            
                if(senderId === receiverId) {
                    await this.conversationMembershipRepository.create({userId:senderId, conversationId:conversation._id});
                } else {
                    await Promise.all([
                        this.conversationMembershipRepository.create({userId:senderId, conversationId:conversation._id}),
                        this.conversationMembershipRepository.create({userId:receiverId, conversationId:conversation._id})
                    ]);
                }
            } 

            // conversation = await conversation.populate('participants', '_id name username avatar').execPopulate();
            return conversation;
        } catch (error) {
            throw error;
        }
    }

    async getConversations(userId) {
        try {
            const conversations = await this.conversationMembershipRepository.getUserMemberships(userId);
            return conversations;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageService;