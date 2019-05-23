function buildBar(year) {

    //   // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sampleURL = `/bar/${year}`;
    d3.json(sampleURL).then(function(data){
        //     // @TODO: Build a Bubble Chart using the sample data
        d3.select("#bar").html("")
        var colors = {'D': 'rgb(0,0,255)',
                'R': 'rgb(255,0,0)',
        }
        var barData = [{
        x: data.State,
        y: data.AverageAge,
        type: "bar",
        marker: {color: data.Party.map(p => colors[p])
        }
        }];


        var layout = {
        showlegend: false,
        xaxis: {title: "States and Territories"},
        yaxis: {title: "Average Age"},
        width: 1000,
        };

        Plotly.newPlot('bar', barData, layout, {responsive: true});
    });
};

buildBar(2019);

