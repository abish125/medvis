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
    this.svg = d3.select("#div3Plots").append("svg")
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
            var current_part = body_part[body_part.indexOf(d)]
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
        });
}

var Manager = function() {
    this.plot1 = new Plot(this, 1);
    this.plot2 = new Plot(this, 2);
    this.plot3 = new Plot(this, 3);
    this.spec_list = new Spec_list(this);
    this.org_list = new Org_list(this);
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
    this.spec_list.update();
    this.org_list.update();
}


var Spec_list = function(m) {
    this.manager = m;
    current_object = this
    this.spec_text = spec_svg.selectAll("text");
    this.spec_text.data(specialties).enter().append("text")
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .on("click", function(d) 
        {
            specialties[specialties.indexOf(d)].select = !d.select;
            current_object.update()
        });
}

var updateSpec_list = function()
{
    current_object = this
    this.spec_text = spec_svg.selectAll("text");
    this.spec_text
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .on("click", function(d) 
        {
            specialties[specialties.indexOf(d)].select = !d.select;
            current_object.update()
        });
}

var Org_list = function(m) {
    this.manager = m;
    current_object = this;
    this.org_text = org_svg.selectAll("text");
    this.org_text.data(organs).enter().append("text")
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .on("click", function(d) {
            organs[organs.indexOf(d)].select = !d.select;
            current_object.update()
        });
}

var updateOrg_list = function()
{
    this.org_text = org_svg.selectAll("text");
    this.org_text
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
        .on("click", function(d) {
            organs[organs.indexOf(d)].select = !d.select;
            current_object.update()
        });
}

Manager.prototype.constructor = Manager;
Manager.prototype.add_mode = add_mode;
Manager.prototype.update = updateManager;
//when do you update? 
//Manager.prototype.select_point = select_point;
//Manager.prototype.select_spec = select_spec;
//Manager.prototype.select_org = select_org;

Plot.prototype.constructor = Plot;
Plot.prototype.update = update;

Spec_list.prototype.constructor = Spec_list;
Spec_list.prototype.update = updateSpec_list;

Org_list.prototype.constructor = Org_list;
Org_list.prototype.update = updateOrg_list;