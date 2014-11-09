var added_point = [];

function scatter_plot1() 
{
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 300 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.x;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.y;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    /**.on("click", function() {
      
      var coordinates = [0, 0];
      coordinates = d3.mouse(this);
      add_Location(coordinates);
    })**/
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function add_Location(c) {
      added_point = c;

      var body=document.getElementsByTagName('body')[0];
      var tbl=document.createElement('table');
      tbl.style.width='100%';
      tbl.setAttribute('border','1');
      var tbdy=document.createElement('tbody');
      for(var i=0;i<1;i++){
          var tr=document.createElement('tr');
          for(var j=0;j<2;j++){
              if(i==2 && j==1){
                      break
                       } else {
              var td=document.createElement('td');
              td.appendChild(document.createTextNode(c[j]))
              i==1&&j==1?td.setAttribute('rowSpan','2'):null;
              tr.appendChild(td)
              }
          }
          tbdy.appendChild(tr);
      }
      tbl.appendChild(tbdy);
      body.appendChild(tbl);
      global_data.push({"x":+3, "y":+1});
      alert(xMap({x:10}));
      //global_data.push({"Calories":+c[0], "Protein (g)":+c[1]});

      svg.selectAll(".dot")
      .data(global_data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("click", function(d) {
          current_specialty = d.specialty_name;
          draw_text_specialty();
      })
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
          + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
    }

var global_data;


// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("../../{{ MEDIA_URL }}/body_part.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.x = +d.cp_x;
    d.y = +d.cp_y;
//    console.log(d);
  });

global_data = body_part
  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Calories");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Protein (g)");

  // draw dots
  svg.selectAll(".dot")
      .data(global_data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("click", function(d) {
          draw_text_specialty(d.specialty_name);
      })
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
          + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
}
