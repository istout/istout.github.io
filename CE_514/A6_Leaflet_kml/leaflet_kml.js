
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

// Add layer control to switch between street and satellite views
var baseLayers = {
    "Street View": streetLayer,
    "Satellite View": satelliteLayer
};

L.control.layers(baseLayers).addTo(map); //allows for the kml to be switched 

// Initialize the KML layer and add it to the map when ready
const kmlUrls = [
    'https://cors-anywhere.herokuapp.com/https://istout.github.io/CE_514/A6_Leaflet_kml/KML_import.kml',
    'https://cors-anywhere.herokuapp.com/https://istout.github.io/CE_514/A6_Leaflet_kml/UtahCounty.kml'
];

kmlUrls.forEach(function(url) {
    omnivore.kml(url).on('ready', function() {
       //kmlLayer = this;
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
