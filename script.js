// General settings
// SVG
var width = document.querySelector("#chart").clientWidth ;
var height = document.querySelector("#chart").clientHeight;
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Chart
var radius = 20;
var circlePadding = 2;
var nodeG = svg.append("g").attr("class", "nodeG");
var nodeParent = nodeG.selectAll(".circleGroup");
var xCenter = [width/4, width * 2.5 / 4];
var yCenter = [height/8, height * 3 / 8, height * 5 / 8, height * 7 / 8];
var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength())
    .force("collide", d3.forceCollide().radius(radius + circlePadding))
    .force("x", d3.forceX().x(function (d) {
        return xCenter[d.xCluster];
    }))
    .force("y", d3.forceY().y(function (d) {
        return yCenter[d.yCluster];
    }))
    .on("tick", ticked);

var colorScale = d3.scaleOrdinal()
    .domain(["Imported", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown", "Berkshire Medical Center"])
    .range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194", "#85bb65"]);

/* ADD A TOOLTIP TO THE NODES */
var tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");

// Legend
var legendWidth = width;
var legendHeight = height/4;
var legendSvg = d3.select(".legend").append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .append("g")
    .attr("id", "legendGroup");

// Slider
var dateSlider = document.querySelector(".date-slider");
var formatTime = d3.timeFormat("%m/%d/%Y");
var dateOutput = document.querySelector(".date-text");
var playButton = d3.select("#play-button").append("text").attr("class", "button-text").text("Play");
var buttonClicked = 0;
var moving = false;
var currentValue, initialValue, targetValue, timeRange, dateToNumberScale;


d3.csv("data/cases_in_NewEngland.csv").then(function (dataset) {

    var initialData = dataset;
    // initial state
    drawPlot(processData(initialData), );
    drawLegend(initialData);


    // Slider
    var sliderData = dataset.map(function (d) {
        if (d.date !== undefined) {
            return d.date;
        }
    })
    sliderData = sliderData.filter(Boolean); 
    sliderData = sliderData.filter(uniqueData);
    sliderData.shift(); 

    dateToNumberScale = d3.scaleOrdinal()
        .domain(sliderData)
        .range(d3.range(0, sliderData.length, 1));


    // custom invert function
    dateToNumberScale.invert = (function () {
        var domain = dateToNumberScale.domain()
        var range = dateToNumberScale.range()
        var scale = d3.scaleOrdinal().domain(range).range(domain);

        return function (x) {
            return scale(x)
        }
    })();

    console.log(sliderData)


    var step = 1;

    var minDate = dateToNumberScale(sliderData[0])
    var maxDate = dateToNumberScale(sliderData[sliderData.length - 1]);

    dateSlider.step = step;
    dateSlider.min = minDate;
    dateSlider.max = maxDate;
    dateSlider.value = maxDate;

    initialValue = d3.min(d3.range(0, sliderData.length, 1));
    targetValue = d3.max(d3.range(0, sliderData.length, 1));

    currentValue = targetValue;
    dateOutput.innerHTML = dateToNumberScale.invert(currentValue);

    dateSlider.oninput = function () {
        buttonClicked++;
        currentValue = +this.value;
        updateData(currentValue, dataset);
    }

    playButton.on("click", function () {

        var button = d3.select(this);
        if (button.text() == "Pause") {
            moving = false;
            clearInterval(timer);

            button.text("Play");
        } else {
            moving = true;
            timer = setInterval(sliderMove, 1000);
            button.text("Pause");
        }
    })

    function sliderMove() {
        buttonClicked++;
        if (buttonClicked == 1) {
            currentValue = 0;
        } else {
            currentValue = currentValue + step;
        }

        if (currentValue > targetValue - 1) {
            moving = false;
            clearInterval(timer);
            playButton.text("Play");
            buttonClicked = 0;
        }

        dateSlider.value = currentValue;
        updateData(currentValue, dataset);

    }


});


function uniqueData(date, index, self) {
    return self.indexOf(date) === index;
}

function updateData(value, data) {

    var filteredData;
    for (var i = 0; i < value + 1; i++) {

        var newData = data.filter(function (d) {
            var sel = dateToNumberScale.invert(i);
            return d.date == sel;
        })

        if (i == 0) {
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
        if (d.case_abbr == "VT" || d.case_abbr == "CT") {
            xi = 0;
        } else {
            xi = 1;
        }

        if (d.case_abbr == "ME"){
            yi = 0;
        }
        else if (d.case_abbr == "VT" || d.case_abbr == "N.H.") {
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
            date: d.date,
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
        .attr("cx", d => Math.max(radius, radius, Math.min(width - radius, d.x)))
        .attr("cy", d => Math.max(radius, Math.min(height - radius, d.y)));

    d3.selectAll(".nodeLabel")
        .attr("x", d => Math.max(radius, radius, Math.min(width - radius, d.x)))
        .attr("y", d => Math.max(radius, Math.min(height - radius, d.y)));

}

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
        .attr("class", "nodeLabel")
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
        .style("pointer-events", "none");

    nodeParent = nodeParentEnter.merge(nodeParent);

    d3.selectAll(".nodeCircle").on("mouseover", function (d) {
        var cx = d.x + 20;
        var cy = d.y + 10;
        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(function () {

                var description =
                    "Location: " + d.location + "</br>" +
                    "Date: " + d.date + "</br>" +
                    "Details: " + d.details;

                return description;

            });


        d3.selectAll(".nodeCircle").attr("opacity", 0.2);

        d3.select(this).attr("opacity", 1);

    }).on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.selectAll(".nodeCircle").attr("opacity", 1);
    });
}

function drawLegend(dataset) {
    // Legend Update
    var legendData = dataset.filter(function (d) {
        return d.infection_type === "" && d.case_abbr !== "";
    })

    var legendCircleRadius = 10;
    var gap = 10;

    var legendText = legendSvg.selectAll(".legendText")
        .data(legendData).enter();

    legendText.append("text")
        .attr("class", "legendText")
        .text(function (d) {
            return d.case_abbr;
        });

    var legendCircle = legendSvg.selectAll("circle")
        .data(legendData).enter()
        .append("circle")
            .attr("r", legendCircleRadius)
            .attr("fill", function (d) {
                return colorScale(d.case_abbr)
            });

    legendCircle
        .attr("cx", 20)
        .attr("cy", function(d, i){

            return i * (gap + 2 * legendCircleRadius) + gap;
        });

    legendText.selectAll(".legendText").attr("x", gap * 4)
    .attr("y", function(d, i){

        return i * (gap + 2 * legendCircleRadius) + gap;
    })

    var legendGroupObj = document.querySelector("#legendGroup");
    var lgdGroupObjWidth = legendGroupObj.getBBox().width;
    legendSvg.attr("transform", `translate(${width / 2 - lgdGroupObjWidth / 2}, 0)`)
}

// make force layout reponsive

resize();
d3.select(window).on("resize", resize);
function resize() {
    width = document.querySelector("#chart").clientWidth, 
    height = document.querySelector("#chart").clientHeight;

    svg.attr("width", width).attr("height", height);

    xCenter = [width / 4, width * 2.5 / 4],
    yCenter = [height / 8, height * 3 / 8, height * 5 / 8, height * 7 / 8];
    simulation
        .force("x", d3.forceX().x(function (d) {
            return xCenter[d.xCluster];
        }))
        .force("y", d3.forceY().y(function (d) {
            return yCenter[d.yCluster];
        })).alpha(1).restart();

    legendWidth = width, legendHeight = height / 4;
    legendSvg 
        .attr("width", legendWidth)
        .attr("height", legendHeight);



}
