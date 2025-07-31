
import {Router} from express
import { getAllCategories,getAllCategoriesWithRecipes,getCategoryWithRecipes } from "../controllers/category.controller.js"

const router= Router();
router.get('/',getAllCategories)
router.get('/withRecipes',getAllCategoriesWithRecipes)
router.get('/withRecipes/:id',getCategoryWithRecipes)

export default router