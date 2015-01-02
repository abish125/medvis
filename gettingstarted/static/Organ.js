var Org_list = function(m) {
	 var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 300 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
	
    org_svg = d3.select("#divOrg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + 600 + margin.bottom);

    this.manager = m;
    var current_object = this;
    this.org_text = org_svg.selectAll("text");
    this.org_text.data(organs).enter().append("text")
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
            organs[organs.indexOf(d)].select = !d.select;
            current_object.update();
            if (d.select) {
                selected_orgs.push(d);
            } else {
                selected_orgs.splice(selected_orgs.indexOf(d), 1);
            }
            current_object.manager.select_org();
        });
**/
}


var updateOrg_list = function() {
    var current_object = this;
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
            return get_CSS_Class(d);
        })
        .on("click", function(d) {
            organs[organs.indexOf(d)].select = !d.select;
            current_object.update();
            if (d.select) {
                selected_orgs.push(d);
            } else {
                selected_orgs.splice(selected_orgs.indexOf(d), 1);
            }
            current_object.manager.update();
        });
}

Org_list.prototype.constructor = Org_list;
Org_list.prototype.update = updateOrg_list;