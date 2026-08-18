// app.js (Express Server)
require('dotenv').config(); // .env file se key load karne ke liye
const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send("okk")
})
// Route: Jo real Google API ka use karke New Delhi ke coordinates laayega
app.get('/delhi-coordinates', async (req, res) => {
    try {
        const apiKey = process.env.GEOCODING_API; // Aapki .env file se API key
        
        // CORRECTION 1: Sahi aur complete Google Geocoding API Web Service URL
        const googleUrl = `https://googleapis.com${apiKey}`;
        https://googleapis.com?address=New+Delhi&key=AIzaSyB8lJrIFW7IlsHJgi-gQQHiXteMxLCX9f0

        // CORRECTION 2: Axios ki jagah Node.js ka built-in fetch use kiya
        const response = await fetch(googleUrl);
        const data = await response.json(); // Fetch me data ko json me convert karna padta hai

        // Agar Google API se 'OK' status milta hai
        if (data.status === 'OK') {
            // CORRECTION 3: results[0] se data nikalna padega kyunki yeh ek array hota hai
            // const coordinates = data.results[0].geometry.location;
            // const formattedAddress = data.results[0].formatted_address;

            // Browser ko real response bhejna
            // return res.json({
            //     success: true,
            //     message: "Data fetched from Google API successfully using built-in fetch",
            //     address: formattedAddress,
            //     coordinates: coordinates
            // });
            return res.send(data)
        } else {
            // Agar Google API koi error de (jaise Invalid Key)
            return res.status(400).json({ 
                success: false, 
                error: `Google API Error: ${data.status}` 
            });
        }

    } catch (error) {
        // Agar code me koi aur internal dikkat aaye
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            details: error.message 
        });
    }
});

app.listen(3000, () => console.log('Server 3000 port par bina Axios ke live hai!'));
