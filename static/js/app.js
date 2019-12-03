function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
        var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
        panel.html('');
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
        Object.entries(data).forEach(([key, value]) => {
          panel.append("h6").text(`${key}:${value}`);
        })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    // @TODO: Build a Bubble Chart using the sample data
    var x_val = data.otu_ids;
    var y_val = data.sample_values;
    var marker_size = data.sample_values;
    var colors = data.otu_ids; 
    var text = data.otu_labels;

    var trace_bubble = {
      x: x_val,
      y: y_val,
      text: text,
      mode: 'markers',
      marker: {
        color: colors,
        size: marker_size
      } 
    };
  
    var data = [trace_bubble];

    Plotly.newPlot('bubble', data);


    // @TODO: Build a Pie Chart
    d3.json(`/samples/${sample}`).then((data) => {
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var values = data.sample_values.slice(0,10);
    var labels = data.otu_ids.slice(0,10);
    var hovertext = data.otu_labels.slice(0,10);
    var data = [{
      values: values,
      labels: labels,
      hovertext: hovertext,
      type: 'pie'
    }];

    Plotly.newPlot('pie', data);
    })
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();