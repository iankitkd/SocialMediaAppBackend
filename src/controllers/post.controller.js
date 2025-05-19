import PostService from "../services/post.service.js";

const postService = new PostService();

export const createPost = async (req, res) => {
    try {
        const {id} = req.user;
        const {content} = req.body;
        if(!id || !content) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await postService.createPost(content, id);
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
        const {page, limit} = req.query;
        const response = await postService.getPosts({page:parseInt(page), limit:parseInt(limit)});
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
        const response = await postService.getUserPosts({username, page: parseInt(page), limit: parseInt(limit)});
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

