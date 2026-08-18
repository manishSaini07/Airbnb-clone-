if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const path = require("path");
const port = 8080;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dbUrl = process.env.MONGODB_URL;
// map
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(options);


const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// session store
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600 ,
});
const sessionOpt = {
    store : store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    // console.log(req.user);
    // res.locals.username = req.user ? req.user.username : "ANONYMOUS";
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    next();
})

main().then(res=>console.log("DB connection successfull.."))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//
//restructuring 
app.get("/",(req,res)=>{
    res.redirect("/listings");
})
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.get("/getlocation",async (req,res)=>{
    const geoData = await geocoder.geocode("");
    res.locals.latitude = geoData[0].latitude;
    res.locals.longitude = geoData[0].longitude
    console.log(res.locals.latitude , res.locals.longitude)
    res.send(geoData)
})

// all * 
app.use((req, res, next) => {
    next(new ExpressError(404,"PAGE NOT FOUND!!"));
});

app.use((err,req,res,next)=>{
    // console.log("INSIDE ERROR MW>>>");
    let {statusCode=500,message="SOMTHING WENT WRONG.."} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log("app is listening on port 8080.")
})