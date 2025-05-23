import UserRepository from "../repository/user.repository.js";
import PostRepository from '../repository/post.repository.js';

import { reservedUsernames } from '../utils/data.js'

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.postRepository = new PostRepository();
    }

    async getUserByUsername(username, currentUserId) {
        try {
            const user = await this.userRepository.findByUsername(username);
            if(!user) {
                throw {
                    message: "User does not exist",
                    status: 404,
                }
            }
            const isCurrentUser = (currentUserId && currentUserId === user._id.toString());
            const modifiedUser = {...user.toObject(), isCurrentUser};

            const {posts, pagination} = await this.postRepository.getPosts({user, currentUserId});

            return {user:modifiedUser, posts, pagination};
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, data) {
        try {            
            const user = await this.userRepository.update(userId, data);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async isUsernameAvailable(username) {
        try {
            if(reservedUsernames.includes(username)) {
                return false;
            }
            const user = await this.userRepository.findByUsername(username);
            if(user) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async searchUser(searchString) {
        try {
            const response = await this.userRepository.searchUsers(searchString);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;