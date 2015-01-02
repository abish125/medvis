var Spec_list = function(m) {
	 var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 300 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
	
    spec_svg = d3.select("#divSpec").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + 600 + margin.bottom);

    this.manager = m;
    var current_object = this;
    this.spec_text = spec_svg.selectAll("text");
    this.spec_text.data(specialties).enter().append("text");
    this.update();

    /**
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            return get_CSS_Class(d);
        })
        .on("click", function(d) {
            specialties[specialties.indexOf(d)].select = !d.select;
            current_object.update();
            if (d.select) {
                selected_specs.push(d);
            } else {
                selected_specs.splice(selected_specs.indexOf(d), 1);
            }
            current_object.manager.select_spec();
        });
**/
}

var updateSpec_list = function() {
    var current_object = this;
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
            return get_CSS_Class(d);
        })
        .on("click", function(d) {
            specialties[specialties.indexOf(d)].select = !d.select;
            current_object.update();
            if (d.select) {
                selected_specs.push(d);
            } else {
                selected_specs.splice(selected_specs.indexOf(d), 1);
            }
            current_object.manager.update();
        });
}


Spec_list.prototype.constructor = Spec_list;
Spec_list.prototype.update = updateSpec_list;