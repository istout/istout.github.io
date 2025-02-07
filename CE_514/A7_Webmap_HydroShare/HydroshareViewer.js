
//var map = L.map('map').setView([37.8, -96], 4); // Centered on the US
//var map = L.map('map').setView([37.8, 96], 4); //Centered on China
var map = L.map('map').setView([41.8, -111.48], 9); //Centered on Logan

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-0b3452c0c2d34f099e6da847a6ce828d/wms', {  
//layers: 'HS-0b3452c0c2d34f099e6da847a6ce828d:counties',

/* 	L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-49ea3bd6231c4e8ea8134ef52e9731ba/wms', { //just have to replace the part after "HS-_________" that number is an identifier
                layers: 'HS-49ea3bd6231c4e8ea8134ef52e9731ba:yellow', //this is telling it which file to look at
                format: 'image/png',
                transparent: true,
                attribution: 'Hydroshare GeoServer'
            }).addTo(map);
            
            
            L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-49ea3bd6231c4e8ea8134ef52e9731ba/wms', { 
                layers: 'HS-49ea3bd6231c4e8ea8134ef52e9731ba:pearl', 
                format: 'image/png',
                transparent: true,
                attribution: 'Hydroshare GeoServer'
            }).addTo(map);
            
            
            
            L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-49ea3bd6231c4e8ea8134ef52e9731ba/wms', { 
                layers: 'HS-49ea3bd6231c4e8ea8134ef52e9731ba:yangtze', 
                format: 'image/png',
                transparent: true,
                attribution: 'Hydroshare GeoServer'
            }).addTo(map); */

//be able to have them on seperate layers that we can toggle on and off

const demlayer = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Logan', 
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
    // }).addTo(map);
});

demlayer.addTo(map); //now we add the variable and add it to the map
 

const wlayer = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
// }).addTo(map);
});

wlayer.addTo(map);

//can eventually add check boxes to toggle them on and off. 
L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Outlet', 
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
}).addTo(map);

  L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Logannet', 
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
}).addTo(map);

