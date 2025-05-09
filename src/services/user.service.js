import UserRepository from "../repository/user.repository.js";

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
}

export default UserService;