const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.session.redirectUrl);
        req.flash("error","You must be logged in to perform this action.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    } 
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    const {id} = req.params;
    const data = req.body;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
// listing MW
module.exports.validateListing= (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
     console.log(error);
    if(error){
        return next(new ExpressError(400, error));
        }
    next();
}

// review MW
module.exports.validateReview = (req,res,next)=>{
    const {id }= req.params;
    const {error} = reviewSchema.validate(req.body);
    if(error){
        // req.flash("error",error.details[0].message);
        return next(new ExpressError(400, error));
        }
    next();
}


module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    const data = req.body;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this Review..");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
