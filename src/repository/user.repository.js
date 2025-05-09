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
}

export default UserRepository;