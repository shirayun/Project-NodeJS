import { model, Schema } from "mongoose";

const RecipeSchema=new Schema({
    recipeName:{type:String,required:true},
    description:{type:String,required:true},
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
    time:{type:Number,required:true},
    level:{type:String,required:true},
    date:{type:Date,default:Date.now},
    layer:[{
        desc:String,
        ingredients:[String]
    }],
    preparationInstructions:{type:[String], required:true},
    img:{type:String,required:true},
    isPrivate:{type:Boolean,default:false},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true } 
})
export default model('Recipes',RecipeSchema);