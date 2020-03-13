import { csv } from 'd3-request';

const chartDiv = d3.select('#chart');
const { width, height } = chartDiv.node().getBoundingClientRect();

const svg = chartDiv
  .append("svg")
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [0, 0, width, height]);

const smallScreen = window.innerWidth < 500 ? true : false;

// Chart
const radius = smallScreen ? 12 : 13.5;
const circlePadding = 2;
const nodeG = svg.append("g").attr('class', "nodeG");
var nodeParent = nodeG.selectAll(".circleGroup");
const xCenter = [width / 3, width * 2 / 6, 0.66 * width];
const yCenter = [height / 10, height * 3 / 8, height * 5 / 8, height * 7 / 8];

const forceX = d3.forceX()
  .x(d => xCenter[d.xCluster])
  .strength(0.25);

const forceY = d3.forceY()
  .y(d => yCenter[d.yCluster])
  .strength(0.25);

const forceCollide = d3.forceCollide()
  .radius(radius + circlePadding)
  // .strength(0.5)

const charge = d3.forceManyBody()
  .strength(smallScreen ? -90 : -130)
  .distanceMin(2 * radius)

const center = d3.forceCenter()
  .x(width / 2)
  .y(height / 2);

const groupingForce = forceInABox()
  .strength(0.2) // Strength to foci
  .template('force') // Either treemap or force
  .groupBy('type') // Node attribute to group
  .size([width, height])
  .forceCharge(smallScreen ? -200 : -80);

const simulation = d3.forceSimulation()
  .velocityDecay(0.7)
  .force('charge', charge)
  .force('collide', forceCollide)
  .force('center', center)
  .force('group', groupingForce)
  // .force('x', forceX)
  // .force('y', forceY)
  // .alphaTarget(0.8)
  .stop()
  // .on('tick', ticked);

const colorScale = d3.scaleOrdinal()
  .domain(["Imported", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown", "Berkshire Medical Center"])
  .range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194", "#85bb65"]);

/* ADD A TOOLTIP TO THE NODES */
const tooltip = d3.select("#chart")
  .append("div")
  .attr('class', "tooltip bentonsanscond-regular");

// Slider
var dateSlider = document.querySelector(".date-slider");
var formatTime = d3.timeFormat("%m/%d/%Y");
var dateOutput = document.querySelector(".date-text");
var playButton = d3.select("#play-button").text("Play");
var buttonClicked = 0;
var moving = false;
var currentValue, initialValue, targetValue, timeRange, dateToNumberScale;

csv('assets/cases_in_NewEngland.csv', (err, dataset) => {
  if (err) {
    throw err;
  }
  const initialData = dataset;

  initialData.forEach(function(d){
    d.infection_type.replace('Imported', 'Other source');
  });
  // initial state
  drawPlot(processData(initialData));

  //   // Slider
  //   var sliderData = dataset.map(function (d) {
  //       if (d.date !== "") {
  //           return d.date;
  //       }
  //   });
  //   sliderData = sliderData.filter(uniqueData);
  //   sliderData.shift(); // Remove Feb 1

  //   dateToNumberScale = d3.scaleOrdinal()
  //       .domain(sliderData)
  //       .range(d3.range(0, sliderData.length, 1));

  //   // custom invert function
  //   dateToNumberScale.invert = (function () {
  //       var domain = dateToNumberScale.domain()
  //       var range = dateToNumberScale.range()
  //       var scale = d3.scaleOrdinal()
  //       .domain(range)
  //       .range(domain);

  //       return function (x) {
  //           return scale(x)
  //       }
  //   })();

  //   var step = 1;
  //   let timer;
  //   var minDate = dateToNumberScale(sliderData[0]);
  //   var maxDate = dateToNumberScale(sliderData[sliderData.length - 1]);

  //   dateSlider.step = step;
  //   dateSlider.min = minDate;
  //   dateSlider.max = maxDate;
  //   dateSlider.value = maxDate;

  //   initialValue = d3.min(d3.range(0, sliderData.length, 1));
  //   targetValue = d3.max(d3.range(0, sliderData.length, 1));

  //   currentValue = targetValue;
  //   dateOutput.innerHTML = dateToNumberScale.invert(currentValue);

  //   dateSlider.oninput = function () {
  //     buttonClicked++;
  //     currentValue = +this.value;
  //     updateData(currentValue, dataset);
  //   }

  //   playButton.on("click", function () {
  //     var button = d3.select(this);
  //     if (button.text() === "Pause") {
  //       moving = false;
  //       clearInterval(timer);
  //       button.text("Play");
  //     } else {
  //       moving = true;
  //       timer = setInterval(sliderMove, 1000);
  //       button.text("Pause");
  //     }
  //   });

  //   function sliderMove() {
  //     buttonClicked++;
  //     if (buttonClicked === 1) {
  //       currentValue = 0;
  //     } else {
  //       currentValue = currentValue + step;
  //     }

  //     if (currentValue > targetValue - 1) {
  //       moving = false;
  //       clearInterval(timer);
  //       playButton.text("Play");
  //       buttonClicked = 0;
  //     }

  //     dateSlider.value = currentValue;
  //     updateData(currentValue, dataset);
  //   }
});

function updateData(value, data) {
  var filteredData;
  for (var i = 0; i < value + 1; i++) {
    var newData = data.filter(d => d.date === dateToNumberScale.invert(i));

    if (!i) {
      filteredData = newData;
    } else {
      filteredData = filteredData.concat(newData);
    }
  }

  var firstCaseData = data.filter(d => d.date == "2/1/2020" && d.infection_type !== "");
  filteredData = filteredData.concat(firstCaseData);

  drawPlot(processData(filteredData));
  dateOutput.innerHTML = dateToNumberScale.invert(value)
}

function processData(data) {
  data = data.filter(d => d.infection_type !== "");

  data.forEach(d => {
    d.index = +d.index;
    d.location_num = +d.location_num;
  });

  const nodes = data.map((d) => {
    let xi, yi;

    if (d.case_abbr === "VT" || d.case_abbr === "CT") {
      xi = 0;
    } else {
      xi = 1;
    }

    if (d.case_abbr === "ME") {
      xi = 1;
      yi = 0;
    } else if (d.case_abbr === "VT" || d.case_abbr === "N.H.") {
      yi = 1;
    } else if (d.case_abbr === "MA") {
      yi = 2;
    } else if (d.case_abbr === "R.I." || d.case_abbr === "CT") {
      yi = 3;
    }

    return {
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

    }
  });
  console.log(nodes);
  return nodes;
}


function drawPlot(nodes) {
  drawNodes(nodes);
  /* INITIALIZE THE FORCE SIMULATION */
  simulation.nodes(nodes);

  simulation.tick(300);
  ticked();
  // simulation.alpha(1).restart();
}

function ticked() {
  d3.selectAll(".nodeCircle")
    .attr("cx", d => Math.max(radius, Math.min(width - radius, d.x)))
    .attr("cy", d => Math.max(radius, Math.min(height - radius, d.y)));

  d3.selectAll(".nodeLabel")
    .attr('x', d => Math.max(radius, Math.min(width - radius, d.x)))
    .attr('y', d => Math.max(radius, Math.min(height - radius, d.y)));
}

function drawNodes(data) {
  /* DRAW THE NODES */
  nodeParent = nodeParent.data(data, d => d.id);

  nodeParent.exit().remove();

  var nodeParentEnter = nodeParent.enter()
    .append("g")
    .attr('class', "circleGroup");

  nodeParentEnter.append("circle")
    .attr('class', "nodeCircle")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("r", radius)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", function (d) {
      return colorScale(d.type);
    });

  nodeParentEnter.append("text")
    .attr('class', "nodeLabel bentonsanscond-regular")
    .text(function (d) {
      if (d.type !== "") {
        return d.name;
      }
      return d.name.charAt(0);
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
      const mouseCoords = d3.mouse(this);
      const cx = mouseCoords[0] + 20;
      const cy = mouseCoords[1] - 120;
      const details = d.details.length ? `Details: ${d.details}` : '';
      const description = `
        Location: ${d.location}<br>
        Case type: ${d.caseType.charAt(0).toUpperCase() + d.caseType.slice(1)}<br>
        Date: ${d.date}<br>
        ${details}
      `;

      tooltip.style("visibility", "visible")
        .html(description)
        .style("left", `${cx}px`)
        .style("top", mouseCoords[1] - tooltip.node().getBoundingClientRect().height - 20 + "px")

      d3.selectAll(".nodeCircle").attr("opacity", 0.2);

      d3.select(this)
        .attr("opacity", 1)
        .classed('highlight', true);
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.selectAll(".nodeCircle")
        .attr("opacity", 1)
        .classed('highlight', false);
    });
}

function resize() {
  const newWidth = chartDiv.node().getBoundingClientRect().width;
  const newHeight = chartDiv.node().getBoundingClientRect().height;

  console.log(newWidth, newHeight)

  svg.attr('width', newWidth)
    .attr('height', newHeight)
    .attr('viewBox', [0, 0, newWidth, newHeight]);

  const newX = [newWidth / 3, newWidth * 2 / 3];
  const newY = [newHeight / 8, newHeight * 3 / 8, newHeight * 5 / 8, newHeight * 7 / 8];

  forceX
    .x(d => newX[d.xCluster]);

  forceY
    .y(d => newY[d.yCluster]);

  center
    .x(width / 2)
    .y(height / 2);

  simulation
    .force('x', forceX)
    .force('y', forceY)
    .force('center', center)
    .alphaTarget(0.8)
    .restart();
}

resize();

d3.select(window).on('resize', resize);
