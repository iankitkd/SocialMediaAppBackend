import PostRepository from "../repository/post.repository.js";
import UserRepository from "../repository/user.repository.js";

class PostService {
    constructor() {
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
    }

    async createPost(content, userId) {
        try {
            const data = {content, author: userId};
            const savedPost = await this.postRepository.create(data);

            await this.userRepository.update(userId, { $push: { posts: savedPost._id }});
            return savedPost;
        } catch (error) {
            throw error;
        }
    }
}

export default PostService;