import jwt from 'jsonwebtoken';

import UserRepository from "../repository/user.repository.js";

import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/serverConfig.js"

class UserService {
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
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async signin(data) {
        try {
            const user = await this.userRepository.findByEmail(data.email);
            if(!user) {
                throw {
                    message: "No user found"
                };
            }

            if(!user.comparePassword(data.password)) {
                throw {
                    message: "Incorrect Password"
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
}

export default UserService;