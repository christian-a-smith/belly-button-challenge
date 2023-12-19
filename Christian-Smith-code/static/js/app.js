//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const my_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
function init(){
let selector = d3.select("#selDataset")

//loop over "names" and create dropdown
d3.json(my_url).then(function(data) {
    console.log(data);
    let datanames = data.names;
    datanames.forEach((sample)=>{
      selector.append("option").text(sample).property("value",sample)
    });
    //Populate page on startup
   let startup = datanames[0];
   getinfo(startup)
   createallcharts(startup);
  });
};
init();
//Calls table and chart based on dropdown selection
function optionChanged(newdata){
  getinfo(newdata);
  createallcharts(newdata);
};
//Create table
function getinfo(userdata){
d3.json(my_url).then(function(data){
  let metadata=data.metadata;
  let metaarray=metadata.filter(obj=>obj.id==userdata);
  let metaresult = metaarray[0];
  let info=d3.select("#sample-metadata");
  info.html("")
  Object.entries(metaresult).forEach(([key,value])=>{
    info.append("h6").text(`${key}: ${value}`)
  });
});
};
//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
function createallcharts(userdata){
  d3.json(my_url).then(function(data){
    let metadata=data.metadata;
    let metaarray=metadata.filter(obj=>obj.id==userdata);
    let metaresult = metaarray[0];
    let wfreq = metaresult.wfreq;
    let sampledata=data.samples;
    let samplearray=sampledata.filter(obj=>obj.id==userdata);
    let sampleresult = samplearray[0];
    let otu_ids = sampleresult.otu_ids;
    let otu_labels = sampleresult.otu_labels;
    let sample_values = sampleresult.sample_values;
    let yticks = otu_ids.slice(0,10).map(otu_id=>`OTU ${otu_id}`).reverse()
    var bardata = [{
      type: 'bar',
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }];
    Plotly.newPlot('bar', bardata);
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Blues"
      }
    };
    var bubbledata = [trace1];
    var bubblelayout = {
      title: '',
    };
    Plotly.newPlot('bubble', bubbledata, bubblelayout);
    var gaugedata = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "Belly Button Washing Frequency (scrubs per week)", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue", dtick:1 },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
        }
      }
    ];
        var gaugelayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', gaugedata, gaugelayout);
     
  })
};
