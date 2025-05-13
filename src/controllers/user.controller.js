import UserService from "../services/user.service.js";

const userService = new UserService();

export const updateUser = async (req, res) => {
    try {
        const {id} = req.user;
        const data = req.body;
        if(!id || !data) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }

        const response = await userService.updateUser(id, data);
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully updated user",
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

export const isUsernameAvailable = async (req, res) => {
    try {
        const {username} = req.body;
        if(!username) {
            return res.status(400).json({
                success: false,
                message: "Required details missing",
                err: "Bad request",
                data: {},
            });
        }
        const response = await userService.isUsernameAvailable(username);
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully checked username status",
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