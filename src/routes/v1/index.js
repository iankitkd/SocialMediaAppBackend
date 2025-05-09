import { Router } from 'express';

import { signup } from "../../controllers/auth.controller.js"
import { validateUserAuth } from '../../middlewares/authRequestValidate.js';

const router = Router();

router.post('/signup', validateUserAuth, signup);

export default router;