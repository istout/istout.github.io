
var map = L.map('map').setView([41.8, -111.48], 9); //Centered on Logan

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const layer1 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
    layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
format: 'image/png',
transparent: true,
attribution: 'Hydroshare GeoServer'
});

layer1.addTo(map);

const layer2 =  L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
      	  	layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Logannet', 
            format: 'image/png',
            transparent: true,
            attribution: 'Hydroshare GeoServer'
        })
layer2.addTo(map); 
      

          
function toggleLayer1() {
    if (document.getElementById("layer1checkbox").checked) {
      layer1.addTo(map);

  } else {
      map.removeLayer(layer1);
  }
}

function toggleLayer2() {
    if (document.getElementById("layer2checkbox").checked) {
        layer2.addTo(map);

    } else {
        map.removeLayer(layer2);

    }
}

        