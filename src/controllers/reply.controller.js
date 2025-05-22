import ReplyService from "../services/reply.service.js";

const replyService = new ReplyService();

export const getPostReplies = async (req, res) => {
    try {
        const id = req.user.id;
        const postId = req.params.postId;
        const {page, limit} = req.query;
        if(!postId) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }
        const response = await replyService.getPostReplies({postId, currentUserId: id , page: page && parseInt(page), limit: limit && parseInt(limit)});
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully get replies of post",
            err: {}
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}

export const getUserReplies = async (req, res) => {
    try {
        const id = req.user.id;
        const username = req.params.username;
        const {page, limit} = req.query;
        if(!username) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }
        const response = await replyService.getUserReplies({username, currentUserId: id , page: page && parseInt(page), limit: limit && parseInt(limit)});
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully get replies by user",
            err: {}
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}