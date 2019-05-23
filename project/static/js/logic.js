var AgeData = "/map/2019";
// $.ajax({
//     url: "map/2019",
//     success: (data) => {
//         AgeData = data;
//     }
//   });

// Creating map object
var map = L.map(
    "map", {
        center: [38.627, -90.1994],
        zoom: 5
    });

// Adding tile layer
// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
// }).addTo(map);

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9yZWlsbHkiLCJhIjoiY2p2OW1mMXg4MGF0NjN5bm1uYnBwaXB0byJ9.8KL4Alvy3N7d5HVK9Jf7Mg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-100.04, 38.907],
    zoom: 3
});

// var geoData = "static/js/states.geojson";

// d3.json(geoData, (data) => {
//     L.geoJson(data).addTo(map);
// });
map.on('load', function () {
    console.log("test")
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'static/js/states.geojson'
        },
        'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'states-layer', function (e) {
        console.log("clicked", e)
        let stateIndex = AgeData["State"].findIndex(e.features[0].properties.postal);
        // (state) => { return (state.trim().toLowerCase() === e.features[0].properties.postal.toLowerCase().replace('.', '').replace(' ', '')); });
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`${AgeData["AverageAge"][stateIndex]} ${AgeData["State"][stateIndex]}`)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'states-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'states-layer', function () {
        map.getCanvas().style.cursor = '';
    });
});
