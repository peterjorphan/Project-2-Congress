function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select('#selState');

    // Use the list of sample names to populate the select options
    d3.json("/states").then((stateAbbr) => {
        stateAbbr["State"].forEach((item) => {
            selector
                .append("option")
                .text(item)
                .property("value", item);
        });
    });
}

function optionChanged(stuff) {
    console.log(stuff);
}

init();