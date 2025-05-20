import LikeService from "../services/like.service.js";

const likeService = new LikeService();

export const likePost = async (req, res) => {
    try {
        const {id} = req.user;
        const postId = req.params.postId;
        if(!id || !postId) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await likeService.likePost(postId, id);
         return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully like post",
            err: {}
        }); 
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}

export const unlikePost = async (req, res) => {
    try {
        const {id} = req.user;
        const postId = req.params.postId;
        if(!id || !postId) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await likeService.unlikePost(postId, id);
         return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully unlike post",
            err: {}
        }); 
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const id = req.user.id;
        const {page, limit} = req.query;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await likeService.getCurrentUserLikedPosts({currentUserId: id, page: page && parseInt(page), limit: limit && parseInt(limit)});
         return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully fetched liked posts",
            err: {}
        }); 
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}