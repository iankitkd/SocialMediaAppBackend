import Post from "../models/post.js";
import CrudRepository from "./crud.repository.js";

class PostRepository extends CrudRepository {
    constructor() {
        super(Post);
    }
}

export default PostRepository;