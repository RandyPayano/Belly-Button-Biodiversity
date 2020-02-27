
/// Create metadata panel
function create_metadata(sample) {
    /// Grab data from route and select div #sample-metadata
    d3.json(`/metadata/${sample}`).then(function(sample){
      var metaSample = d3.select(`#sample-metadata`).html(""); 
    /// clear div
    metaSample.html("");
    /// Use `Object.entries` to push data into div
      Object.entries(sample).forEach(function([key,value]){
        var new_p = metaSample.append("p");
        new_p.text(`${key}:${value}`)
      })
    });
}

/// Create Bubble Chart using sample data
function create_viz(sample) {
  var vizData = `/samples/${sample}`;
    d3.json(vizData).then(function(data){
      var x_axis = data.otu_ids;
      var y_axis = data.sample_values;
      var size = data.sample_values;
      var color = data.otu_ids;
      var texts = data.otu_labels;
    
      var bubble = {
        x: x_axis,
        y: y_axis,
        text: texts,
        mode: `markers`,
        marker: {
        size: size,
        color: color
        }
      };
  
      var data = [bubble];
      var layout = {
        title: "Belly Button Bacteria",
        xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", data, layout);
    /// Create Pie Chart
  
    d3.json(vizData).then(function(data){
      var values = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);

      var pie_chart = [{
        values: values,
        lables: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  /// Populate the select options
  d3.json("/names").then((sampleNames) => {sampleNames.forEach((sample) => {selector.append("option").text(sample).property("value", sample);});

    /// Plpt first sample
    create_viz(sampleNames[0]);
    create_metadata(sampleNames[0]);
  });
}

function refresh_data(newSample) {
  // Fetch new data when drop down menu is used
  create_viz(newSample);
  create_metadata(newSample);
}


init();