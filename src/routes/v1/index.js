import { Router } from 'express';

import { currentUser, signin, signout, signup } from "../../controllers/auth.controller.js"

import { validateUserAuth } from '../../middlewares/authRequestValidate.js';
import { authenticate, optionalAuth } from '../../middlewares/authenticate.js';

import { getUserByUsername, isUsernameAvailable, searchUser, updateUser } from '../../controllers/user.controller.js';
import { createPost, deletePost, getPostDetails, getPosts, getUserPosts } from '../../controllers/post.controller.js';
import { getLikedPosts, likePost, unlikePost } from '../../controllers/like.controller.js';
import { getPostReplies, getUserReplies } from '../../controllers/reply.controller.js';


const router = Router();

// Public routes
router.post('/signup', validateUserAuth, signup);
router.post('/signin', validateUserAuth, signin);

router.get('/users/search', searchUser);
router.get('/users/:username', optionalAuth, getUserByUsername);

router.get('/users/:username/posts', optionalAuth, getUserPosts);
router.get('/users/:username/replies', optionalAuth, getUserReplies);

router.get('/posts', optionalAuth, getPosts);
router.get('/posts/:postId', optionalAuth, getPostDetails);
router.get('/posts/:postId/replies', optionalAuth, getPostReplies);


// Private routes
router.use(authenticate);

router.post('/signout', signout);
router.post('/validate-username', isUsernameAvailable);
router.get('/profile', currentUser);
router.patch('/profile', updateUser);

// these two are use for both post and reply
router.post('/posts', createPost);
router.delete('/posts/:postId', deletePost);

router.post('/posts/:postId/like', likePost);
router.delete('/posts/:postId/like', unlikePost);

router.get('/profile/liked-posts', getLikedPosts);

export default router;