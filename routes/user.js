const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middelware.js");
const userController = require("../controllers/user.js")


router.route("/signup")
    //signup form
    .get(userController.renderSignupForm)
    // register user
    .post(wrapAsync(userController.signup));


router.route("/login")
    //login form
    .get(userController.renderloginForm)
    //verify user
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}), userController.login);

//logout
router.get("/logout",userController.logout);

module.exports = router;