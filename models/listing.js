const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");
const listingSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    price:{
        type: Number,
        required: true
    },
    image:{
        url : String,
        filename : String
    },
    location: String,
    country: String,
    reviews :[ 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }
],
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    coordinates: {
        lat: {
            type: Number,
            default: 28.6139 // Default Delhi ka Latitude agar data na ho
        },
        lng: {
            type: Number,
            default: 77.2090 // Default Delhi ka Longitude agar data na ho
        }
    },
    category: {
        type: String,
        required: true,
        enum: ["Trending", "Rooms", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Villas"],
        default : "Trending"
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews }});
    }

})

// 🎯 Yeh line pure database me in 4 fields ko search karne ke liye enable karegi
listingSchema.index({ 
    title: "text", 
    description: "text", 
    location: "text", 
    country: "text" 
});


const listing = mongoose.model("listing",listingSchema);
module.exports = listing;