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

    async getPosts({match, user, currentUserId, page=1, limit=10, populateParent=false}) {
        try {
            const currentUserIdObj = Types.ObjectId.isValid(currentUserId) ? Types.ObjectId.createFromHexString(currentUserId) : null;

            const aggregationPipeline = [];

            // add match condition
            if(match) {
                aggregationPipeline.push({ $match: match});
            } else {
                aggregationPipeline.push({ $match: {parent: null}});
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

            // populate parent with author, updated isLiked and isOwner
            if (populateParent) {
                aggregationPipeline.push(
                    // Lookup parent post
                    {
                        $lookup: {
                            from: 'posts',
                            localField: 'parent',
                            foreignField: '_id',
                            as: 'parent'
                        }
                    },
                    { $unwind: '$parent' },

                    // Lookup parent author and embed inside parent.author
                    {
                        $lookup: {
                            from: 'users',
                            let: { authorId: '$parent.author' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
                                { $project: {_id: 1, name: 1, username: 1, avatar: 1}},
                                { $limit: 1 }
                            ],
                            as: 'parentAuthor'
                        }
                    },
                    { $unwind: { path: '$parentAuthor', preserveNullAndEmptyArrays: true } },

                    // Set parent.author to parentAuthor
                    { $set: { 'parent.author': '$parentAuthor' } }
                );

                if (currentUserIdObj) {
                  aggregationPipeline.push(
                    // Lookup likes for parent post
                    {
                        $lookup: {
                            from: 'likes',
                            let: { postId: '$parent._id' },
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
                                { $limit: 1 }
                            ],
                            as: 'parentLikedByCurrentUser'
                        }
                    },
                    // Set isLiked and isOwner inside parent
                    {
                        $set: {
                            'parent.isLiked': { $gt: [{ $size: '$parentLikedByCurrentUser' }, 0] },
                            'parent.isOwner': { $eq: ['$parent.author._id', currentUserIdObj] }
                        }
                    }
                  );
                }
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
                        commentsCount: 1,
                        parent: 1,
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

            const data = match ? match : {parent: null};

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


    async destroyManyPosts(data) {
        try {
            const response = await Post.deleteMany(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default PostRepository;