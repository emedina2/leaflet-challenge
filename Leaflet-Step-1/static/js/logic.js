
//URL for GeoJSON data
var data_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(data_url).then(function(data) {
    createFeatures(data.features);

});
  
var quakeMarkers = [];

//Function Set Circle Colors
function chooseColor(depth) {
  if (depth<10) {
      return "chartreuse"
  }else if(depth<30){
      return "greenyellow"
  }else if(depth<50){
      return "gold"
  }else if(depth<70){
      return "goldenrod"
  }else if(depth<90){
      return "orange"
  }else if(depth>=90){
      return "red"
  }
};

// Give each feature a popup describing the place, time, and magnitude of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
  "<p><b> Magnitude: " +feature.properties.mag + "</b></p>" );
}

//Function to create map features
function createFeatures(earthquakeData) {
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  //## Create Circles on Map
  // Loop through the quakeData array to create circles
  for (var index = 1; index < earthquakeData.length; index++) {
    var quake = earthquakeData[index];
    // console.log(quake)
    
    // For each earthquake, create a circle
    quakeMarkers.push(
      L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], {
      fillOpacity: 1,
      color: "grey",
      weight: 1,
      fillColor: chooseColor(quake.geometry.coordinates[2]),
      radius: quake.properties.mag * 5000
      }).bindPopup("<h3><b> Date: </b>" + quake.properties.place +
      "</h3><hr><p>" + new Date(quake.properties.time) + "</p>" +
      "<p><b> Magnitude: </b>" +quake.properties.mag + "</p>"+
      "<p><b> Depth: </b>" + quake.geometry.coordinates[2] + "</p>")
      );
      
  };
// console.log(quakeMarkers)
   
createMap(L.layerGroup(quakeMarkers));
};



//create Legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depth</h4>";
  div.innerHTML += '<i style="background: chartreuse"></i><span>-10 - 10</span><br>';
  div.innerHTML += '<i style="background: greenyellow"></i><span>10 - 30</span><br>';
  div.innerHTML += '<i style="background: gold"></i><span>30 - 50</span><br>';
  div.innerHTML += '<i style="background: goldenrod"></i><span>50 - 70</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>70 - 90</span><br>';
  div.innerHTML += '<i style="background: red"></i><span>> 90</span><br>';
  return div;
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
    "Earthquakes": earthquakes
        
  };

    // Create our map, giving it the terrain map and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [40, -110],
    zoom: 6,
    layers: [outsideMap, earthquakes]
    });
  legend.addTo(myMap)
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }

  

  
