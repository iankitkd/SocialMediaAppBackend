import { Types } from "mongoose";
import PostRepository from "../repository/post.repository.js";
import UserRepository from "../repository/user.repository.js";

class ReplyService {
    constructor() {
        this.userRepository = new UserRepository();
        this.postRepository = new PostRepository();
    }

    async getPostReplies({postId, currentUserId, page, limit}) {
        try {
            const postIdObj = Types.ObjectId.isValid(postId) ? Types.ObjectId.createFromHexString(postId) : null;
            const match = {parent: postIdObj};
            const response = await this.postRepository.getPosts({ match, currentUserId, page, limit});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getUserReplies({username, currentUserId, page, limit}) {
        try {
            const user = await this.userRepository.selectUserByUsername(username, "_id username name avatar");
            if(!user) {
                throw new Error("User does not exist");
            }
            const match = {author: user._id, parent: { $ne: null } };
            const response = await this.postRepository.getPosts({match, user, currentUserId, page, limit});
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default ReplyService;