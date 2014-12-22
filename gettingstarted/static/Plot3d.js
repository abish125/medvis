var Plot3d = function(parent, body_part) {

    var margin = {
            top: 0,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 300 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    this.body_part = body_part;

    this.x3d = parent
        .append("x3d")
        .style("width", parseInt(parent.style("width")) + "px")
        .style("height", parseInt(parent.style("height")) + "px")
        .style("border", "none")

    this.scene = this.x3d.append("scene");

    this.scene.append("orthoviewpoint")
        .attr("centerOfRotation", [5, 5, 5])
        .attr("fieldOfView", [-5, -5, 15, 15])
        .attr("orientation", [-0.5, 1, 0.2, 1.12 * Math.PI / 4])
        .attr("position", [8, 4, 15])


    this.axisRange = [0, 10];
    this.scales = [];
    this.initialDuration = 0;
    this.defaultDuration = 800;
    this.ease = 'linear';
    this.time = 0;
    this.axisKeys = ["x", "y", "z"];
}

var axisName = function(name, axisIndex) {
    return ['x', 'y', 'z'][axisIndex] + name;
}

var updateData = function() {
    p3d.time += Math.PI / 8;
    if (this.p3d.x3d.node() && this.p3d.x3d.node().runtime) {
        /**for (var r=0; r<rows.length; ++r) {
          var x = rows[r].x;
          var z = rows[r].z;
          rows[r].y = 5*( Math.sin(0.5*x + time) * Math.cos(0.25*z + time));
        }**/
        p3d.plotData(p3d.defaultDuration);
    } else {
        console.log('x3d not ready.');
    }
}

var plotData = function(duration) {
    if (!body_part) {
        console.log("no rows to plot.")
        return;
    }

    var x = p3d.scales[0],
        y = p3d.scales[1],
        z = p3d.scales[2];
    var sphereRadius = 0.2;

    // Draw a sphere at each x,y,z coordinate.
    var datapoints = p3d.scene.selectAll(".datapoint").data(body_part);
    datapoints.exit().remove()

    var newDatapoints = datapoints.enter()
        .append("transform")
        .attr("class", "datapoint")
        .attr("scale", [sphereRadius, sphereRadius, sphereRadius])
        .attr("string", "hello")
        .append("shape")
    newDatapoints
        .append("appearance")
        .append("material");
    newDatapoints
        .append("sphere")
        .append("x3d:text")
        .attr("text", "hello")
        // Does not work on Chrome; use transform instead
        //.attr("radius", sphereRadius)

    datapoints.selectAll("shape appearance material")
        .attr("diffuseColor", function(d) {
            if (d.select) {
                return 'red';
            } else {
                return 'steelblue';
            }
        })

    datapoints.transition().ease(p3d.ease).duration(duration)
        .attr("translation", function(row) {
            return x(row[p3d.axisKeys[0]]) + " " + y(row[p3d.axisKeys[1]]) + " " + z(row[p3d.axisKeys[2]])
        })

    // Draw a stem from the x-z plane to each sphere at elevation y.
    // plot3d convention was chosen to be consistent with x3d primitive ElevationGrid. 

    var stems = p3d.scene.selectAll(".stem").data(body_part);
    stems.exit().remove();
    var newStems = stems.enter()
        .append("transform")
        .attr("class", "stem")
        .append("shape");
    newStems
        .append("appearance")
        .append("material")
        .attr("emissiveColor", "gray")
    newStems
        .append("polyline2d")
        .attr("lineSegments", function(row) {
            return "0 1, 0 0";
        })
}

// Assign key to axis, creating or updating its ticks, grid lines, and labels.
var drawAxis = function(axisIndex, key, duration) {

    var scale = d3.scale.linear()
        .domain([-5, 5]) // demo data range
        .range(p3d.axisRange)

    p3d.scales[axisIndex] = scale;

    var numTicks = 8;
    var tickSize = 0.1;
    var tickFontSize = 0.5;

    // ticks along each axis
    var ticks = p3d.scene.selectAll("." + axisName("Tick", axisIndex))
        .data(scale.ticks(numTicks));
    var newTicks = ticks.enter()
        .append("transform")
        .attr("class", axisName("Tick", axisIndex));
    newTicks.append("shape").call(makeSolid)
        .append("box")
        .attr("size", tickSize + " " + tickSize + " " + tickSize);
    // enter + update
    ticks.transition().duration(duration)
        .attr("translation", function(tick) {
            return constVecWithAxisValue(0, scale(tick), axisIndex);
        })
    ticks.exit().remove();

    // tick labels
    var tickLabels = ticks.selectAll("billboard shape text")
        .data(function(d) {
            return [d];
        });
    var newTickLabels = tickLabels.enter()
        .append("billboard")
        .attr("axisOfRotation", "0 0 0")
        .append("shape")
        .call(makeSolid)
    newTickLabels.append("text")
        .attr("string", scale.tickFormat(10))
        .attr("solid", "true")
        .append("fontstyle")
        .attr("size", tickFontSize)
        .attr("family", "SANS")
        .attr("justify", "END MIDDLE");
    tickLabels // enter + update
        .attr("string", scale.tickFormat(10))
    tickLabels.exit().remove();

    // base grid lines
    if (axisIndex == 0 || axisIndex == 2) {

        var gridLines = p3d.scene.selectAll("." + axisName("GridLine", axisIndex))
            .data(scale.ticks(numTicks));
        gridLines.exit().remove();

        var newGridLines = gridLines.enter()
            .append("transform")
            .attr("class", axisName("GridLine", axisIndex))
            .attr("rotation", axisIndex == 0 ? [0, 1, 0, -Math.PI / 2] : [0, 0, 0, 0])
            .append("shape")

        newGridLines.append("appearance")
            .append("material")
            .attr("emissiveColor", "gray")
        newGridLines.append("polyline2d");

        gridLines.selectAll("shape polyline2d").transition().duration(duration)
            .attr("lineSegments", "0 0, " + p3d.axisRange[1] + " 0")

        gridLines.transition().duration(duration)
            .attr("translation", axisIndex == 0 ? function(d) {
                return scale(d) + " 0 0";
            } : function(d) {
                return "0 0 " + scale(d);
            })
    }
}

var initializeAxis = function(axisIndex) {

    var key = p3d.axisKeys[axisIndex];
    p3d.drawAxis(axisIndex, key, p3d.initialDuration);

    var scaleMin = p3d.axisRange[0];
    var scaleMax = p3d.axisRange[1];

    // the axis line
    var newAxisLine = p3d.scene.append("transform")
        .attr("class", axisName("Axis", axisIndex))
        .attr("rotation", ([
            [0, 0, 0, 0],
            [0, 0, 1, Math.PI / 2],
            [0, 1, 0, -Math.PI / 2]
        ][axisIndex]))
        .append("shape")
    newAxisLine
        .append("appearance")
        .append("material")
        .attr("emissiveColor", "lightgray")
    newAxisLine
        .append("polyline2d")
        // Line drawn along y axis does not render in Firefox, so draw one
        // along the x axis instead and rotate it (above).
        .attr("lineSegments", "0 0," + scaleMax + " 0")

    // axis labels
    var newAxisLabel = p3d.scene.append("transform")
        .attr("class", p3d.axisName("AxisLabel", axisIndex))
        .attr("translation", constVecWithAxisValue(0, scaleMin + 1.1 * (scaleMax - scaleMin), axisIndex))

    var newAxisLabelShape = newAxisLabel
        .append("billboard")
        .attr("axisOfRotation", "0 0 0") // face viewer
        .append("shape")
        .call(makeSolid)

    var labelFontSize = 0.6;

    newAxisLabelShape
        .append("text")
        .attr("class", axisName("AxisLabelText", axisIndex))
        .attr("solid", "true")
        .attr("string", key)
        .append("fontstyle")
        .attr("size", labelFontSize)
        .attr("family", "SANS")
        .attr("justify", "END MIDDLE")

}

var constVecWithAxisValue = function(otherValue, axisValue, axisIndex) {

    var result = [otherValue, otherValue, otherValue];
    result[axisIndex] = axisValue;
    return result;
}

// Initialize the axes lines and labels.
var initializePlot = function() {

    p3d.initializeAxis(0);
    p3d.initializeAxis(1);
    p3d.initializeAxis(2);
}

// Used to make 2d elements visible
var makeSolid = function(selection, color) {

    selection.append("appearance")
        .append("material")
        .attr("diffuseColor", color || "black")
    return selection;
}


Plot3d.prototype.constructor = Plot3d;
Plot3d.prototype.axisName = axisName;
Plot3d.prototype.updateData = updateData;
Plot3d.prototype.plotData = plotData;
Plot3d.prototype.drawAxis = drawAxis;
Plot3d.prototype.initializeAxis = initializeAxis;
Plot3d.prototype.constVecWithAxisValue = constVecWithAxisValue;
Plot3d.prototype.initializePlot = initializePlot;
Plot3d.prototype.makeSolid = makeSolid;
Plot3d.prototype.run = run;