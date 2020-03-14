import { csv } from 'd3-request';

const chartDiv = d3.select('#chart');
const {
  width,
  height
} = chartDiv.node().getBoundingClientRect();

const svg = chartDiv
  .append("svg")
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [0, 0, width, height]);

let smallScreen = window.innerWidth < 500 ? true : false;

// Chart
let radius = smallScreen ? 12 : 13.5;
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
  .strength(smallScreen ? -90 : -100)
  .distanceMin(2 * radius)

const center = d3.forceCenter()
  .x(width / 2)
  .y(height / 2);

const groupingForce = forceInABox()
  .strength(0.2) // Strength to foci
  .template('force') // Either treemap or force
  .groupBy('infection_type') // Node attribute to group
  .size([width, height])
  .forceCharge(smallScreen ? -200 : -100);

const colorScale = d3.scaleOrdinal()
  .domain(["Imported", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown", "Berkshire Medical Center"])
  .range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194", "#85bb65"]);

/* ADD A TOOLTIP TO THE NODES */
const tooltip = d3.select("#chart")
  .append("div")
  .attr('class', "tooltip bentonsanscond-regular");

const simulation = d3.forceSimulation()
  .velocityDecay(0.7)
  .force('charge', charge)
  .force('collide', forceCollide)
  .force('center', center)
  .force('group', groupingForce)
  .force('x', forceX)
  .force('y', forceY)
  .alphaTarget(0.8)
  .stop();

var nodes = simulation.nodes();

// Slider
var dateSlider = document.querySelector(".date-slider");
var formatTime = d3.timeFormat("%m/%d/%Y");
var dateOutput = document.querySelector(".date-text");
var playButton = d3.select("#play-button").text("Play");
var buttonClicked = 0;
var moving = false;
var currentValue, targetValue, dateToNumberScale, initialData, initialValue;

csv('assets/cases_in_NewEngland.csv', (err, dataset) => {
  if (err) {
    throw err;
  }
  initialData = dataset;

  initialData.forEach(function(d){
    d.infection_type.replace('Imported', 'Other source');
  });
  // initial state
  processData(initialData);

    // Slider
    var sliderData = dataset.map(function (d) {
        if (d.date !== "") {
            return (d.date);
        }
    });

    sliderData = sliderData.filter(uniqueData);
    const sortedsliderData = sliderData.sort((a, b) => new Date(a) - new Date(b))
    sortedsliderData.shift(); // Remove Feb 1


    dateToNumberScale = d3.scaleOrdinal()
        .domain(sortedsliderData)
        .range(d3.range(0, sortedsliderData.length, 1));

    // custom invert function
    dateToNumberScale.invert = (function () {
        var domain = dateToNumberScale.domain()
        var range = dateToNumberScale.range()
        var scale = d3.scaleOrdinal()
        .domain(range)
        .range(domain);

        return function (x) {
            return scale(x)
        }
    })();

    var step = 1;
    let timer;
    var minDate = dateToNumberScale(sortedsliderData[0]);
    var maxDate = dateToNumberScale(sortedsliderData[sortedsliderData.length - 1]);

    dateSlider.step = step;
    dateSlider.min = minDate;
    dateSlider.max = maxDate;
    dateSlider.value = maxDate;

    initialValue = d3.min(d3.range(0, sortedsliderData.length, 1));
    targetValue = d3.max(d3.range(0, sortedsliderData.length, 1));

    currentValue = targetValue;
    dateOutput.innerHTML = dateToNumberScale.invert(currentValue);

    dateSlider.oninput = function () {
      buttonClicked++;
      currentValue = +this.value;
      updateData(currentValue, dataset);
    }

    playButton.on("click", function () {
      var button = d3.select(this);
      if (button.text() === "Pause") {
        moving = false;
        clearInterval(timer);
        button.text("Play");
      } else {
        moving = true;
        timer = setInterval(sliderMove, 1000);
        button.text("Pause");
      }
    });

    function sliderMove() {
      buttonClicked++;
      if (buttonClicked === 1) {
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
    var newData = data.filter(d => d.date === dateToNumberScale.invert(i));

    if (!i) {
      filteredData = newData;
    } else {
      filteredData = filteredData.concat(newData);
    }
  }

  var firstCaseData = data.filter(d => d.date == "2/1/2020" && d.infection_type !== "");
  filteredData = filteredData.concat(firstCaseData);

  processData(filteredData);
  dateOutput.innerHTML = dateToNumberScale.invert(value)
}

var graph;
var selectedData;

function processData(data) {

   selectedData = data.filter(d => d.infection_type !== "");

   selectedData.forEach(d => {
     d.id = d.index;
     d.location_num = +d.location_num;

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

    d.xCluster = xi;
    d.yCluster = yi;

   });

  graph = new myGraph("#chart");
  graph.addAndRemoveNode(selectedData);

}

function myGraph() {

  this.addAndRemoveNode = function (d) {
    console.log(d)

        var onlyInNewData = d.filter(comparer(nodes));
        var onlyInCurrent = nodes.filter(comparer(d));

        //initial data length minus one because there's one row with only date and was filtered
        if (onlyInNewData.length == (initialData.length-1) && onlyInCurrent.length == 0) { 
          for (var j = 0; j < d.length; j++) {
            nodes.unshift({
              "xCluster": d[j].xCluster,
              "yCluster": d[j].yCluster,
              "radius": radius,
              "id": d[j].id,
              "case_abbr": d[j].case_abbr,
              "infection_type": d[j].infection_type,
              "location": d[j].location,
              "location_num": d[j].location_num,
              "case_type": d[j].case_type,
              "date": d[j].date,
              "details": d[j].details
            });
          }
        }
        else if (onlyInNewData.length == 0 && onlyInCurrent.length == (nodes.length - d.length)) {
          nodes = nodes.filter(comparer(onlyInCurrent));
        }

        else if (onlyInNewData.length > 0 && onlyInCurrent.length == 0 && onlyInNewData.length !== (initialData.length - 1)) {
          nodes = nodes.concat(onlyInNewData);
        }


    update();
  };

  function comparer(newData) {
    return function(currentData) {
      return newData.filter(function(newD){
        return newD.id == currentData.id
      }).length == 0;
    }
  }


  function update(){
            
  /* DRAW THE NODES */
  nodeParent = nodeParent.data(nodes, d => d.id);

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
      return colorScale(d.infection_type);
    });

  nodeParentEnter.append("text")
    .attr('class', "nodeLabel bentonsanscond-regular")
    .text(function (d) {
        return d.case_abbr;
    })
    .attr("text-anchor", "middle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("dy", 3)
    .style("font-size", "12px")
    .style("pointer-events", "none");

  nodeParent = nodeParentEnter.merge(nodeParent);

   simulation.nodes(nodes).on("tick", function () {
     d3.selectAll(".nodeCircle")
       .attr("cx", d => Math.max(radius, Math.min(width - radius, d.x)))
       .attr("cy", d => Math.max(radius, Math.min(height - radius, d.y)));

     d3.selectAll(".nodeLabel")
       .attr('x', d => Math.max(radius, Math.min(width - radius, d.x)))
       .attr('y', d => Math.max(radius, Math.min(height - radius, d.y)));
   })

   simulation.alpha(1).restart();

  d3.selectAll(".nodeCircle")
    .on("mouseover", function (d) {
      const mouseCoords = d3.mouse(this);
      const cx = mouseCoords[0] + 20;
      const cy = mouseCoords[1] - 120;
      const details = d.details.length ? `Details: ${d.details}` : '';
      const description = `
        Location: ${d.location}<br>
        Case type: ${d.case_type.charAt(0).toUpperCase() + d.case_type.slice(1)}<br>
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
  };
  update();
}



function resize() {
  const newWidth = chartDiv.node().getBoundingClientRect().width;
  const newHeight = chartDiv.node().getBoundingClientRect().height;

  smallScreen = window.innerWidth < 500 ? true : false;
  radius = smallScreen ? 12 : 13.5;

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
    .x(newWidth / 2)
    .y(newHeight / 2);

  charge
    .strength(smallScreen ? -90 : -100)
    .distanceMin(2 * radius);

  groupingForce
    .size([newWidth, newHeight])
    .forceCharge(smallScreen ? -200 : -100);


  simulation
    .force('x', forceX)
    .force('y', forceY)
    .force('center', center)
    .force('charge', charge)
    .force('group', groupingForce)
    .alphaTarget(0.8)
    .restart();
}

resize();

d3.select(window).on('resize', resize);
