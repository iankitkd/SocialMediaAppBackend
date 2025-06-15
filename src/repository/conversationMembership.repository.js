import ConversationMembership from "../models/conversationMembership.js";
import CrudRepository from "./crud.repository.js";

class ConversationMembershipRepository extends CrudRepository {
    constructor() {
        super(ConversationMembership);
    }

    async increaseUnreadCount({userId, conversationId}) {
        try {
            await ConversationMembership.updateMany(
                {
                    conversationId: conversationId,
                    userId: { $ne: userId }
                },
                { $inc: { unreadCount: 1 } }
            );
        } catch (error) {
            throw error;
        }
    }

    async updateConversationMembership({userId, conversationId}) {
        try {
            // reset unread count and update last read
            await ConversationMembership.updateOne(
                { userId, conversationId },
                {
                    $set: {
                        lastReadAt: new Date(),
                        unreadCount: 0
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async getUserMemberships(userId) {
        try {
            let memberships = await ConversationMembership.find({ userId })
                .populate({
                    path: 'conversationId',
                    populate: [
                        {
                            path: 'participants',
                            select: '_id name username avatar'
                        },
                        {
                            path: 'lastMessage'
                        }
                    ]
                });
                // .sort({ updatedAt: -1 });

            memberships = memberships.sort(
                (a, b) => new Date(b.conversationId.updatedAt) - new Date(a.conversationId.updatedAt)
            );                
            return memberships;
        } catch (error) {
            throw error;
        }
    }
}

export default ConversationMembershipRepository;