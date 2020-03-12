/*eslint-disable*/
import { csv } from 'd3-request';

// General settings
// SVG
var width = document.querySelector("#chart").clientWidth * 0.6;
var height = document.querySelector("#chart").clientHeight;
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

// Chart
var radius = 15;
var circlePadding = 2;
var nodeG = svg.append("g").attr("class", "nodeG");
var nodeParent = nodeG.selectAll(".circleGroup");
var xCenter = [width / 3, width * 2 / 3];
var yCenter = [0, height * 1 / 6, height * 2 / 6, height * 0.5];
var forceX = d3.forceX()
            .x(function (d) { return xCenter[d.xCluster]; })
            .strength(0.25);

var forceY = d3.forceY()
                .y(function (d) {
                    return yCenter[d.yCluster];
                })
                .strength(0.25);

var forceCollide = d3.forceCollide()
                    .radius(radius + circlePadding)
                    .strength(0.7);

var charge = d3.forceManyBody()
                .strength(-80)
                .distanceMin(2 * radius);

var center = d3.forceCenter()
                .x(width / 2)
                .y(height / 2)


var simulation = d3.forceSimulation()
    .velocityDecay(0.8)
    .force("charge", charge)
    .force("collide", forceCollide)
    .force("center", center)
    .force("x", forceX)
    .force("y", forceY)
    .alphaTarget(0.8)
    .on("tick", ticked);

var colorScale = d3.scaleOrdinal()
    .domain(["Other source", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown"])
    .range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194"]);

/* ADD A TOOLTIP TO THE NODES */
var tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip benton-regular");

// Legend
var legendWidth = width;
var legendHeight = height / 10;
var legendSvg = d3.select(".legend").append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .append("g")
    .attr("id", "legendGroup");

// Slider
var dateSlider = document.querySelector(".date-slider");
var formatTime = d3.timeFormat("%m/%d/%Y");
var dateOutput = document.querySelector(".date-text");
var playButton = d3.select("#play-button").text("Play");
var buttonClicked = 0;
var moving = false;
var currentValue, initialValue, targetValue, timeRange, dateToNumberScale;

csv("assets/cases_in_NewEngland.csv", function (err, dataset) {
    if (err) { throw err; }

    var initialData = dataset;

    initialData.forEach(function(d){
        d.infection_type.replace('Imported', 'Other source');
    });
    // initial state
    drawPlot(processData(initialData));


    // Slider
    // var sliderData = dataset.map(function (d) {
    //     if (d.date !== "") {
    //         return d.date;
    //     }
    // });
    // sliderData = sliderData.filter(uniqueData);
    // sliderData.shift(); // Remove Feb 1

    // dateToNumberScale = d3.scaleOrdinal()
    //     .domain(sliderData)
    //     .range(d3.range(0, sliderData.length, 1));


    // // custom invert function
    // dateToNumberScale.invert = (function () {
    //     var domain = dateToNumberScale.domain()
    //     var range = dateToNumberScale.range()
    //     var scale = d3.scaleOrdinal()
    //     .domain(range)
    //     .range(domain);

    //     return function (x) {
    //         return scale(x)
    //     }
    // })();

    // var step = 1;

    // var minDate = dateToNumberScale(sliderData[0]);
    // var maxDate = dateToNumberScale(sliderData[sliderData.length - 1]);

    // dateSlider.step = step;
    // dateSlider.min = minDate;
    // dateSlider.max = maxDate;
    // dateSlider.value = maxDate;

    // initialValue = d3.min(d3.range(0, sliderData.length, 1));
    // targetValue = d3.max(d3.range(0, sliderData.length, 1));

    // currentValue = targetValue;
    // dateOutput.innerHTML = dateToNumberScale.invert(currentValue);

    // dateSlider.oninput = function () {
    //     buttonClicked++;
    //     currentValue = +this.value;
    //     updateData(currentValue, dataset);
    // }

    // playButton.on("click", function () {
    //     var button = d3.select(this);
    //     if (button.text() == "Pause") {
    //         moving = false;
    //         clearInterval(timer);

    //         button.text("Play");
    //     } else {
    //         moving = true;
    //         timer = setInterval(sliderMove, 1000);
    //         button.text("Pause");
    //     }
    // })

    // function sliderMove() {
    //     buttonClicked++;
    //     if (buttonClicked == 1) {
    //         currentValue = 0;
    //     } else {
    //         currentValue = currentValue + step;
    //     }

    //     if (currentValue > targetValue - 1) {
    //         moving = false;
    //         clearInterval(timer);
    //         playButton.text("Play");
    //         buttonClicked = 0;
    //     }

    //     dateSlider.value = currentValue;
    //     updateData(currentValue, dataset);
    // }
});


function uniqueData(date, index, self) {
    return self.indexOf(date) === index;
}

function updateData(value, data) {
    var filteredData;
    for (var i = 0; i < value + 1; i++) {

        var newData = data.filter(function (d) {
            var sel = dateToNumberScale.invert(i);
            return d.date === sel;
        })

        if (i === 0) {
            filteredData = newData;
        } else {
            filteredData = filteredData.concat(newData);
        }
    }
    var firstCaseData = data.filter(function (d) {
        return d.date == "2/1/2020" && d.infection_type !== "";
    })


    filteredData = filteredData.concat(firstCaseData);

    drawPlot(processData(filteredData));
    drawLegend(data)
    dateOutput.innerHTML = dateToNumberScale.invert(value)

}

function processData(data) {
    data = data.filter(function (d) {
        return d.infection_type !== "";
    })

    // var nodesData = [];
    data.forEach(function (d) {
        d.index = +d.index;
        d.location_num = +d.location_num;
    });

    var nodes = data.map(function (d) {
        var xi;
        var yi;
        if (d.case_abbr == "N.H." || d.case_abbr == "MA" || d.case_abbr == "R.I.") {
            xi = 1;
        } else {
            xi = 0;
        }

        if (d.case_abbr == "VT" || d.case_abbr == "N.H.") {
            yi = 1;
        } else if (d.case_abbr == "MA") {
            yi = 2;
        } else if (d.case_abbr == "R.I." || d.case_abbr == "CT") {
            yi = 3;
        }

        var d = {
            xCluster: xi,
            yCluster: yi,
            radius: radius,
            id: d.index,
            name: d.case_abbr,
            type: d.infection_type,
            location: d.location,
            locationNum: d.location_num,
            caseType: d.case_type,
            details: d.details
        };
        return d;
    });
    return nodes;
}


function drawPlot(nodes) {
    drawNodes(nodes);
    /* INITIALIZE THE FORCE SIMULATION */
    simulation.nodes(nodes);
    simulation.alpha(1).restart();
    // updateForce(nodes);
}

function ticked() {
    d3.selectAll(".nodeCircle")
        .attr("cx", function (d) {
            return Math.max(radius, radius, Math.min(width - radius, d.x));
        })
        .attr("cy", function(d) {
            return Math.max(radius, Math.min(height - radius, d.y));
        })

    d3.selectAll(".nodeLabel")
        .attr("x", function (d) {
            return Math.max(radius, radius, Math.min(width - radius, d.x));
        })
        .attr("y", function(d) {
            return Math.max(radius, Math.min(height - radius, d.y));
        })

}

// function updateForce(data){
//     simulation.alpha(1).restart();
//     simulation.force("y").initialize(data);
//     simulation.force("x").initialize(data);

// }

function drawNodes(data) {
    /* DRAW THE NODES */
    nodeParent = nodeParent
        .data(data, function (d) {
            return d.id;
        });

    nodeParent.exit().remove();

    var nodeParentEnter = nodeParent.enter()
        .append("g")
        .attr("class", "circleGroup");

    nodeParentEnter.append("circle")
        .attr("class", "nodeCircle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("r", radius)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", function (d) {
            return colorScale(d.type);
        });

    nodeParentEnter.append("text")
        .attr("class", "nodeLabel benton-regular")
        .text(function (d) {
            if (d.type !== "") {
                return d.name;
            } else {
                return d.name.charAt(0);
            }
        })
        .attr("text-anchor", "middle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("dy", 3)
        .style("font-size", "12px")
        .style("pointer-events", "none");

    nodeParent = nodeParentEnter.merge(nodeParent);

    d3.selectAll(".nodeCircle")
    .on("mouseover", function (d) {
        var mouseCoords = d3.mouse(this);
        var cx = mouseCoords[0] + 20;
        var cy = mouseCoords[1] - 120;

        const details = d.details.length ? `Details: ${d.details}` : '';

        const description = `
          Location: ${d.location}<br>
          Case type: ${d.caseType.charAt(0).toUpperCase() + d.caseType.slice(1)}<br>
          ${details}
        `;

        tooltip.style("visibility", "visible")
            .html(description)
            .style("left", cx + "px")
            .style("top", mouseCoords[1] - tooltip.node().getBoundingClientRect().height - 20 + "px")


        d3.selectAll(".nodeCircle").attr("opacity", 0.2);
        d3.select(this)
        .attr("opacity", 1)
        .classed('highlight', true);

    }).on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.selectAll(".nodeCircle")
            .attr("opacity", 1)
            .classed('highlight', false);
    });
}

function drawLegend(dataset) {
    // Legend Update
    var legendData = dataset.filter(function (d) {
        return d.infection_type === "" && d.case_abbr !== "";
    });
    legendData.forEach(function(leg) {
        leg.case_abbr = leg.case_abbr.replace('Imported', 'Other source');
    });

    var legendCircleRadius = 10;
    var xGap = 10;
    var yGap = 20;

    var legendText = legendSvg.selectAll(".legendText")
        .data(legendData).enter();

    legendText.append("text")
        .attr("class", "legendText")
        .text(function (d) {
            return d.case_abbr;
        })
        .attr("y", yGap + 5);

    var textGroup = document.getElementsByClassName("legendText");

    var legendCircle = legendSvg.selectAll("circle")
        .data(legendData).enter();

    legendCircle.append("circle")
        .attr("r", legendCircleRadius)
        .attr("fill", function (d) {
            return colorScale(d.case_abbr)
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
