import LikeRepository from "../repository/like.repository.js";
import PostRepository from "../repository/post.repository.js";
import UserRepository from "../repository/user.repository.js";

class LikeService {
    constructor() {
        this.likeRepository = new LikeRepository();
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
    }

    async likePost (postId, userId) {
        try {
            const data = {post: postId, user: userId};
            const alreadyLike = await this.likeRepository.getOne(data);
            if(alreadyLike) {
                throw new Error("Post is already like by user");
            }

            const [like, post] = await Promise.all([
                this.likeRepository.create(data),
                this.postRepository.update(postId, { $inc: { likesCount: 1 } })
            ])
            return like;
        } catch (error) {
            throw error;
        }
    }

    async unlikePost (postId, userId) {
        try {
            const data = {post: postId, user: userId};
            const response = await this.likeRepository.destroyOne(data);
            if(!response) {
                throw new Error("Like does not exist");
            }
            await this.postRepository.update(postId, { $inc: { likesCount: -1 } });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUserLikedPosts({currentUserId, page, limit}) {
        try {
            const user = await this.userRepository.selectUserByUserId(currentUserId, "_id username name avatar");
            if(!user) {
                throw new Error("User does not exist");
            }
            const {likedPosts, pagination} = await this.likeRepository.getLikedPostsByUserId({userId: currentUserId, page, limit});
            
            if(likedPosts.length == 0) {
                return {likedPosts: [], pagination};
            }

            const updatedPosts = likedPosts.map(post => ({
                ...post,
                isLiked: true,
                isOwner: post.author._id.toString() === currentUserId,
            }));

            return {likedPosts: updatedPosts, pagination};
        } catch (error) {
            throw error;
        }
    }
}

export default LikeService;