import { Router } from 'express';

import { currentUser, signin, signout, signup } from "../../controllers/auth.controller.js"

import { validateUserAuth } from '../../middlewares/authRequestValidate.js';
import { authenticate, optionalAuth } from '../../middlewares/authenticate.js';

import { getUserByUsername, isUsernameAvailable, updateUser } from '../../controllers/user.controller.js';
import { createPost, deletePost, getPosts, getUserPosts } from '../../controllers/post.controller.js';


const router = Router();

// Public routes
router.post('/signup', validateUserAuth, signup);
router.post('/signin', validateUserAuth, signin);

router.get('/users/:username', optionalAuth, getUserByUsername);

router.get('/users/:username/posts', getUserPosts);
router.get('/posts', getPosts);


// Private routes
router.use(authenticate);

router.post('/signout', signout);
router.post('/validate-username', isUsernameAvailable);
router.get('/profile', currentUser);
router.patch('/profile', updateUser);

router.post('/posts', createPost);
router.delete('/posts/:postId', deletePost);

export default router;