import Like from "../models/like.js";
import CrudRepository from "./crud.repository.js";

import { Types } from "mongoose";

class LikeRepository extends CrudRepository {
    constructor() {
        super(Like);
    }

    async getLikedPostsByUserId({userId, page=1, limit=10}) {
        try {
            const userIdObj = Types.ObjectId.createFromHexString(userId);

            const [response, total] = await Promise.all([
                Like.find({ user: userIdObj })
                    .populate({
                        path: 'post',
                        populate: {
                            path: 'author',
                            select: '_id name username avatar'
                        }
                    })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                Like.countDocuments({ user: userIdObj })
            ]);

            const likedPosts = response.map(res => res.post);

            return {
                likedPosts,
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

    async destroyManyLikes(data) {
        try {
            const response = await Like.deleteMany(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default LikeRepository;