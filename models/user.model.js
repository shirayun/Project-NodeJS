import { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import Joi from "Joi"
import bcrypt from "bcryptjs";

const userSchema=new Schema({
    userName:{type:String,required:true},
    passWord:{type:String,required:true},
    email:{type: String, unique: true, required: true},
    address:{type:String,required:true},
    role:{type:String,enum:["admin","registerUser,guistUser"],default:"guistUser"}

})

export const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const token = jwt.sign({ _id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
    return token;
};

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

export const joiUserSchema={
    signp:Joi.object({
        username: Joi.string().required(),
        password: Joi.string()
                .min(8)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
                .required(),
        email: Joi.string().email().lowercase().required(),   
        address:Joi.string().required()}),
    signin:Joi.object({
        email:Joi.string().lowercase().required(),
        passWord:Joi.string().required()
    })
}
export default model('Users',userSchema)