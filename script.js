d3.csv("data/cases_in_NewEngland.csv", parseCSV).then(function (dataset) {

    var width = document.querySelector("#chart").clientWidth * 0.6;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    var radius = 20;
    var circlePadding = 15;
   
    var nodeG = svg.append("g").attr("class", "nodeG");

    // Slider
    var sliderData = dataset.map(function (d) {
        if (d.date !== "") {
            return d.date;
        }
    })
    sliderData = sliderData.filter(uniqueData);

    function uniqueData(date, index, self) {
        return self.indexOf(date) === index;
    }

    var minDate = new Date(sliderData[0]).getTime();
    var step_standard = 60 * 60 * 24 * 1000; // 1 day
    var step_daylight = 60 * 60 * 25 * 1000;
    var maxDate = new Date(sliderData[sliderData.length - 1]).getTime();

    var dateSlider = document.querySelector(".date-slider");
    dateSlider.step = step_standard;
    dateSlider.min = minDate;
    dateSlider.max = maxDate + step_standard;
    dateSlider.value = maxDate + step_standard;

    var timeRange = (maxDate - minDate + step_standard) / step_standard;
    timeRange = Math.round(timeRange)+1;

    var dateToNumberScale = d3.scaleTime()
        .domain([new Date(minDate), new Date(maxDate + step_daylight)])
        .range([d3.min(d3.range(0, timeRange, 1)), d3.max(d3.range(0, timeRange, 1))]);

    var formatTime = d3.timeFormat("%m/%d/%Y");
    var dateOutput = document.querySelector(".date-text");
    dateOutput.innerHTML = formatTime(new Date(+dateSlider.value));

    dateSlider.oninput = function () {

        var selectedDate = new Date(+this.value);
        var selectedDateIndex = Math.round(+dateToNumberScale(selectedDate));

        var filtered; 
         for (var i = 0; i < selectedDateIndex+1; i++) {

            var newData = dataset.filter(function (d) {
                var sel = formatTime(dateToNumberScale.invert(i));
                return formatTime(new Date(d.date)) === sel;
            })

            if (i == 0) {
             filtered = newData;
             }

             else {
                 filtered = filtered.concat(newData);
             }

         }

        update(filtered);
        dateOutput.innerHTML = formatTime(selectedDate);

     }

     // Legend
     var legendWidth = width;
     var legendHeight = height / 10;
     var legendSvg = d3.select(".legend").append("svg")
         .attr("width", legendWidth)
         .attr("height", legendHeight)
         .append("g")
         .attr("id", "legendGroup");

    // initial state
    update(dataset);

    function update(updatedData) {

        d3.selectAll("g.nodeG").selectAll("*").remove();

        data = updatedData.filter(function (d) {
            return d.infectionType !== "";
        })

        var nodesData = [];
        data.forEach(function (d) {
            var datum = {};
            datum.id = d.id;
            datum.infectedFrom = d.infectedFrom;
            datum.infectionType = d.infectionType;
            datum.infectionTypeNum = d.infectionTypeNum;
            datum.name = d.name;
            datum.status = d.status;
            datum.resident = d.resident;
            datum.location = d.location;
            datum.gender = d.gender;
            datum.age = d.age;
            datum.caseType = d.caseType;
            datum.details = d.details;
            nodesData.push(datum);
        });

        var clusterNumData = data.map(function(d){
            return d.infectionTypeNum;
        })
        clusterNumData = clusterNumData.filter(uniqueData);
        var clusterNum = clusterNumData.length;

         var colorScale = d3.scaleOrdinal()
             .domain(["Imported", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown"])
             .range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194"]);

        var clusters = new Array(clusterNum);

        var nodes = nodesData.map(function (d) {
            var i = +d.infectionTypeNum,
                r = Math.sqrt((i + 1) / clusterNum * -Math.log(Math.random())) * radius,
                d = {
                    cluster: i,
                    radius: r,
                    x: Math.cos(i / clusterNum * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                    y: Math.sin(i / clusterNum * 2 * Math.PI) * 200 + height / 2 + Math.random(),
                    name: d.name,
                    type: d.infectionType,
                    typeNum: d.infectionTypeNum,
                    from: d.infectedFrom,
                    status:d.status,
                    resident:d.resident,
                    location: d.location,
                    gender: d.gender,
                    age: d.age,
                    caseType:d.caseType,
                    details:d.details
                };
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
        });

        
        /* INITIALIZE THE FORCE SIMULATION */
        var simulation = d3.forceSimulation().nodes(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("cluster", cluster().strength(5))
            .force("collide", d3.forceCollide().radius(radius + circlePadding).strength(0.8))
            .alpha(.5);

        /* DRAW THE NODES */

        var node = nodeG
            .selectAll(".cricleGroup")
            .data(nodes, function(d){
                return d.name;
            });

        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "circleGroup");

        nodeEnter.append("circle")
            .attr("class", "nodeCircle")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", radius)
            .attr("fill", function (d) {
                return colorScale(d.type);
            });

        nodeEnter.append("text")
            .attr("class", "nodeLabel")
            .text(function (d) {
                if (d.type !== "") {
                    return d.name;
                } else {
                    return d.name.charAt(0);
                }
            })
            .attr("text-anchor", "middle")
            .attr("dy", 3)
            .style("font-size", "12px")
            .style("pointer-events", "none");

        node = node.merge(nodeEnter);


        /* TICK THE SIMULATION */
        simulation.on("tick", function () {

                node.attr("transform", function (d) {
                            var dx = Math.max(radius, radius, Math.min(width - radius, d.x));
                            var dy = Math.max(radius, Math.min(height - radius, d.y));
                            return `translate(${dx}, ${dy})`})
        });


        // Move d to be adjacent to the cluster node.
        // from: https://bl.ocks.org/mbostock/7881887
        function cluster() {

            var nodes,
                strength = 0.1;

            function force(alpha) {

                // scale + curve alpha value
                alpha *= strength * alpha;

                nodes.forEach(function (d) {
                    var cluster = clusters[d.cluster];
                    if (cluster === d) return;

                    let x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;

                    if (l != r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                    }
                });

            }

            force.initialize = function (_) {
                nodes = _;
            }

            force.strength = _ => {
                strength = _ == null ? strength : _;
                return force;
            };

            return force;

        }


        /* ADD A TOOLTIP TO THE NODES */
        var tooltip = d3.select("#chart")
            .append("div")
            .attr("class", "tooltip");

        node.selectAll(".nodeCircle").on("mouseover", function (d) {
            var dx = Math.max(radius, radius, Math.min(width - radius, d.x));
            var dy = Math.max(radius, Math.min(height - radius, d.y));
            var cx = dx + 20;
            var cy = dy + 10;


            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(function () {

                    var description = 
                        "Age: " + d.age + "</br>" +
                        "Location: " + d.location + "</br>" +
                        "Case Type: " + d.caseType + " case</br>" +
                        d.details;


                    if (d.details === "") {
                        return d.name
                    } else {
                        return description;
                    }
                });


            node.selectAll(".nodeCircle").attr("opacity", 0.2);


            d3.select(this).attr("opacity", 1);

        }).on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            node.selectAll(".nodeCircle").attr("opacity", 1);
        });

       
        // Legend Update
        var legendData = dataset.filter(function (d) {
            return d.infectionType === "";
        })

        var legendCircleRadius = 10;
        var xGap = 10;
        var yGap = 20;

        var legendText = legendSvg.selectAll(".legendText")
            .data(legendData).enter();

        legendText.append("text")
            .attr("class", "legendText")
            .text(function (d) {
                return d.name;
            })
            .attr("y", yGap + 5);

        var textGroup = document.getElementsByClassName("legendText");

        var legendCircle = legendSvg.selectAll("circle")
            .data(legendData).enter();

        legendCircle.append("circle")
            .attr("r", legendCircleRadius)
            .attr("fill", function (d) {
                return colorScale(d.name)
            })
            .attr("cx", function (d, i) {

                if (i == 0) {
                    return i * legendCircleRadius * 5 + xGap;
                } else {
                    var array = d3.range(0, i, 1);
                    var textWidthList = [];
                    for (var k = 0; k < array.length; k++) {
                        var textWidth = textGroup[k].getBBox().width;
                        textWidthList.push(textWidth);
                    }
                    textTotalWidth = textWidthList.reduce(function (acc, val) {
                        return acc + val;
                    }, 0)
                    return (i * legendCircleRadius * 5 + xGap) + textTotalWidth;
                }
            })
            .attr("cy", yGap);

        legendText.selectAll(".legendText").attr("x", function (d, i) {

            if (i == 0) {
                return i * legendCircleRadius * 5 + xGap + 15;
            } else {
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
        legendSvg.attr("transform", `translate(${width / 2 - lgdGroupObjWidth / 2}, 0)`)
    }
    
});


function parseCSV(data) {
    var d = {};
    d.name = data.case_num;
    d.id = +data.index;
    d.infectedFrom = data.infected_from;
    d.infectionType = data.infection_type;
    d.infectionTypeNum = +data.infection_type_number;
    d.status = data.status;
    d.resident = data.residency;
    d.location = data.location;
    d.gender = data.gender;
    d.age = data.age;
    d.caseType = data.case_type;
    d.details = data.details;
    d.date = data.date;

    return d;
}
