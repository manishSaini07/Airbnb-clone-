const listing = require("../models/listing.js");
const mongoose = require("mongoose");
const initData = require("./sampleListing.js");

main().then(res=>console.log("DB connection successfull.."))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
 
const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"6a7871cf64d912effa7575dc"}));
    await listing.insertMany(initData.data);
    console.log("data is initialized now")
}
initDB();


