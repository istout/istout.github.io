//set map positioning
var map = L.map('map').setView([41.8, -111.48], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define your WMS layers (one for each river)
const layers = {
  'River1': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
      layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
      format: 'image/png',
      transparent: true,
      attribution: 'Hydroshare GeoServer'
  }),
  'River2': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
      layers: 'your_layer_2', 
      format: 'image/png',
      transparent: true,
      attribution: 'Hydroshare GeoServer'
  }),
  // Add more rivers as needed, like River3, River4, etc.
};



let currentLayer = null; //variable to store the current layer



//make checkboxes show different highlighted area on the map and show the forecast. 
//could do it by the box areas los rivers shows on their websit. 

function toggleCheckbox(checkbox) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Loop through all checkboxes and uncheck them except the one that triggered the event
    checkboxes.forEach(function(item) {
      if (item !== checkbox) {
        item.checked = false;
      }
    });
  }


function toggleRioGrande() {
    const rioGrandeCheckbox = document.getElementById('RioGrande');
    if (rioGrandeCheckbox.checked) {
      L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
    }).addTo(map);

      console.log('Rio Grande checkbox is checked');
    } else {
      console.log('Rio Grande checkbox is unchecked');
    }
  }






  function toggleCheckbox(checkbox, functionName) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Loop through all checkboxes and uncheck them except the one that triggered the event
    checkboxes.forEach(function(item) {
      if (item !== checkbox) {
        item.checked = false;
      }
    });
    
    // Call the function based on which checkbox is checked
    if (checkbox.checked) {
      window[functionName]();
    }
  }

