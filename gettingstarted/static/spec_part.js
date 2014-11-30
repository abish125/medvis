var spec_part;
d3.csv("spec_part.csv", function(error, data1) {
      data1.forEach(function(d1) {
        d1.id = +d1.ID;
        d1.spec_id = +d1.Spec_id;
        d1.part_id = +d1.Part_id;
    });
    spec_part = data1;
 });