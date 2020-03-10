d3.csv("data/cases_in_NewEngland.csv", parseCSV).then(function(data) {

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    var radius = 20;

    var nodes = [];
    data.forEach(function(d) {
        var datum = {};
        datum.id = d.id;
        datum.infectedFrom = d.infectedFrom;
        datum.infectionType = d.infectionType;
        datum.name = d.name;
        datum.status = d.status;
        datum.resident = d.resident;
        datum.location = d.location;
        datum.gender = d.gender;
        datum.age = d.age;
        datum.details = d.details;
        nodes.push(datum);
    });


    var links = [];
    for(var i = 0; i < data.length-1; i++) {
        var nodeA = data[i];
        for(var j = i + 1; j < data.length; j++) {
            var nodeB = data[j];
            if(nodeA.name === nodeB.infectedFrom) {
                links.push({source: nodeA.name, target: nodeB.name});
            }
            else if (nodeB.name === nodeA.infectedFrom){
                links.push({source: nodeB.name, target: nodeA.name})
            }

        }
    }

    var colorScale = d3.scaleOrdinal()
        .domain(["Imported", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown"])
        .range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194"]);

    /* INITIALIZE THE FORCE SIMULATION */
    var simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function(d) { return d.name; }))
      .force("charge", d3.forceManyBody().strength(.3))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(radius+10));

    /* DRAW THE LINKS */
    var link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
            .attr("stroke", "#CECECE")
            .attr("stroke-width", 3);

    /* DRAW THE NODES */
    var node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g");
    
    var circle = node.append("circle")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", function(d){
                if(d.infectedFrom === ""){
                    return radius*2/3;
                }
                else{
                    return radius;
                }
            })
            .attr("fill", function(d) {  
                if (d.infectionType === "") {
                    return colorScale(d.name)
                }
                else{
                    return colorScale(d.infectionType);
                }
            });

     var label = node.append("text")
         .text(function (d) {
             if (d.infectionType !== "") {
                 return d.name;
             }
         })
         .attr("dx", -6)
         .style("font-size", "12px")
         .style("pointer-events", "none");

    /* TICK THE SIMULATION */
    simulation.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d){
            var dx = Math.max(radius, radius, Math.min(width - radius, d.x));
            var dy = Math.max(radius, Math.min(height - radius, d.y));
            return `translate(${dx}, ${dy})`
        })

    });


    /* ADD A TOOLTIP TO THE NODES */
    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class","tooltip");

    circle.on("mouseover", function(d) {
        var cx = d.x + 20;
        var cy = d.y - 10;

        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(function(){

                if (d.details === ""){
                    return d.name
                }
                else {
                    return d.details;
                }
            });


        circle.attr("opacity",0.2);
        link.attr("opacity",0.2);

        d3.select(this).attr("opacity",1);

        var connected = link.filter(function(e) {
            return e.source.id === d.id || e.target.id === d.id;
        });
        connected.attr("opacity",1);
        connected.each(function(e) {
            circle.filter(function(f) {
                return f.id === e.source.id || f.id === e.target.id;
            }).attr("opacity",1);
        });

    }).on("mouseout", function() {
        tooltip.style("visibility","hidden");
        circle.attr("opacity",1);
        link.attr("opacity",1);

    });

    
    var legendWidth = width;
    var legendHeight = height/10;
    var legendSvg = d3.select(".legend").append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .append("g")
        .attr("id", "legendGroup");

    var legendData = data.filter(function(d){
        return d.infectionType === "";
    })

    var legendCircleRadius = 10;
    var xGap = 10;
    var yGap = 20;

    var legendText = legendSvg.selectAll(".legendText")
        .data(legendData).enter();

    legendText.append("text")
        .attr("class", "legendText")
        .text(function(d){
            return d.name;
        })
        .attr("y", yGap+5);

    var textGroup = document.getElementsByClassName("legendText");

    var legendCircle = legendSvg.selectAll("circle")
        .data(legendData).enter();

    legendCircle.append("circle")
        .attr("r", legendCircleRadius)
        .attr("fill", function(d){
            return colorScale(d.name)
        })
        .attr("cx", function(d, i){

            if (i==0){
                return i * legendCircleRadius * 5 + xGap;
            }
            else {
                var array = d3.range(0, i, 1);
                var textWidthList = [];
                for (var k = 0; k < array.length ; k++ ){
                    var textWidth = textGroup[k].getBBox().width;
                    textWidthList.push(textWidth);
                }
                textTotalWidth = textWidthList.reduce(function (acc, val) {
                    return acc + val;
                }, 0)
                return (i * legendCircleRadius*5 + xGap) + textTotalWidth;
            }
        })
        .attr("cy", yGap);

        legendText.selectAll(".legendText").attr("x", function (d, i) {

            if (i==0){
                return i * legendCircleRadius * 5 + xGap + 15;
            }
            else {
                var array = d3.range(0, i, 1);
                var textWidthList = [];
                for (var k = 0; k < array.length; k++) {
                    var textWidth = textGroup[k].getBBox().width;
                    textWidthList.push(textWidth);
                }
                textTotalWidth = textWidthList.reduce(function (acc, val) {
                    return acc + val;
                }, 15)
                return (i * legendCircleRadius * 5 + xGap) + textTotalWidth;
            }
        })

    var legendGroupObj = document.querySelector("#legendGroup")
    var lgdGroupObjWidth = legendGroupObj.getBBox().width;
    legendSvg.attr("transform", `translate(${width/2 - lgdGroupObjWidth/2}, 0)`)
    
});


function parseCSV(data) {
    var d = {};
    d.name = data.case_num;
    d.id = +data.index;
    d.infectedFrom = data.infected_from;
    d.infectionType = data.infection_type;
    d.status = data.status;
    d.resident = data.residency;
    d.location = data.location;
    d.gender = data.gender;
    d.age = data.age;
    d.details = data.details;
    d.date = new Date(data.date);

    return d;
}
