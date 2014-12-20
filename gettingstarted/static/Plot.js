var Plot = function(p, which_plot) {
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 300 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
    this.which_plot = which_plot;
    this.manager = p;
    var current_plot = this;
    if (which_plot == 1) {
        // setup x 
        var xValue = function(d) {
                return d.x;
            }, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) {
                return xScale(xValue(d));
            }, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) {
                return d.y;
            }, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) {
                return yScale(yValue(d));
            }, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");
    } else if (which_plot == 2) {
        // setup x 
        var xValue = function(d) {
                return d.x;
            }, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) {
                return xScale(xValue(d));
            }, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) {
                return d.z;
            }, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) {
                return yScale(yValue(d));
            }, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");
    } else {
        // setup x 
        var xValue = function(d) {
                return d.z;
            }, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) {
                return xScale(xValue(d));
            }, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) {
                return d.y;
            }, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) {
                return yScale(yValue(d));
            }, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");
    }

    this.xMap = xMap;
    this.yMap = yMap;
    this.xValue = xValue;
    this.yValue = yValue;
    this.xScale = xScale;
    this.yScale = yScale;

    // add the graph canvas to the body of the webpage
    this.svg = d3.select("#div3Plots").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .on("click", function() {
            if (add_mode) {
                var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                current_plot.add_point(coordinates);
            }
        })
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(body_part, xValue) - 1, d3.max(body_part, xValue) + 1]);
    yScale.domain([d3.min(body_part, yValue) - 1, d3.max(body_part, yValue) + 1]);

    // x-axis
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("horizontal axis");

    // y-axis
    this.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("vertical axis");

    // draw dots
    this.circles = this.svg.selectAll("circle")
        .data(body_part);
    this.circles
        .enter().append("circle")
        .attr("class", "part")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("class", function(d) {
            return get_CSS_Class(d);
        })
        .on("click", function(d) {
            body_part[body_part.indexOf(d)].select = !d.select;
            d3.select(this).classed("selected", d.select);
            p.plot1.update(p);
            p.plot2.update(p);
            p.plot3.update(p);
            if (d.select) {
                selected_parts.push(d);
                p.select_point(d);
            } else {
                selected_parts.splice(selected_parts.indexOf(d), 1);
                p.deselect_point(d);
            }
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.name + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

var update = function(p) {
    var current_plot = this;
    this.circles
        .attr("r", 3.5)
        .attr("cx", current_plot.xMap)
        .attr("cy", current_plot.yMap)
        .attr("class", function(d) {
            return get_CSS_Class(d);
        })
        .data(body_part)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", current_plot.xMap)
        .attr("cy", current_plot.yMap)
        .attr("class", function(d) {
            return get_CSS_Class(d);
        })
        .on("click", function(d) {
            var current_part = body_part[body_part.indexOf(d)]
            body_part[body_part.indexOf(d)].select = !d.select;
            d3.select(this).classed("selected", d.select);
            p.plot1.update(p);
            p.plot2.update(p);
            p.plot3.update(p);
            if (d.select) {
                selected_parts.push(d);
                p.select_point(d);
            } else {
                selected_parts.splice(selected_parts.indexOf(d), 1);
                p.deselect_point(d);
            }
        });
}

var add_point = function(c) {
    var current_plot = this;
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 300 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;


    if (first_click) {
        if (current_plot.which_plot == 1) {
            new_point = {
                "x": current_plot.xScale.invert(c[0]) - 1.73,
                "y": current_plot.yScale.invert(c[1]) + 1.25,
                "z": null
            };
        } else if (current_plot.which_plot == 2) {
            new_point = {
                "x": current_plot.xScale.invert(c[0]) - 1.5,
                "y": null,
                "z": current_plot.yScale.invert(c[1]) + 0.23
            };
        } else {
            new_point = {
                "x": null,
                "y": current_plot.yScale.invert(c[1]) + 1,
                "z": current_plot.xScale.invert(c[0]) - 0.50
            };
        }
        current_plot.svg.attr("visibility", "hidden");
    } else {
        if (current_plot.which_plot == 1 && current_plot.manager.plot2.svg.attr("visibility") == "hidden") {
            new_point = {
                "x": new_point.x,
                "y": current_plot.yScale.invert(c[1]) + 1.25,
                "z": new_point.z
            };
            current_plot.manager.plot2.svg.attr("visibility", "visible")
        } else if (current_plot.which_plot == 1 && current_plot.manager.p.plot3.svg.attr("visibility") == "hidden") {
            new_point = {
                "x": current_plot.xScale.invert(c[0]) - 1.73,
                "y": new_point.y,
                "z": new_point.z
            };
            current_plot.manager.plot3.svg.attr("visibility", "visible")
        } else if (current_plot.which_plot == 2 && current_plot.manager.plot1.svg.attr("visibility") == "hidden") {
            new_point = {
                "x": new_point.x,
                "y": new_point.y,
                "z": current_plot.yScale.invert(c[1]) + 0.23
            };
            current_plot.manager.plot1.svg.attr("visibility", "visible")
        } else if (current_plot.which_plot == 2 && current_plot.manager.plot3.svg.attr("visibility") == "hidden") {
            new_point = {
                "x": current_plot.xScale.invert(c[0]) - 1.5,
                "y": new_point.y,
                "z": new_point.z
            };
            current_plot.manager.plot3.svg.attr("visibility", "visible")
        } else if (current_plot.which_plot == 3 && current_plot.manager.plot2.svg.attr("visibility") == "hidden") {
            new_point = {
                "x": new_point.x,
                "y": current_plot.yScale.invert(c[1]) + 1,
                "z": new_point.z
            };
            current_plot.manager.plot2.svg.attr("visibility", "visible")
        } else if (current_plot.which_plot == 3 && current_plot.manager.plot1.svg.attr("visibility") == "hidden") {
            new_point = {
                "x": new_point.x,
                "y": new_point.y,
                "z": current_plot.xScale.invert(c[0]) - 0.50
            };
            current_plot.manager.plot1.svg.attr("visibility", "visible")
        } else {
            alert("error");
        }
        new_point.select = true;
        body_part.push(new_point);
        current_plot.manager.plot1.update();
        current_plot.manager.plot2.update();
        current_plot.manager.plot3.update();

        var s = d3.select("#divList").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        var text = s.selectAll("text").data(new_point).enter().append("text");
        text
            .attr("x", 5)
            .attr("y", function(d, i) {
                return 20 * (i + 1);
            })
            .text(function(d, i) {
                if (i == 0) {
                    return current_plot.xMap(d).toString() + " " + current_plot.yMap(d).toString();
                }
            });
        add_mode = false;
    }
    first_click = !first_click;

}



Plot.prototype.constructor = Plot;
Plot.prototype.update = update;
Plot.prototype.add_point = add_point;