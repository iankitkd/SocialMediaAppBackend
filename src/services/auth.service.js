import jwt from 'jsonwebtoken';

import UserRepository from "../repository/user.repository.js";

import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/serverConfig.js"

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signup(data) {
        try {
            const user = await this.userRepository.findByEmail(data.email);
            if(user) {
                throw {
                    message: "User already exist"
                }
            }

            const newUser = await this.userRepository.create(data);
            
            const token = jwt.sign(
                {
                    id: newUser._id, 
                    email: newUser.email
                }, 
                JWT_SECRET, 
                {expiresIn: JWT_EXPIRES_IN}
            );

            return {user: newUser, token};
        } catch (error) {
            throw error;
        }
    }

    async signin(data) {
        try {
            const user = await this.userRepository.findByEmail(data.email);
            if(!user) {
                throw {
                    message: "Incorrect Credentials"
                };
            }
            const checkPassword = await user.comparePassword(data.password);
            if(!checkPassword) {
                throw {
                    message: "Incorrect Credentials"
                };
            }

            const token = jwt.sign(
                {
                    id: user._id, 
                    email: user.email
                }, 
                JWT_SECRET, 
                {expiresIn: JWT_EXPIRES_IN}
            );

            return {user, token};
        } catch (error) {
            throw error;
        }
    }


    async getCurrentUser(userId) {
        try {
            const user = await this.userRepository.get(userId);
            if(!user) {
                throw {
                    message: "User does not exist"
                }
            }
            return { ...user.toObject(), isCurrentUser: true};
        } catch (error) {
            throw error;
        }
    }
}

export default AuthService;