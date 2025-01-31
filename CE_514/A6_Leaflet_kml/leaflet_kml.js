
// Initialize the map and set its view to BYU's geographical coordinates and zoom level
var map = L.map('map').setView([40.246331, -111.647653], 15);


// Define tile layers
var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

 var satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
 });

// Add the street layer to the map by default
streetLayer.addTo(map);

// Add a marker to the map at BYU's coordinates
L.marker([40.246331, -111.647653]).addTo(map)
    .bindPopup('Brigham Young University')
    .openPopup();

// // Function to add a marker at the clicked location
// function onMapClick(e) {
//     var marker = L.marker(e.latlng).addTo(map)
//         .bindPopup('You clicked the map at ' + e.latlng.toString())
//         .openPopup();

//     // Add event listener for right-click to remove the marker
//     marker.on('contextmenu', function() {
//         map.removeLayer(marker);
//     });
// }

// // Add event listener for map clicks
// map.on('click', onMapClick);

// Add layer control to switch between street and satellite views
var baseLayers = {
    "Street View": streetLayer,
    "Satellite View": satelliteLayer
};

L.control.layers(baseLayers).addTo(map); //allows for the kml to be switched 

// Define the variable for the KML layer
//var kmlLayer;

// Initialize the KML layer and add it to the map when ready
const kmlUrls = [
    'https://cors-anywhere.herokuapp.com/https://istout.github.io/CE_514/A6_Leaflet_kml/KML_import.kml',
    'https://cors-anywhere.herokuapp.com/https://istout.github.io/CE_514/A6_Leaflet_kml/Counties.kml'
];

kmlUrls.forEach(function(url) {
    omnivore.kml(url).on('ready', function() {
        this.addTo(map);
        
        this.eachLayer(function(layer) {
            if (layer.feature.properties.name === 'Utah') {
                layer.setStyle({
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.5
                });
            }
        }); 
    }).on('error', function(e) {
        console.error('Error loading KML:', e);
    });
});
// omnivore.kml(kmlUrl).on('ready', function() {
//     this.addTo(map);

//     // kmlLayer = this; // Assign the KML layer to the variable
//     // kmlLayer.addTo(map); // Add it to the map once it's ready
// }).on('error', function(e) {
//     console.error('Error loading KML:', e);
//});

