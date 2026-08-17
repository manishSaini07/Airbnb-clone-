const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req,res)=>{
    const {id} = req.params;
    // const {comment} = req.body;
    const listing = await Listing.findById(id);
    const newReview = await new Review(req.body);
    newReview.author = req.user;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async(req,res)=>{
    const {id,reviewId} = req.params ;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","New review deleted successfully");
    res.redirect(`/listings/${id}`);

}
