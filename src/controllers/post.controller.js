import PostService from "../services/post.service.js";

const postService = new PostService();

export const createPost = async (req, res) => {
    try {
        const {id} = req.user;
        const {content, parentPostId} = req.body;
        if(!id || !content) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await postService.createPost(content, id, parentPostId);
         return res.status(201).json({
            success: true,
            data: response,
            message: "Successfully created post",
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

export const deletePost = async (req, res) => {
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

        const response = await postService.deletePost(postId, id);
         return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully deleted post",
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

export const getPosts = async (req, res) => {
    try {
        const id = req.user.id;
        const {page, limit} = req.query;
        const response = await postService.getPosts({currentUserId: id, page: page && parseInt(page), limit: limit && parseInt(limit)});
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully get latest posts",
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

export const getUserPosts = async (req, res) => {
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
        const response = await postService.getUserPosts({username, currentUserId: id , page: page && parseInt(page), limit: limit && parseInt(limit)});
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully get posts of user",
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

export const getPostDetails = async (req, res) => {
   try {
        const id = req.user.id;
        const {postId} = req.params;
        if(!postId) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }
        
        const response = await postService.getPostDetails({postId, currentUserId: id});
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully get post details",
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