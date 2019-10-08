// Store width and height parameters to be used in later in the graph
var svgWidth = 900;
var svgHeight = 600;

var margin = {top: 40, right: 40, bottom: 80, left: 90};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an graph to append the SVG group that contains the states data
// Set width and height
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the graph
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import CSV Data file
var file = "assets/data/data.csv"

// Function is called and passes through csv data
d3.csv(file).then(successHandle, errorHandle);

// Use error handling function to append data and SVG objects
// Errors will be only visible in console
function errorHandle(error) {
  throw err;
}

// Function passes through stateData
function successHandle(stateData) {

// Loop through the data and passes through argument data
  stateData.map(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create scale functions
  // Linear Scale takes the min to be displayed in axis, and the max of the data
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(stateData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([4.1, d3.max(stateData, d => d.healthcare)])
    .range([height, 0]);

  // Create axis functions by calling the scale functions
  var bottomAxis = d3.axisBottom(xLinearScale)
    
  // Adjust the number of ticks for the bottom axis  
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to the chart group 
  // Bottom axis moves using height 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  // Append the left axis to chart group
  chartGroup.append("g")
    .call(leftAxis);

  // Create circles for scatterplot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")

  // Append text inside circles 
  var circlesGroup = chartGroup.selectAll()
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare - .2))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));


  // Create x and y axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (d) {
    toolTip.show(d);
  })
    // onmouseout event
    .on("mouseout", function (d, index) {
      toolTip.hide(d);
    });
  }