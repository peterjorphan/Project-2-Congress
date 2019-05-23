function buildLine(state = 'AK') {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/line/${state}`).then((lineData) => {

        console.log(lineData)
        // @TODO: Build a Bubble Chart using the sample data
        d3.select("#line").html("")
        var trace1 = {
            x: lineData.Year,
            y: lineData.AverageTotal,
            mode: 'lines+markers',
            type: 'scatter',
            text: lineData.Year,
            marker: {
                // size: sampleData.sample_values, 
                color: 'black'
            },
            name: "US"
        };

        var trace2 = {
            x: lineData.Year,
            y: lineData.AverageAge,
            mode: 'lines+markers',
            type: 'scatter',
            text: lineData.Year,
            marker: {
                // size: sampleData.sample_values, 
                color: 'orange'
            },
            name: state
        };

        var response = [trace1, trace2];
        console.log(response)
        var layout = {
            xaxis: { title: "Congress Year" },
            yaxis: { title: "Average Age" },
            width: 1019,
        };

        Plotly.newPlot('line', response, layout, { responsive: true });
    });
}

buildLine();

function buildBar(year = 1995) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sampleURL = `/bar/${year}`;
    d3.json(sampleURL).then(function (data) {
        // @TODO: Build a Bubble Chart using the sample data
        d3.select("#bar").html("")
        var colors = {
            'D': 'rgb(0,0,255)',
            'R': 'rgb(255,0,0)',
        }
        var barData = [{
            x: data.State,
            y: data.AverageAge,
            type: "bar",

            marker: {
                color: data.Party.map(p => colors[p])
            }
        }];

        var layout = {
            showlegend: false,
            xaxis: { title: "States and Territories" },
            yaxis: { title: "Average Age" },
            width: 1019,
            title: {
                display: true,
                text: year
            }
        };

        Plotly.newPlot('bar', barData, layout, { responsive: true });
    });
};

buildBar();

function init() {
    // Grab a reference to the dropdown select element
    var selectState = d3.select('#selState');

    // Use the list of sample names to populate the select options
    d3.json("/states").then((stateAbbr) => {
        stateAbbr["State"].forEach((item) => {
            selectState
                .append("option")
                .text(item)
                .property("value", item);
        });
    });

    var selectYear = d3.select("#selYear");

    d3.json("/years").then((yearJson) => {
        yearJson["Year"].forEach((item) => {
            selectYear
                .append("option")
                .text(item)
                .property("value", item);
        });
    });
}


init();

var AgeData = "/map/2019";
$.ajax({
    url: "/map/2019",
    success: (data) => {
        AgeData = data;
    }
});

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
        let stateIndex = AgeData["State"].findIndex(
            (state) => {
                return (state ===
                    e.features[0].properties.postal);
            });

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`State: ${AgeData.State[stateIndex]}<br>Average Age: ${AgeData.AverageAge[stateIndex].toFixed(2)}`)
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
