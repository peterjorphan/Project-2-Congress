function buildLine(state) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/line/${state}`).then((lineData) => {
  
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
            color: black
          }
        };
  
        var response = [trace1];

        var layout = {
            xaxis: {title: "Congress Year"},
            yaxis: {title: "Average Age"}
        }
  
        Plotly.newPlot('#line', response, layout, {responsive: true});
buildLine('AK')
// function init() {
//     // Grab a reference to the dropdown select element
//     var selector = 'AK'
//     // d3.select("#selState");
    
//     // // Use the list of sample names to populate the select options
//     // d3.json("/names").then((sampleNames) => {
//     //     sampleNames.forEach((sample) => {
//     //     selector
//     //         .append("option")
//     //         .text(sample)
//     //         .property("value", sample);
//     //     });
    
//         // Use the first sample from the list to build the initial plots
//         const firstSample = sampleNames[0];
//         buildLine(firstSample);
//         // buildMetadata(firstSample);
//         // buildGauge(firstSample);
//     });
//     }

//     init();

    //   // @TODO: Build a Pie Chart
    //   // HINT: You will need to use slice() to grab the top 10 sample_values,
    //   // otu_ids, and labels (10 each).
  
    //   // Create array with value/index pair objects
    //   var sampleValues = []
    //   sampleData.sample_values.map((x, i) => sampleValues[i] = {x, i});
    //   console.log(sampleValues)
  
    //   // Sort the list by the values of the pairs and slice the top 10
    //   var slicedSampleValues = sampleValues.sort(function(a, b){return b.x - a.x}).slice(0,10);
    //   console.log(slicedSampleValues)   
  
    //   // Create arrays for the sliced values and indices
    //   var pieValues = slicedSampleValues.map(a => a['x']);
    //   console.log(pieValues)
    //   var indices = slicedSampleValues.map(a => a['i']);
    //   console.log(indices)
  
    //   // Use the sliced indices to create arrays for the labels and hovertext
    //   var pieLabels = indices.map(i => sampleData.otu_ids[i]);
    //   console.log(pieLabels)
    //   var pieHovertext = indices.map(i => sampleData.otu_labels[i]);
    //   console.log(pieHovertext)
  
    //   d3.select('#pie')
    //     .html("")
    //     var trace2 = {
    //       values: pieValues,
    //       labels: pieLabels,
    //       hovertext: pieHovertext,
    //       type: "pie"
    //     };
  
    //     var pieData = [trace2];
  
    //     Plotly.newPlot("pie", pieData, {responsive: true});
  
      });
  
  }