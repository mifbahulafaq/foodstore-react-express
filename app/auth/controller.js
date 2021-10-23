const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../user/model");
const config = require('../config');
const {getToken} = require('../utils/get-token');

async function register(req,res,next){

    try{
        let payload = req.body;

        let user = new User(payload);
        await user.save();
        return res.json(user);

    }catch(err){
        console.log(err)
        if(err && err.name == "ValidationError"){
            return res.json({
                error : 1,
                message : err.message,
                fields : err.errors
            })
        }
        next(err)
    }
}

async function localStrategy(email,password,done){

    try{

        let user = await User.findOne({email})
        .select('-__v -createdAt -updateAt -cart_items -token');
        if(!user) return done();

        if(bcrypt.compareSync(password, user.password)){
            ({password,...userWithoutPassword}=user.toJSON());
            return done(null, userWithoutPassword);
        }

    }catch(err){
        
        done(err,null)
    }
    done();
}

async function login(req,res,next){
    
    passport.authenticate('local',async function(err,user){

        if(err) return next(err);

        if(!user) return res.json({
            error : 1,
            message : 'Email or Password incorrect',
        })
        let signed = jwt.sign(user, config.secretKey);

        await User.findOneAndUpdate({_id : user._id}, {$push:{token : signed}}, {new : true});

        return res.json({
            message: 'logged in successfully',
            user : user,
            token : signed
        })

    })(req,res,next)
}

function me(req,res,next){
    if(!req.user){
        return res.json({
            error : 1,
            message : "you are not login or token expired"
        })
    }
    return res.json(req.user);
}

async function logout(req,res,next){
    let token = getToken(req);

    let user = await User.findOneAndUpdate({token : {$in:[token]}},{$pull:{token}},{useFindAndModify:false});

    if(!user || !token){
        return res.json({
            error : 1,
            message : 'User tidak ditemukan'
        })
    }
    return res.json({
        error : 0,
        message : 'logout berhasil'
        
    })
}
module.exports = {
    register,
    localStrategy,
    login,
    me,
    logout
}