import {Router} from 'express';
import { getBySearch,getByCode,getByTime,addRecipe,updateRecipe,deleteRecipe } from '../controllers/recipe.controller.js';
import { auth,authAdmin } from '../middlewares/auth.middleware.js';
const router=Router()
router.get('/',auth,getBySearch)
router.get('/code/:code',auth,getByCode)
router.get('/time/:time',auth,getByTime)
router.post('/',addRecipe)
router.put('/:id',updateRecipe)
router.delete('/:id',auth,authAdmin,deleteRecipe)

export default router;