import AuthService from "../services/auth.service.js";
import UserService from "../services/user.service.js";

const authService = new AuthService();
const userService = new UserService();

export const signup = async (req, res) => {
    try {
        const response = await authService.signup({
            name: req.body.name,
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
            message: error.message || "Something went wrong",
            err: error
        })
    }
}

export const signin = async (req, res) => {
    try {
        const response = await authService.signin({
            email: req.body.email,
            password: req.body.password,
        });

        res.cookie('token', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 90 * 24 * 60 * 60 * 1000
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
            message: error.message || "Something went wrong",
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
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        });
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = req.user;  // user added through middleware
        const response = await userService.getUserById(user.id);
        return res.status(200).json({
            success: true,
            data: response,
            message: "Successfully fetched current user",
            err: {}
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            err: error,
            data: {},
        }); 
    }
}