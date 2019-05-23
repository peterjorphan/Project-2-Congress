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

function optionChanged(stuff) {
    console.log(stuff);
}

init();