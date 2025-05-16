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
        console.log(error, "c");
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}