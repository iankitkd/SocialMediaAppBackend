import PostRepository from "../repository/post.repository.js";
import UserRepository from "../repository/user.repository.js";
import LikeRepository from "../repository/like.repository.js";

class PostService {
    constructor() {
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
        this.likeRepository = new LikeRepository();
    }

    async createPost(content, userId, parentPostId) {
        try {
            const parent = parentPostId ? parentPostId: null;
            const data = {content, author: userId, parent};
            const savedPost = await this.postRepository.create(data);

            if(parent) {
                this.postRepository.update(parentPostId, { $inc: { commentsCount: 1 } })
            }
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

            if(post.parent) {
                await this.postRepository.update(post.parent, { $inc: { commentsCount: -1 } })
            }
            
            // delete post and all likes & replies on that post
            await Promise.all([
                this.postRepository.destroy(postId),
                this.postRepository.destroyManyPosts({parent: postId}),
                this.likeRepository.destroyManyLikes({post: postId}),
            ]);
        } catch (error) {
            throw error;
        }
    }

    async getPosts({currentUserId, page, limit}) {
        try {
            const match = {parent: null};
            const response = await this.postRepository.getPosts({match, currentUserId, page, limit});
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
            const match = {author: user._id, parent: null};
            const response = await this.postRepository.getPosts({match, user, currentUserId, page, limit});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getPostDetails({postId, currentUserId}) {
        try {
            const post = await this.postRepository.getPost(postId);
            if(!post) {
                throw { message: "Post does not exist", status: 404};
            }
            const like = await this.likeRepository.getOne({user:currentUserId, post: postId});
            const isLiked = !!like;
            
            const isOwner = post.author._id.toString() === currentUserId;
            return {...post.toObject(), isOwner, isLiked};
        } catch (error) {
            throw error;
        }
    }
}

export default PostService;