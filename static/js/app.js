/// Create meta information panel
function create_metainfo(sample) {
    
    d3.json(`/metadata/${sample}`).then(function(sample){
      var meta_info = d3.select(`#sample-metadata`).html(""); 
    /// clear element
    meta_info.html("");
      Object.entries(sample).forEach(function([key,value]){
        var new_p = meta_info.append("p");
        new_p.text(`${key}:${value}`)
      })
    });
}

/// Bubble Chart
function make_bubble(sample) {
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
 
  var selector = d3.select("#selDataset");

  d3.json("/names").then((numberOfSample) => {numberOfSample.forEach((sample) => {selector.append("option").text(sample).property("value", sample);});

    make_bubble(numberOfSample[0]);
    create_metainfo(numberOfSample[0]);
  });
}

function refresh_data(selectedSample) {
  // Refresh all data
  make_bubble(selectedSample);
  create_metainfo(selectedSample);
}

// Initiate everything
init();