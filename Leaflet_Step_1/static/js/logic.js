// Store our data site inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL
// Getting json formatted data
// Within it, 
// "features":[{"type":"Feature","properties":{"mag":1.29,"place":"10km SSW of Idyllwild, CA","time":1388620296020, ... 
// saving this 
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr><p>" + (feature.properties.mag) + "</p>");
      console.log(feature);
      console.log(layer);
      /*console.log(layer); */
    };
    
    // conditionally decide color and size of circle 
    for (var i=0; i < data.features.length; i++) {
        magnitude=+data.features[i].properties.mag;

      if (magnitude <=4.6) {
          color='yellow';
          radius = magnitude * 1000
          }
    
      else if (magnitude <= 4.8) {
          color='gold';
          radius = magnitude * 1000
          }
    
      else if (magnitude <= 5.0) {
          color='orange';
          radius = magnitude * 1000
          }
            
      else /*(feature[i].mag <=7.0) */{
          color='red';
          radius = magnitude * 1000
          }
    };

    // loop through coordinates 
  
    for (var j=0; j < data.features.length; j++) {
      var location=data.features[j].geometry.coordinates;
      console.log(location);

    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);

}


function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
      });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add circles to map
    for (var i=0; i<data.features.length; i++) {
      L.circle(location[i],{
        fillOpacity: 0.75,
        color: "white",
        fillColor: color,
        // Adjust radius
        radius: radius
      }).bindPopup("<h1>" + data.features[i].place + "</h1> <hr> <h3>Points: " + data.features[i].mag + "</h3>").addTo(myMap);
    }
}
});