const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    console.log(req.originalUrl);
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
    const {username, email, password} = req.body;
     let newUser = new User({ email,username });
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("signup");
    }
};

module.exports.renderloginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success",`Hey ${req.body.username}, welcome back!`);
    const redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out successfully")
        res.redirect("/listings");
    })
}