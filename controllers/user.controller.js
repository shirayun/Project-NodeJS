import Users, { generateToken } from "../models/user.model.js";

export const signin=async(req,res,next)=>{
    try {
        const {email,passWord}=req.body;
        const user=await Users.findOne({email})
        if(!user){
            return next({
                status:401,
                message:"User not found"
            })
        }
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth) {
            return next({ message: 'user not found', status: 401 }); // Unauthorized - לא מאומת
        }
        const token = generateToken(user);
        res.status(200).json({ username: user.username, token });
    } catch (error) {
        next({message:error.message})
    }
}

export const signup=async(req,res,next)=>{
    try {
        const {userName,passWord,email,address,role}=req.body;
        const user=new Users({
            userName,
            passWord,
            email,
            address,
            role
        });
        await user.save();
        const token=generateToken(user)
        res.status(201).json({ username: user.username, token });
    } catch (error) {
        next({
            message: error.message
        });
    }
}

export const getAllUsers=async(req,res,next)=>{
    try {
        const users=await Users.find();
        res.json(users)
    } catch (error) {
        next({
            message: error.message
        });
    }
}

export const deleteUser=async(req,res,next)=>{
    try {
        const {id}=req.params;
        await Users.findByIdAndDelete(id);
        res.status(204).end()
    } catch (error) {
        next({
            message: error.message
        });
    }
}