import User from "../models/user.js";
import CrudRepository from "./crud.repository.js";

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        try {
            const response = await User.findOne({email});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async findByUsername(username) {
        try {
            const response = await User.findOne({username});
            return response;
        } catch (error) {
            throw error;
        }
    }

    async selectUserByUsername(username, select="_id") {
        try {
            const user = await User.findOne({ username }).select(select);
            if(!user) return null;
            return user;
        } catch (error) {
            throw error;
        }
    }

    async selectUserByUserId(userId, select="_id") {
        try {
            const user = await User.findById(userId).select(select);
            if(!user) return null;
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default UserRepository;