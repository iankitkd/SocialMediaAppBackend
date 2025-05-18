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
            return savedPost;
        } catch (error) {
            throw error;
        }
    }

    async deletePost(postId, userId) {
        try {
            const post = await this.postRepository.getPost(postId);
            if(!post) {
                throw new Error("Post does not exist", {status: 404});
            }

            if((post.author._id).toString() !== userId) {
                throw new Error("Unauthorize to delete post", {status: 401});
            }

            await this.postRepository.destroy(postId);
        } catch (error) {
            throw error;
        }
    }
}

export default PostService;