// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
// Use `d3.json` to fetch the metadata for a sample
// Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;
  d3.json(url).then((data) => {
    var meta = d3.select("#sample-metadata");
// Use `.html("") to clear any existing metadata
    meta.html("");
// Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([k, v]) => {
      var cell = meta.append('h4');
      cell.text(`${k}: ${v}`);
    });
  });
};

function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
// @TODO: Build a Bubble Chart using the sample data
  var sampleurl = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sampleurl).then((data) => {
    // @TODO: Build a Bubble Chart using the sample data
    var x = data.otu_ids;
    var y = data.sample_values;
    var msize = data.sample_values;
    var mcolor = data.otu_ids;
    var tvalue = data.otu_labels;
    var trace1 = {
      x: x,
      y: y,
      type: "bubble",
      text: tvalue,
      mode: 'markers',
      marker: {
        size: msize,
        color: mcolor,
      }
    };
    var layout1 = {
      height: 500,
      width: 1500,
      xaxis: {
        title: "Species/OTU",
        automargin: true
      }
    };
    var data1 = [trace1];
    Plotly.newPlot("bubble", data1, layout1);
    // Part 5 - Working Pie Chart
    var top10values = data.sample_values.sort((first, second) => second - first).slice(0, 10);
    var top10ids = data.otu_ids.sort((first, second) => second - first).slice(0, 10);
    var top10labels = data.otu_labels.sort((first, second) => second - first).slice(0, 10);
    var trace2 = {
      labels: top10ids,
      values: top10values,
      hovertext: top10labels,
      type: 'pie'
    };
    var layout2 = {
      height: 500,
      width: 750,
      title: "Relative abundance of 10 most common species"
    };
    var data2 = [trace2];
    Plotly.newPlot("pie", data2, layout2);
  });
};

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