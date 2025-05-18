import Post from "../models/post.js";
import CrudRepository from "./crud.repository.js";

class PostRepository extends CrudRepository {
    constructor() {
        super(Post);
    }

    async getPosts({ user, page = 1, limit = 10 }) {
        try {
            const [posts, total] = await Promise.all([
                Post.find({ author: user._id })
                    .select('content createdAt')
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),

                Post.countDocuments({ author: user._id })
            ]);

            const postsWithAuthor = posts.map(post => ({
                ...post,
                author: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    name: user.name
                }
            }));

            return {
                posts: postsWithAuthor,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: (page * limit) < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw error;
        }
    }


    async getPost(postId) {
        try {
            const post = await Post.findById(postId).populate({
                path: 'author',
                select: 'username avatar name'
            });
            return post;
        } catch (error) {
            throw error;
        }
    }
}

export default PostRepository;