const Listing = require("../models/listing.js");
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(options);


module.exports.index = async (req,res)=>{
    
    // const allListings = await Listing.find();
    // res.render("listings/index.ejs",{allListings})
        const { search, category} = req.query;
        let allListings;

         if (category) {
            allListings = await Listing.find({ category: category });
        }
        else if (search && search.trim() !== "") {
            allListings = await Listing.find({
                $text: { $search: search } // MongoDB Text Search Query
            });
            
            // Agar koi result na mile
            if (allListings.length === 0) {
                req.flash("error", "No listings found matching your search!");
                return res.redirect("/listings");
            }
        } else {
            // 2. Agar search khali hai, toh normal saare listings dikhao
            allListings = await Listing.find({});
        }

        // Aapka existing render logic
        res.render("listings/index", { allListings, selectedCategory: category || "" });

}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    const {id} = req.params;
    if(id.length !== 24){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
    }
    // const listing = await Listing.findById(id).populate("reviews").populate("owner");
    const listing = await Listing.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");

    if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createNewListing = async (req,res,next)=>{
        const url = req.file.path;
        const filename = req.file.filename;    

        const data = req.body;
        const newListing = new Listing(data);
        //map geocode//

        const fullAddress = `${data.location}, ${data.country}`;
        const geoData = await geocoder.geocode(fullAddress);
        let lat = 28.6139; // Fallback (Delhi) agar geocoding fail ho jaye
        let lng = 77.2090;

        if (geoData && geoData.length > 0) {
            lat = geoData[0].latitude;  // Pehla result sabse accurate hota hai
            lng = geoData[0].longitude;
        }else{
            const geoCountry = await geocoder.geocode(data.country);
            lat = geoCountry[0].latitude;
            lng = geoCountry[0].longitude;
        }

        // console.log(req.user);
        newListing.image = {url, filename}
        newListing.owner = req.user;
        newListing.coordinates.lat = lat;
        newListing.coordinates.lng = lng;
        const ans = await newListing.save(); 
        req.flash("success","New listing added successfully")
        res.redirect("/listings");

    };

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for edit does not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing.title)
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async (req,res,next)=>{
    
    const {id} = req.params;
    const data = req.body;
    const listing = await Listing.findByIdAndUpdate(id, {...data },{ new: true });
    const fullAddress = `${data.location}, ${data.country}`;
        const geoData = await geocoder.geocode(fullAddress);
        let lat = 28.6139; // Fallback (Delhi) agar geocoding fail ho jaye
        let lng = 77.2090;

        if (geoData && geoData.length > 0) {
            lat = geoData[0].latitude;  // Pehla result sabse accurate hota hai
            lng = geoData[0].longitude;
        }else{
            const geoCountry = await geocoder.geocode(data.country);
            lat = geoCountry[0].latitude;
            lng = geoCountry[0].longitude;
        }
        listing.coordinates.lat = lat;
        listing.coordinates.lng = lng;

    if(req.file){
        const url = req.file.path;
        const filename = req.file.filename;    
        listing.image = {url, filename};
    }
    await listing.save();
    req.flash("success","Listing is updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    req.flash("success","Listing deleted successfully");
    const {id} = req.params;
    const data = await Listing.findByIdAndDelete(id);
    console.log(data)
    res.redirect("/listings")
};