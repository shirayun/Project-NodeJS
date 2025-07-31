import { Schema } from "mongoose";

const CategorySchema=new Schema({
    code:{type:Number,required:true},
    description:{type:String,required:true},
    numRecipe:{type:Number,required:true},
    recipes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipes' }]
})
   

export default model('Category',CategorySchema)
