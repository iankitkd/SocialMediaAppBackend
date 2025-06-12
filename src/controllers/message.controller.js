import MessageService from "../services/message.service.js";

const messageService = new MessageService();

export const getMessages = async(req, res) => {
    try {
        const user = req.user;
        const {receiverId} = req.params;
        if(!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await messageService.getMessages({userId: user.id, receiverId});
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully fetched messages",
            err: {},
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

export const getConversations = async(req, res) => {
    try {
        const user = req.user;
        const response = await messageService.getConversations(user.id);
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully fetched conversations",
            err: {},
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