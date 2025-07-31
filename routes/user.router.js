import {Router} from 'express';
import { signin,signup,getAllUsers,deleteUser } from '../controllers/user.controller.js';
import { auth, authAdmin } from '../middlewares/auth.middleware.js';

const router=Router()

router.get('/',auth,authAdmin,getAllUsers)
router.post('/',signup)
router.post('/signin',signin)
router.delete('/:id',deleteUser)

export default router;