
//URL for GeoJSON data
var data_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(data_url).then(function(data) {
    createFeatures(data.features);
});

//Set Circle Colors
function chooseColor(depth) {
  if (depth<10) {
      return "chartreuse"
  }else if(10<=depth<30){
      return "greenyellow"
  }else if(30<=depth<50){
      return "gold"
  }else if(50<=depth<70){
      return "goldenrod"
  }else if(70<=depth<900){
      return "orange"
  }else if(depth>=90){
      return "red"
  }
};
    
var quakeMarkers = [];

function createFeatures(earthquakeData) {
  
  // Give each feature a popup describing the place, time, and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p><b> Magnitude: " +feature.properties.mag + "</b></p>" );
  }

  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
    
  createMap(L.layerGroup(earthquakes));
  // Loop through the quakes array
 for (var index = 1; index < earthquakeData.length; index++) {
  var quake = earthquakeData[index];
  // console.log(quake)
  
  // For each earthquake, create a circle
  quakemarkers.push(
    L.circle([quake.geometry.coordinates[0],quake.geometry.coordinates[1]], {
    fillOpacity: 1,
    fillColor: chooseColor(quake.geometry.coordinates[2]),
    radius: quake.properties.mag
    })
   );
    
  }
};
 
 
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var outsideMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
      });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Terrain Map": outsideMap,
      "Dark Map": darkmap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [40, -95],
      zoom: 5,
      layers: [outsideMap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
