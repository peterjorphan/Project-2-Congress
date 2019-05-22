function buildBar(year) {

    //   // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sampleURL = `/bar/${year}`;
    d3.json(sampleURL).then(function(data){
        //     // @TODO: Build a Bubble Chart using the sample data
        d3.select("#bar").html("")
        var colors = {'D': 'rgb(228, 241, 254)',
                'R': 'rgb(241, 169, 160)',
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
        height: 600,
        width: 1000
        };

        Plotly.newPlot('bar', barData, layout);
    });
};

buildBar(2019);

