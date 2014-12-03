var new_point;

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

    // setup fill color
    var cValue = function(d) {
            return d.Manufacturer;
        },
        color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    this.svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .on("click", function() {
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            current_plot.add_point(coordinates);
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
        .text("Calories");

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
        .text("Protein (g)");

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
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .on("click", function(d) {
            body_part[body_part.indexOf(d)].select = !d.select;
            d3.select(this).classed("selected", d.select);
            p.plot1.update(p);
            p.plot2.update(p);
            p.plot3.update(p);
            if (d.select) {
                selected_parts.push(d);
            } else {
                selected_parts.splice(selected_parts.indexOf(d), 1);
            }
            draw_specialties();
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

    // draw legend
    var legend = this.svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

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
        .text(function(d) {
            return d;
        })
}

var update = function(p) {
    var current_plot = this;
    this.circles
        .attr("r", 3.5)
        .attr("cx", current_plot.xMap)
        .attr("cy", current_plot.yMap)
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .data(body_part)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", current_plot.xMap)
        .attr("cy", current_plot.yMap)
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .on("click", function(d) {
            body_part[body_part.indexOf(d)].select = !d.select;
            d3.select(this).classed("selected", d.select);
            p.plot1.update(p);
            p.plot2.update(p);
            p.plot3.update(p);
            if (d.select) {
                selected_parts.push(d);
            } else {
                selected_parts.splice(selected_parts.indexOf(d), 1);
            }
            draw_specialties();
        })
}

var add_point = function(c) {
    if (add_mode) {
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
            } 
            else if (current_plot.which_plot == 2 && current_plot.manager.plot3.svg.attr("visibility") == "hidden") {
                new_point = {
                    "x": current_plot.xScale.invert(c[0]) - 1.5,
                    "y": new_point.y,
                    "z": new_point.z
                };
                current_plot.manager.plot3.svg.attr("visibility", "visible")
            } 
            else if (current_plot.which_plot == 3 && current_plot.manager.plot2.svg.attr("visibility") == "hidden") {
                new_point = {
                    "x": new_point.x,
                    "y": current_plot.yScale.invert(c[1]) + 1,
                    "z": new_point.z
                };
                current_plot.manager.plot2.svg.attr("visibility", "visible")
            } 
            else if (current_plot.which_plot == 3 && current_plot.manager.plot1.svg.attr("visibility") == "hidden") {
                new_point = {
                    "x": new_point.x,
                    "y": new_point.y,
                    "z": current_plot.xScale.invert(c[0]) - 0.50
                };
                current_plot.manager.plot1.svg.attr("visibility", "visible")
            } 
            else
            {
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
                    //debugger;
                    if (i == 0) {
                        return current_plot.xMap(d).toString() + " " + current_plot.yMap(d).toString();
                    }
                });
            add_mode = false;
        }
        first_click = !first_click;
    }
}

var Manager = function() {
    this.plot1 = new Plot(this, 1);
    this.plot2 = new Plot(this, 2);
    this.plot3 = new Plot(this, 3);
}


var add_mode = function() {
    man = this;
    man.plot1.svg

        .on("click", function() {
        var coordinates = [0, 0];
        coordinates = d3.mouse(this);
        man.plot1.add_point(coordinates);
    });
    man.plot2.svg
        .on("click", function() {
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            man.plot2.add_point(coordinates);
        });
    man.plot3.svg
        .on("click", function() {
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            man.plot3.add_point(coordinates);
        });
}

var updateManager = function() {
    this.plot1.selectAll("circle").data(body_part).enter().append("circle")
    .attr("r", 3.5)
        .attr("cx", this.plot1.xMap)
        .attr("cy", this.plot1.yMap)
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        });
    this.plot2.selectAll("circle").data(body_part).enter().append("circle")
    .attr("r", 3.5)
        .attr("cx", this.plot2.xMap)
        .attr("cy", this.plot2.yMap)
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        });
    this.plot3.selectAll("circle").data(body_part).enter().append("circle")
    .attr("r", 3.5)
        .attr("cx", this.plot3.xMap)
        .attr("cy", this.plot3.yMap)
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        });

    this.plot1.update();
    this.plot2.update();
    this.plot3.update();
}

Manager.prototype.constructor = Manager;
Manager.prototype.add_mode = add_mode;
Manager.prototype.update = updateManager;

Plot.prototype.constructor = Plot;
Plot.prototype.update = update;
Plot.prototype.add_point = add_point;