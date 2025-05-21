import PostRepository from "../repository/post.repository.js";
import UserRepository from "../repository/user.repository.js";
import LikeRepository from "../repository/like.repository.js";

class PostService {
    constructor() {
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
        this.likeRepository = new LikeRepository();
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

            // delete all likes on that post
            await this.likeRepository.destroyManyLikes({post: postId});
        } catch (error) {
            throw error;
        }
    }

    async getPosts({currentUserId, page, limit}) {
        try {
            const response = await this.postRepository.getPosts({ currentUserId, page, limit});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getUserPosts({username, currentUserId, page, limit}) {
        try {
            const user = await this.userRepository.selectUserByUsername(username, "_id username name avatar");
            if(!user) {
                throw new Error("User does not exist");
            }
            const response = await this.postRepository.getPosts({user, currentUserId, page, limit});
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default PostService;