// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

  //map
  const mapContainer = document.getElementById('map');

if (mapContainer) { 
   const lat = parseFloat(mapContainer.dataset.lat)// Fallback Delhi
    const lng = parseFloat(mapContainer.dataset.lng)
    // console.log(mapContainer.dataset.title)

var map = L.map('map').setView([lat,lng], 9);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);




L.marker([lat,lng]).addTo(map)
    .bindPopup(`<b>${loc}, ${country}</b>`)
    .openPopup();
var marker = L.marker([lat,lng]).addTo(map);
var circle = L.circle([lat,lng], {
    color: 'green',
    fillColor: 'rgb(17, 255, 0)',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);
  }

function validateFileSize(input) {
    const file = input.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 🎯 Note: 5MB ke liye 5 se multiply karein (Aapke code me 1*1024*1024 tha, jo sirf 1MB hota hai)
    const imgDiv = document.querySelector(".invalid-image");

    if (file) {
        if (file.size > maxSizeInBytes) {
            // 🎯 Error Text Show Karein
            imgDiv.innerHTML = "File size must be less than 5MB. Your file is " + (file.size / (1024 * 1024)).toFixed(2) + " MB.";
            
            // Input ko empty kar dein taaki galat file submit na ho
            input.value = ""; 
            
            // Red borders add karne ke liye bootstrap standard check flag class lagayein
            input.classList.add("is-invalid");
        } else {
            // 🎉 FIX: Jab image valid ho, toh red message text ko screen se gayab (clear) kar dein
            imgDiv.innerHTML = ""; 
            
            // Invalid validation borders ko bhi clear karein
            input.classList.remove("is-invalid");
        }
    }
  }