import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';


export const register = async(req, res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false, message:'Missing details'})
    }

    try{
        const existingUser= await userModel.findOne({email})

        if(existingUser){
            return res.json({ success:false,message: 'user already exists'});
        }

        const hashedPassword =await bcrypt.hash(password, 10);

        const user = new userModel({name,email,password:hashedPassword});
        await user.save();

        const token=jwt.sign({id:user._id} , process.env.JWT_SECRET,{expiresIn:'7d'} );

        res.cookie('token', token ,{
            httpOnly : true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailTemp={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject: 'welcome to my AUTH',
            text: `welcome to my AUTH website. your account has been created with email id : ${email} `
        }
        await transporter.sendMail(mailTemp);

        return res.json({success:true});

    }catch(error){
        res.json({success: false, message: error.message})
    }
}



export const login= async (req, res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.json({success:false,message:'Email  and password are required'});
    }
    try{
            const user=  await userModel.findOne({email});

            if(!user){
                return res.json({succes: false, message:'Invalid email'})
            }
            const isMatch= await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.json({succes: false, message:'Invalid password'})
            }


            const token=jwt.sign({id:user._id} , process.env.JWT_SECRET,{expiresIn:'7d'} );

        res.cookie('token', token ,{
            httpOnly : true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true});

    }catch(error){

        return res.json({success:false,message:error.message});
    }
}



export const logout = async (req,res)=>{
    try{

        res.clearCookie('token', {
            httpOnly : true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict'
        })

        return res.json({success:true,message: 'Logged Out'})

    }catch(error){
        res.json({success: false, message: error.message});
    }
}


export const sendVerifyOtp =async(req,res)=>{
    try{
        const userId = req.user.id;


        const user= await userModel.findById(userId);

        if(user.accVerified){
            return res.json({success:false, message: "your account is already verified"})
        }

        const newOtp = String(Math.floor(100000 + Math.random() * 900000));

        user.otp = newOtp;
        user.otpExpire = Date.now() + 24*60*60*1000

        await user.save();

        const mailTemp ={
             from:process.env.SENDER_EMAIL,
            to:user.email,
            subject: 'Account verification OTP',
            text: `your OTP is ${newOtp}. Verify your account using this OTP `
        }

        await transporter.sendMail(mailTemp);

        res.json({succes:true,message:'Verification OTP sent on Email'})

    }catch (error){
        res.json({succes:false,message: error.message});

    }
}



export const verifyEmail =async(req,res)=>{
   const {newOtp}=req.body;

   const userId = req.user.id;

   if (!userId || !newOtp){
        return res.json({success:false, message: "Missing Details"})
   }
   try{
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found"});
        }

        if(user.otp ===''|| user.otp !== newOtp){
            return res.json({success:false,message:"Invalid OTP"});
        }

        if(user.otpExpire < Date.now()){
            return res.json({success:false,message:"OTP Expires"});
        }

        user.accVerified=true;
        user.otp="";
        user.otpExpire=0;

        await user.save()

        return res.json({success:true,message:'Email Verification successfully completed'})

   }catch (error){
       return res.json({succes:false,message: error.message});
   }
}


export const isAuth = async (req,res)=>{
    try{
        return res.json({success:true});
    }catch (error){
        res.json({succes:false,message: error.message});
    }
}


export const sendResetOtp =async (req,res)=>{
    const {email}= req.body;

    if(!email){
        return res.json({success:false,message:'Email is Required'});
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'User not found'});
        }

        const newOtp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = newOtp;
        user.resetOtpExpire = Date.now() + 15*60*1000

        await user.save();

        const mailTemp ={
             from:process.env.SENDER_EMAIL,
            to:user.email,
            subject: 'Password Reset OTP',
            text: `your OTP for resetting your password is ${newOtp}. Use this OTP to proceed with resetting your password.`
        };

        await transporter.sendMail(mailTemp);

        return res.json({success:true,message:'OTP sent to your email'});

    }catch{
        return res.json({succes:false,message: error.message});
    }
}


export const resetPass=async (req,res)=>{
    const {email,otp,newPassword} = req.body;

    if(!email||!otp || !newPassword){
        return res.json({success:false,message:'email,otp, and new pasword are required'});

    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
         return res.json({succes:false,message:'User not found'});   
        }
        if(user.resetOtp === ""|| user.resetOtp !== otp){
            return res.json({success:false,message:'Invalid OTP'});
        }

        if(user.resetOtpExpire < Date.now()){
            return res.json({success:false,message:'OTP Expired'});
        }

        const hashedPassword= await bcrypt.hash(newPassword,10);

        user.password= hashedPassword;
        user.resetOtp='';
        user.resetOtpExpire= 0;

        await user.save();
        return res.json({success:true,message:'password has been reset successfully'});
    }
    catch(error){
        return res.json({succes:false,message: error.message});
    }
}