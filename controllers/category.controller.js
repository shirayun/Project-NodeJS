import Category from '../models/category.model.js';

export const getAllCategories=async(req,res,next)=>{
    try {
        const categories = await Category.find();
        res.status(200).json({
            message: "Categories retrieved successfully",
            categories
        });
    } catch (error) {
        next({
            message: error.message
        });
    }
}

export const getAllCategoriesWithRecipes = async (req, res) => {
  try {
    const categories = await Category.find().populate('recipes'); 
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories with recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryWithRecipes = async (req, res) => {
  try {
    const {id}=req.params;
    const category = await Category.findOne({id}).populate('recipes'); 
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories with recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
