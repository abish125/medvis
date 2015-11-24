function draw_text_specialty(data) 
{
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 300 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  	var text = svg.selectAll("text").data(data).enter().append("text");
  	text
  		.attr("x", 5)
		  .attr("y",function(d,i) {return 20;})
  		.text(function (d) {return d;});
}