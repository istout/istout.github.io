
// Initialize the map and set its view to BYU's geographical coordinates and zoom level
var map = L.map('map').setView([40.246331, -111.647653], 3);

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
   // .openPopup();

// Add layer control to switch between street and satellite views
var baseLayers = {
    "Street View": streetLayer,
    "Satellite View": satelliteLayer
};

L.control.layers(baseLayers).addTo(map); 

// Link to KML file downlaods for countries 
// https://mapme.notion.site/402e1700c2c7496d88151b755d465428?v=814ee4b037114acc9789b9913a2b74d8

//const kmlPath = 'KML_files/';

const kmlUrls = [
    // 'KML_files/Counties.kml',// For some reason it doesn't like Counties.kml
   // kmlpath + 'USA.kml',
    'KML_files/Utah.kml',
    'KML_files/KML_import.kml',
    'KML_files/Alabama.kml',
    'KML_files/Alaska.kml',
    'KML_files/Arizona.kml',
    'KML_files/California.kml',
    'KML_files/Florida.kml',
    'KML_files/Georgia.kml',
    'KML_files/Hawaii.kml',
    'KML_files/Idaho.kml',
    'KML_files/Maryland.kml',
    'KML_files/Nevada.kml',
    'KML_files/New York.kml',
    'KML_files/Oklahoma.kml',   
    'KML_files/South Dakota.kml',   
    'KML_files/Texas.kml',
    'KML_files/Utah.kml',   
    'KML_files/Virginia.kml',
    'KML_files/Washington.kml', 
    'KML_files/Wyoming.kml',
    'KML_files/District of Columbia.kml',
    'KML_files/Canada.kml',
    'KML_files/Mexico.kml',
    'KML_files/Spain.kml',
    'KML_files/Portugal.kml',
    'KML_files/China.kml',
    'KML_files/british-columbia.kml',
];


kmlUrls.forEach(function(url) {
    omnivore.kml(url).on('ready', function() {
       //kmlLayer = this;
        this.addTo(map);
        }); 
    }).on('error', function(e) {
        console.error('Error loading KML:', e);
    });
