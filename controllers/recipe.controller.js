import Recipe from '../models/recipe.model.js';
import Category from '../models/category.model.js'

export const getBySearch = async (req, res, next) => {
  const { search = '', limit = 10, page = 1 } = req.query;

  try {
    const query = {
      recipename: { $regex: search, $options: 'i' },
      $or: [
        { isPrivate: false }, // ציבורי
        { createdBy: req.myuser._id } // או של המשתמש
      ]
    };

    const recipes = await Recipe.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Recipe.countDocuments(query);

    res.json({
      data: recipes,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפת מתכונים', error: err });
  }
};


export const getByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const recipe = await Recipe.findOne({ code });

    if (!recipe) {
      return next({ status: 404, message: 'recipe not found' });
    }

    // בדיקה אם המתכון פרטי
    if (recipe.isPrivate) {
      if (recipe.createdBy !== req.myuser,_id) {
        return next({ status: 403, message: 'Access denied: private recipe' });
      }
    }

    res.status(200).json(recipe);
  } catch (error) {
    next({ message: error.message });
  }
};

export const getByTime=async(req,res,next)=>{
    try {
        const {time} = req.params;
        const recipes = await Recipe.find({time:{$lt:time}})
        if (recipe.isPrivate) {
         if (recipe.createdBy !== req.myuser,_id) {
            return next({ status: 403, message: 'Access denied: private recipe' });
            }
        }
        res.status(200).json({
            message: "Recipes found",
            recipes
        });
    } catch (error) {
        next({
            message: error.message
        });
    }
}

let index=0

export const addRecipe = async (req, res, next) => {
    try {
        const {recipeName,description,categories,time,level,date,layer,preparationInstructions,img,isPrivate,createdBy } = req.body;

        // 1. מוודאים שכל הקטגוריות קיימות – או יוצרות אותן
        const categoryIds = [];

        for (const name of categories) {
            let category = await Category.findOne({ name });

            if (!category) {
                category = new Category({code:index++, name, numRecipe:1, recipes: [] });
                await category.save();
            }

            categoryIds.push(category._id);
        }

        // 2. יוצרים את המתכון עם מזהי הקטגוריות
        const newRecipe = new Recipe({
            recipeName,
            description,
            categoryIds,
            time,
            level,
            date,
            layer,
            preparationInstructions,
            img,
            isPrivate,
            createdBy
        });

        await newRecipe.save();

        // 3. מעדכנים את הקטגוריות – מוסיפים להן את המתכון
        await Category.updateMany(
            { _id: { $in: categoryIds } },
            { $push: { recipes: newRecipe._id } }
        );

        res.status(201).json(newRecipe);
    } catch (error) {
        next({ message: error.message });
    }
};

export const updateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { recipeName,description,categories,time,level,date,layer,preparationInstructions,img,isPrivate,createdBy  } = req.body;

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return next({ status: 404, message: "Recipe not found" });
        }

        // 1. מביא את שמות הקטגוריות הישנות
        const oldCategoryIds = recipe.categories.map(id => id.toString());

        // 2. יוצר קטגוריות חדשות אם צריך ומביא את ה־IDs
        const newCategoryIds = [];
        for (const name of categories) {
            let category = await Category.findOne({ name });

            if (!category) {
                category = new Category({code:index++, name, numRecipe:1, recipes: [] });
                await category.save();
            }

            newCategoryIds.push(category._id.toString());
        }

        // 3. מחשב את הקטגוריות שנוספו ואלו שהוסרו
        const added = newCategoryIds.filter(id => !oldCategoryIds.includes(id));
        const removed = oldCategoryIds.filter(id => !newCategoryIds.includes(id));

        // 4. מעדכן את פרטי המתכון והקטגוריות
        recipe.recipeName = recipeName;
        recipe.description = description;
        recipe.categories = newCategoryIds;
        recipe.time=time;
        recipe.level=level;
        recipe.date=date;
        recipe.layer=layer;
        recipe.preparationInstructions=preparationInstructions;
        recipe,img=img;
        recipe,isPrivate=isPrivate;
        recipe.createdBy=createdBy;
        await recipe.save();

        // 5. מוסיף את המתכון לקטגוריות החדשות
        await Category.updateMany(
            { _id: { $in: added } },
            { $addToSet: { recipes: recipe._id } }
        );

        // 6. מסיר את המתכון מהקטגוריות שהוסרו
        for (const categoryId of removed) {
            await Category.findByIdAndUpdate(
                categoryId,
                { $pull: { recipes: recipe._id } }
            );

            // אם הקטגוריה התרוקנה – מוחקים אותה
            const cat = await Category.findById(categoryId);
            if (cat && cat.recipes.length === 0) {
                await Category.findByIdAndDelete(categoryId);
            }
        }

        res.status(200).json(recipe);
    } catch (error) {
        next({ message: error.message });
    }
};


export const deleteRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. מציאת המתכון כדי לדעת אילו קטגוריות הוא כלל
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return next({ status: 404, message: "Recipe not found" });
        }

        const categoryIds = recipe.categories;

        // 2. מוחקים את המתכון
        await Recipe.findByIdAndDelete(id);

        // 3. מעדכנים כל קטגוריה – מסירים ממנה את המתכון
        for (const categoryId of categoryIds) {
            await Category.findByIdAndUpdate(
                categoryId,
                { $pull: { recipes: recipe._id } }
            );

            // בודקים אם נשארו מתכונים – אם לא, מוחקים את הקטגוריה
            const updatedCategory = await Category.findById(categoryId);
            if (updatedCategory && updatedCategory.recipes.length === 0) {
                await Category.findByIdAndDelete(categoryId);
            }
        }

        res.status(204).end();
    } catch (error) {
        next({ message: error.message });
    }
};
