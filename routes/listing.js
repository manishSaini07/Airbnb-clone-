const express = require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middelware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage }= require("../cloudConfig.js");
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});


// router.route
router.route("/")
    .get(wrapAsync( listingController.index))
    // create route
    .post(isLoggedIn, upload.single("image"),validateListing ,wrapAsync(listingController.createNewListing));
    // validateListing <<<<<add MW
    // .post(upload.single("image"), (req,res)=>{
    //     res.send(req.file)
    // })


//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    //show route
    .get(wrapAsync(listingController.showListings))
    // update route 
    .put(isLoggedIn, isOwner,upload.single("image"), validateListing,wrapAsync(listingController.updateListing))

    // .put(isLoggedIn,isOwner,upload.single("image"),(req,res)=>{
    //     res.send(req.file);
    // })
    //destroy route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

module.exports = router;