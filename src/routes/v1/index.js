import { Router } from 'express';

import { currentUser, signin, signout, signup } from "../../controllers/auth.controller.js"

import { validateUserAuth } from '../../middlewares/authRequestValidate.js';
import { authenticate } from '../../middlewares/authenticate.js';

import { getUserByUsername, isUsernameAvailable, updateUser } from '../../controllers/user.controller.js';


const router = Router();

router.post('/signup', validateUserAuth, signup);
router.post('/signin', validateUserAuth, signin);

router.get('/user/:username', getUserByUsername);


router.use(authenticate);

router.post('/signout', signout);
router.post('/validate-username', isUsernameAvailable);
router.get('/profile', currentUser);
router.post('/profile/update', updateUser);

export default router;