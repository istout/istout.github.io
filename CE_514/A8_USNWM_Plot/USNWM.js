// Initialize the map and set its view to a hometown, and set zoom level
var map = L.map('map').setView([38.8809251, -77.143409], 14);

// Define tile layers
var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
});

// Circle of 10 min walking radius around home
var circle = L.circle([38.887558, -77.096971], {
    radius: 500, //unit is meters
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.5,
}).addTo(map);
circle.bindPopup("10 minute walking radius from apartment");

// Polygon around apartment
var polygon = L.polygon([
    [38.887725, -77.097276],
    [38.888105, -77.096772],
    [38.887633, -77.096171],
    [38.887279, -77.096665]
], {
    color: 'red',
    fillColor: 'red',
}).addTo(map);

// Add the street layer to the map by default
streetLayer.addTo(map);

// Markers for different locations
L.marker([38.887558, -77.096971]).addTo(map)
    .bindPopup('The Clarendon Apartments')
    .openPopup();
L.marker([38.8873526, -77.1114113]).addTo(map)
    .bindPopup('Washington-Liberty High School')
    .openPopup();
L.marker([38.887091, -77.133417]).addTo(map)
    .bindPopup("The Church of Jesus Christ of Latter-day Saints<br><br>Fun fact: This building has a wooden plank from Joseph Smith's home")
    .openPopup();
L.marker([38.882823, -77.097856]).addTo(map)
    .bindPopup('Ivy Street')
    .openPopup();
L.marker([38.878301, -77.069607]).addTo(map)
    .bindPopup('Arlington National Cemetery')
    .openPopup();

// Arrays to hold polylines and markers
var polylines = [];
var markers = [];

// Function to add a marker at the clicked location
function onMapClick(e) {
    var marker = L.marker(e.latlng).addTo(map)
        .bindPopup('You clicked the map at ' + e.latlng.toString())
        .openPopup();
    markers.push(marker); // Add it to the array

    // Add event listener for right-click to remove the marker
    marker.on('contextmenu', function () {
        map.removeLayer(marker);
        markers = markers.filter(m => m !== marker); // Remove the marker from the array
    });
}

// Add event listener for map clicks
map.on('click', onMapClick);

// Add layer control to switch between street and satellite views
var baseLayers = {
    "Street View": streetLayer,
    "Satellite View": satelliteLayer
};

L.control.layers(baseLayers).addTo(map);

// Function to calculate great circle distance (in km)
function calculateGreatCircle() {
    // Retrieve input values
    const startLat = parseFloat(document.getElementById('start_lat').value);
    const startLon = parseFloat(document.getElementById('start_lon').value);
    const endLat = parseFloat(document.getElementById('end_lat').value);
    const endLon = parseFloat(document.getElementById('end_lon').value);

    // Check if the input values are valid numbers
    if (isNaN(startLat) || isNaN(startLon) || isNaN(endLat) || isNaN(endLon)) {
        alert("Please enter valid coordinates.");
        return;
    }

    // Function to draw a great circle line connecting the two points
    const rad_lat1 = startLat * Math.PI / 180;
    const rad_lng1 = startLon * Math.PI / 180;
    const rad_lat2 = endLat * Math.PI / 180;
    const rad_lng2 = endLon * Math.PI / 180;
    const dLon = rad_lng2 - rad_lng1;
    const dLat = rad_lat2 - rad_lat1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad_lat1) * Math.cos(rad_lat2) * Math.sin(dLon / 2) ** 2;
    const angular_distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Number of segments for the great circle polyline
    const num_segments = 100;
    const points = [];
    for (let i = 0; i <= num_segments; i++) {
        const f = i / num_segments;
        const A = Math.sin((1 - f) * angular_distance) / Math.sin(angular_distance);
        const B = Math.sin(f * angular_distance) / Math.sin(angular_distance);
        const x = A * Math.cos(rad_lat1) * Math.cos(rad_lng1) + B * Math.cos(rad_lat2) * Math.cos(rad_lng2);
        const y = A * Math.cos(rad_lat1) * Math.sin(rad_lng1) + B * Math.cos(rad_lat2) * Math.sin(rad_lng2);
        const z = A * Math.sin(rad_lat1) + B * Math.sin(rad_lat2);
        const new_lat = Math.atan2(z, Math.sqrt(x ** 2 + y ** 2));
        const new_lng = Math.atan2(y, x);
        points.push([new_lat * 180 / Math.PI, new_lng * 180 / Math.PI]);
    }
    const polyline = L.polyline(points, { color: 'red' }).addTo(map);
    polylines.push(polyline);

    // Add a marker to the ending point
    var endMarker = L.marker([endLat, endLon]).addTo(map)
        .bindPopup('Ending Point: ' + endLat + ', ' + endLon)
        .openPopup();
    markers.push(endMarker);

    // Get the selected unit
    const unit = document.getElementById('Unit').value;

    // Convert the distance to the selected unit
    const R = 6371; // Earth's radius in km
    const distanceInKm = R * angular_distance;
    const distance = convertToUnit(distanceInKm, unit);

    // Display the distance with the selected unit
    document.getElementById("distance").innerHTML = "Distance = " + distance.toFixed(2) + " " + unit;
}

// Function to convert distance to the selected unit
function convertToUnit(distance, unit) {
    const units = {
        kilometers: distance,
        meters: distance * 1000,
        miles: distance * 0.621371,
        feet: distance * 3280.84,
        inches: distance * 39370.1
    };
    return units[unit] || distance; // default to kilometers if unit is invalid
}

// Function to clear the map
function clearMap() {
    // Remove all polylines from the map
    for (const polyline of polylines) {
        map.removeLayer(polyline);
    }
    polylines = []; // Clear the array

    // Remove all markers from the map
    for (const marker of markers) {
        map.removeLayer(marker);
    }
    markers = []; // Clear the array

    // Clear the distance display
    document.getElementById("distance").innerHTML = "";
}
