import UserService from "../services/user.service.js";

const userService = new UserService();

export const signup = async (req, res) => {
    try {
        const response = await userService.signup({
            email: req.body.email,
            password: req.body.password,
        });
        return res.status(201).json({
            success: true,
            data: response,
            message: "Successfully created a user",
            err: {}
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            message: "Something went wrong",
            err: error
        })
    }
}

export const signin = async (req, res) => {
    try {
        const response = await userService.signin(req.body);

        res.cookie('token', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });
        return res.status(200).json({
            success: true,
            message: "Successfully signed in",
            data: response,
            err: {}
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            err: error
        });
    }
}

export const signout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        return res.status(200).json({ 
            success: true,
            message: "Successfully signed out",
            data: {},
            err: {},
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            err: error,
            data: {},
        });
    }
}