import Post from "../models/post.js";
import CrudRepository from "./crud.repository.js";

import { Types } from "mongoose";

class PostRepository extends CrudRepository {
    constructor() {
        super(Post);
    }

    async getPost(postId) {
        try {
            const isValid = Types.ObjectId.isValid(postId);
            if(!isValid) {
                throw { message: "Post id is not valid", status: 400};
            }
            const post = await Post.findById(postId).populate({
                path: 'author',
                select: '_id username avatar name'
            });
            return post;
        } catch (error) {
            throw error;
        }
    }

    async getPosts({user, currentUserId, page=1, limit=10}) {
        try {
            const currentUserIdObj = Types.ObjectId.isValid(currentUserId) ? Types.ObjectId.createFromHexString(currentUserId) : null;

            const aggregationPipeline = [];

            // if fetching user posts, add match condition
            if(user) {
                aggregationPipeline.push({ $match: {author: user._id}});
            }

            // sorting and pagination
            aggregationPipeline.push(
                { $sort: { createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );

            // if fetching user posts, add author field with user details
            // if not, lookup to user collection
            if(user) {
                aggregationPipeline.push(
                    {
                        $addFields: {
                            author: {
                                _id: user._id,
                                username: user.username,
                                avatar: user.avatar,
                                name: user.name
                            }
                        }
                    },
                );
            } else {
                aggregationPipeline.push(
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author'
                        }
                    },
                    { 
                        $unwind: '$author' 
                    }
                );
            }

            // if currentuser present, add isLiked and isOwner field
            if(currentUserIdObj) {
                aggregationPipeline.push(
                    {
                        $lookup: {
                            from: 'likes',
                            let: { postId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$post', '$$postId'] },
                                                { $eq: ['$user', currentUserIdObj] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $limit: 1
                                }
                            ],
                            as: 'likedByCurrentUser'
                        }
                    },
                    {
                        $addFields: {
                            isLiked: { $gt: [{ $size: '$likedByCurrentUser' }, 0] },
                            isOwner: { $eq: ['$author._id', currentUserIdObj]} 
                        }
                    }
                );
            }

            // Project 
            aggregationPipeline.push(
                {
                    $project: {
                        content: 1,
                        createdAt: 1,
                        likesCount: 1,
                        isLiked: 1,
                        isOwner: 1,
                        // author: 1,
                        'author._id': 1,
                        'author.username': 1,
                        'author.name': 1,
                        'author.avatar': 1,
                    }
                }
            );

            const data = user ? { author: user._id } : null;

            const [posts, total] = await Promise.all([
                Post.aggregate(aggregationPipeline),
                Post.countDocuments(data)
            ]);

            return {
                posts: posts,
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
}

export default PostRepository;