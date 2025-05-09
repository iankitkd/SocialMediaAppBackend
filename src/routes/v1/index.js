import { Router } from 'express';

import { signin, signout, signup } from "../../controllers/auth.controller.js"
import { validateUserAuth } from '../../middlewares/authRequestValidate.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = Router();

router.post('/signup', validateUserAuth, signup);
router.post('/signin', validateUserAuth, signin);
router.post('/signout', authenticate, signout);

export default router;