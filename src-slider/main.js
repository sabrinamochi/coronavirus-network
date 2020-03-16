/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__request__ = __webpack_require__(1);


/* harmony default export */ __webpack_exports__["a"] = (function(defaultMimeType, response) {
  return function(url, callback) {
    var r = Object(__WEBPACK_IMPORTED_MODULE_0__request__["a" /* default */])(url).mimeType(defaultMimeType).response(response);
    if (callback != null) {
      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
      return r.get(callback);
    }
    return r;
  };
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_collection__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_dispatch__ = __webpack_require__(14);



/* harmony default export */ __webpack_exports__["a"] = (function(url, callback) {
  var request,
      event = Object(__WEBPACK_IMPORTED_MODULE_1_d3_dispatch__["a" /* dispatch */])("beforesend", "progress", "load", "error"),
      mimeType,
      headers = Object(__WEBPACK_IMPORTED_MODULE_0_d3_collection__["a" /* map */])(),
      xhr = new XMLHttpRequest,
      user = null,
      password = null,
      response,
      responseType,
      timeout = 0;

  // If IE does not support CORS, use XDomainRequest.
  if (typeof XDomainRequest !== "undefined"
      && !("withCredentials" in xhr)
      && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

  "onload" in xhr
      ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
      : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };

  function respond(o) {
    var status = xhr.status, result;
    if (!status && hasResponse(xhr)
        || status >= 200 && status < 300
        || status === 304) {
      if (response) {
        try {
          result = response.call(request, xhr);
        } catch (e) {
          event.call("error", request, e);
          return;
        }
      } else {
        result = xhr;
      }
      event.call("load", request, result);
    } else {
      event.call("error", request, o);
    }
  }

  xhr.onprogress = function(e) {
    event.call("progress", request, e);
  };

  request = {
    header: function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers.get(name);
      if (value == null) headers.remove(name);
      else headers.set(name, value + "");
      return request;
    },

    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return request;
    },

    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return request;
    },

    timeout: function(value) {
      if (!arguments.length) return timeout;
      timeout = +value;
      return request;
    },

    user: function(value) {
      return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
    },

    password: function(value) {
      return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
    },

    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(value) {
      response = value;
      return request;
    },

    // Alias for send("GET", …).
    get: function(data, callback) {
      return request.send("GET", data, callback);
    },

    // Alias for send("POST", …).
    post: function(data, callback) {
      return request.send("POST", data, callback);
    },

    // If callback is non-null, it will be used for error and load events.
    send: function(method, data, callback) {
      xhr.open(method, url, true, user, password);
      if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
      if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
      if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
      if (responseType != null) xhr.responseType = responseType;
      if (timeout > 0) xhr.timeout = timeout;
      if (callback == null && typeof data === "function") callback = data, data = null;
      if (callback != null && callback.length === 1) callback = fixCallback(callback);
      if (callback != null) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
      event.call("beforesend", request, xhr);
      xhr.send(data == null ? null : data);
      return request;
    },

    abort: function() {
      xhr.abort();
      return request;
    },

    on: function() {
      var value = event.on.apply(event, arguments);
      return value === event ? request : value;
    }
  };

  if (callback != null) {
    if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
    return request.get(callback);
  }

  return request;
});

function fixCallback(callback) {
  return function(error, xhr) {
    callback(error == null ? xhr : null);
  };
}

function hasResponse(xhr) {
  var type = xhr.responseType;
  return type && type !== "text"
      ? xhr.response // null on error
      : xhr.responseText; // "" on error
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return prefix; });
var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

/* harmony default export */ __webpack_exports__["a"] = (map);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "] || \"\"";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

function pad(value, width) {
  var s = value + "", length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6)
    : year > 9999 ? "+" + pad(year, 6)
    : pad(year, 4);
}

function formatDate(date) {
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date"
      : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
      + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
      : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
      : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
      : "");
}

/* harmony default export */ __webpack_exports__["a"] = (function(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // current line number
        t, // current token
        eof = N <= 0, // current token followed by EOF?
        eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i, j = I, c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
        if ((i = I) >= N) eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) row.push(t), t = token();
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function preformatBody(rows, columns) {
    return rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }

  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(value) {
    return value == null ? ""
        : value instanceof Date ? formatDate(value)
        : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
        : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows,
    formatRow: formatRow,
    formatValue: formatValue
  };
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dsv_js__ = __webpack_require__(3);
/* unused harmony reexport dsvFormat */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__csv_js__ = __webpack_require__(21);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__csv_js__["a"]; });
/* unused harmony reexport csvParseRows */
/* unused harmony reexport csvFormat */
/* unused harmony reexport csvFormatBody */
/* unused harmony reexport csvFormatRows */
/* unused harmony reexport csvFormatRow */
/* unused harmony reexport csvFormatValue */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tsv_js__ = __webpack_require__(22);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__tsv_js__["a"]; });
/* unused harmony reexport tsvParseRows */
/* unused harmony reexport tsvFormat */
/* unused harmony reexport tsvFormatBody */
/* unused harmony reexport tsvFormatRows */
/* unused harmony reexport tsvFormatRow */
/* unused harmony reexport tsvFormatValue */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__autoType_js__ = __webpack_require__(23);
/* unused harmony reexport autoType */






/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__request__ = __webpack_require__(1);


/* harmony default export */ __webpack_exports__["a"] = (function(defaultMimeType, parse) {
  return function(url, row, callback) {
    if (arguments.length < 3) callback = row, row = null;
    var r = Object(__WEBPACK_IMPORTED_MODULE_0__request__["a" /* default */])(url).mimeType(defaultMimeType);
    r.row = function(_) { return arguments.length ? r.response(responseOf(parse, row = _)) : row; };
    r.row(row);
    return callback ? r.get(callback) : r;
  };
});

function responseOf(parse, row) {
  return function(request) {
    return parse(request.responseText, row);
  };
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d3Request = __webpack_require__(7);

var chartDiv = d3.select('#chart');

var _chartDiv$node$getBou = chartDiv.node().getBoundingClientRect(),
    width = _chartDiv$node$getBou.width,
    height = _chartDiv$node$getBou.height;

var svg = chartDiv.append("svg").attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]);

var smallScreen = window.innerWidth < 500 ? true : false;

// Chart
var radius = smallScreen ? 12 : 13.5;
var circlePadding = 2;
var nodeG = svg.append("g").attr('class', "nodeG");
var nodeParent = nodeG.selectAll(".circleGroup");
var xCenter = [width / 3, width * 2 / 6, 0.66 * width];
var yCenter = [height / 10, height * 3 / 8, height * 5 / 8, height * 7 / 8];

var forceX = d3.forceX().x(function (d) {
  return xCenter[d.xCluster];
}).strength(0.25);

var forceY = d3.forceY().y(function (d) {
  return yCenter[d.yCluster];
}).strength(0.25);

var forceCollide = d3.forceCollide().radius(radius + circlePadding);
// .strength(0.5)

var charge = d3.forceManyBody().strength(smallScreen ? -90 : -100).distanceMin(2 * radius);

var center = d3.forceCenter().x(width / 2).y(height / 2);

var groupingForce = forceInABox().strength(0.2) // Strength to foci
.template('force') // Either treemap or force
.groupBy('infection_type') // Node attribute to group
.size([width, height]).forceCharge(smallScreen ? -200 : -100);

var colorScale = d3.scaleOrdinal().domain(["Imported", "Saint Raphael Academy Trip to Europe", "Biogen", "Unknown", "Berkshire Medical Center"]).range(["#A62639", "#E0CA3C", "#80a4ed", "#aba194", "#85bb65"]);

/* ADD A TOOLTIP TO THE NODES */
var tooltip = d3.select("#chart").append("div").attr('class', "tooltip bentonsanscond-regular");

var simulation = d3.forceSimulation().velocityDecay(0.7).force('charge', charge).force('collide', forceCollide).force('center', center).force('group', groupingForce).force('x', forceX).force('y', forceY).alphaTarget(0.8).stop();

var nodes = simulation.nodes();

// Slider
var dateSlider = document.querySelector(".date-slider");
var formatTime = d3.timeFormat("%m/%d/%Y");
var dateOutput = document.querySelector(".date-text");
var playButton = d3.select("#play-button").text("Play");
var buttonClicked = 0;
var moving = false;
var currentValue, targetValue, dateToNumberScale, initialData, initialValue;

(0, _d3Request.csv)('assets/cases_in_NewEngland.csv', function (err, dataset) {
  if (err) {
    throw err;
  }
  initialData = dataset;

  initialData.forEach(function (d) {
    d.infection_type.replace('Imported', 'Other source');
  });
  // initial state
  processData(initialData);

  // Slider
  var sliderData = dataset.map(function (d) {
    if (d.date !== "") {
      return d.date;
    }
  });

  sliderData = sliderData.filter(uniqueData);
  var sortedsliderData = sliderData.sort(function (a, b) {
    return new Date(a) - new Date(b);
  });
  sortedsliderData.shift(); // Remove Feb 1


  dateToNumberScale = d3.scaleOrdinal().domain(sortedsliderData).range(d3.range(0, sortedsliderData.length, 1));

  // custom invert function
  dateToNumberScale.invert = function () {
    var domain = dateToNumberScale.domain();
    var range = dateToNumberScale.range();
    var scale = d3.scaleOrdinal().domain(range).range(domain);

    return function (x) {
      return scale(x);
    };
  }();

  var step = 1;
  var timer = void 0;
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
  };

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
    var newData = data.filter(function (d) {
      return d.date === dateToNumberScale.invert(i);
    });

    if (!i) {
      filteredData = newData;
    } else {
      filteredData = filteredData.concat(newData);
    }
  }

  var firstCaseData = data.filter(function (d) {
    return d.date == "2/1/2020" && d.infection_type !== "";
  });
  filteredData = filteredData.concat(firstCaseData);

  processData(filteredData);
  dateOutput.innerHTML = dateToNumberScale.invert(value);
}

var graph;
var selectedData;

function processData(data) {

  selectedData = data.filter(function (d) {
    return d.infection_type !== "";
  });

  selectedData.forEach(function (d) {
    d.id = d.index;
    d.location_num = +d.location_num;

    var xi = void 0,
        yi = void 0;

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
    console.log(d);

    var onlyInNewData = d.filter(comparer(nodes));
    var onlyInCurrent = nodes.filter(comparer(d));

    //initial data length minus one because there's one row with only date and was filtered
    if (onlyInNewData.length == initialData.length - 1 && onlyInCurrent.length == 0) {
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
    } else if (onlyInNewData.length == 0 && onlyInCurrent.length == nodes.length - d.length) {
      nodes = nodes.filter(comparer(onlyInCurrent));
    } else if (onlyInNewData.length > 0 && onlyInCurrent.length == 0 && onlyInNewData.length !== initialData.length - 1) {
      nodes = nodes.concat(onlyInNewData);
    }

    update();
  };

  function comparer(newData) {
    return function (currentData) {
      return newData.filter(function (newD) {
        return newD.id == currentData.id;
      }).length == 0;
    };
  }

  function update() {

    /* DRAW THE NODES */
    nodeParent = nodeParent.data(nodes, function (d) {
      return d.id;
    });

    nodeParent.exit().remove();

    var nodeParentEnter = nodeParent.enter().append("g").attr('class', "circleGroup");

    nodeParentEnter.append("circle").attr('class', "nodeCircle").attr("stroke", "#fff").attr("stroke-width", 1.5).attr("r", radius).attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    }).attr("fill", function (d) {
      return colorScale(d.infection_type);
    });

    nodeParentEnter.append("text").attr('class', "nodeLabel bentonsanscond-regular").text(function (d) {
      return d.case_abbr;
    }).attr("text-anchor", "middle").attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    }).attr("dy", 3).style("font-size", "12px").style("pointer-events", "none");

    nodeParent = nodeParentEnter.merge(nodeParent);

    simulation.nodes(nodes).on("tick", function () {
      d3.selectAll(".nodeCircle").attr("cx", function (d) {
        return Math.max(radius, Math.min(width - radius, d.x));
      }).attr("cy", function (d) {
        return Math.max(radius, Math.min(height - radius, d.y));
      });

      d3.selectAll(".nodeLabel").attr('x', function (d) {
        return Math.max(radius, Math.min(width - radius, d.x));
      }).attr('y', function (d) {
        return Math.max(radius, Math.min(height - radius, d.y));
      });
    });

    simulation.alpha(1).restart();

    d3.selectAll(".nodeCircle").on("mouseover", function (d) {
      var mouseCoords = d3.mouse(this);
      var cx = mouseCoords[0] + 20;
      var cy = mouseCoords[1] - 120;
      var details = d.details.length ? 'Details: ' + d.details : '';
      var description = '\n        Location: ' + d.location + '<br>\n        Case type: ' + (d.case_type.charAt(0).toUpperCase() + d.case_type.slice(1)) + '<br>\n        Date: ' + d.date + '<br>\n        ' + details + '\n      ';

      tooltip.style("visibility", "visible").html(description).style("left", cx + 'px').style("top", mouseCoords[1] - tooltip.node().getBoundingClientRect().height - 20 + "px");

      d3.selectAll(".nodeCircle").attr("opacity", 0.2);

      d3.select(this).attr("opacity", 1).classed('highlight', true);
    }).on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.selectAll(".nodeCircle").attr("opacity", 1).classed('highlight', false);
    });
  };
  update();
}

function resize() {
  var newWidth = chartDiv.node().getBoundingClientRect().width;
  var newHeight = chartDiv.node().getBoundingClientRect().height;

  smallScreen = window.innerWidth < 500 ? true : false;
  radius = smallScreen ? 12 : 13.5;

  console.log(newWidth, newHeight);

  svg.attr('width', newWidth).attr('height', newHeight).attr('viewBox', [0, 0, newWidth, newHeight]);

  var newX = [newWidth / 3, newWidth * 2 / 3];
  var newY = [newHeight / 8, newHeight * 3 / 8, newHeight * 5 / 8, newHeight * 7 / 8];

  forceX.x(function (d) {
    return newX[d.xCluster];
  });

  forceY.y(function (d) {
    return newY[d.yCluster];
  });

  center.x(newWidth / 2).y(newHeight / 2);

  charge.strength(smallScreen ? -90 : -100).distanceMin(2 * radius);

  groupingForce.size([newWidth, newHeight]).forceCharge(smallScreen ? -200 : -100);

  simulation.force('x', forceX).force('y', forceY).force('center', center).force('charge', charge).force('group', groupingForce).alphaTarget(0.8).restart();
}

resize();

d3.select(window).on('resize', resize);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_request__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "request", function() { return __WEBPACK_IMPORTED_MODULE_0__src_request__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_html__ = __webpack_require__(16);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "html", function() { return __WEBPACK_IMPORTED_MODULE_1__src_html__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_json__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "json", function() { return __WEBPACK_IMPORTED_MODULE_2__src_json__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_text__ = __webpack_require__(18);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "text", function() { return __WEBPACK_IMPORTED_MODULE_3__src_text__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_xml__ = __webpack_require__(19);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "xml", function() { return __WEBPACK_IMPORTED_MODULE_4__src_xml__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_csv__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "csv", function() { return __WEBPACK_IMPORTED_MODULE_5__src_csv__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_tsv__ = __webpack_require__(24);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "tsv", function() { return __WEBPACK_IMPORTED_MODULE_6__src_tsv__["a"]; });









/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nest__ = __webpack_require__(9);
/* unused harmony reexport nest */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__set__ = __webpack_require__(10);
/* unused harmony reexport set */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__map__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__keys__ = __webpack_require__(11);
/* unused harmony reexport keys */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__values__ = __webpack_require__(12);
/* unused harmony reexport values */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__entries__ = __webpack_require__(13);
/* unused harmony reexport entries */








/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map__ = __webpack_require__(2);


/* unused harmony default export */ var _unused_webpack_default_export = (function() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = Object(__WEBPACK_IMPORTED_MODULE_0__map__["a" /* default */])(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array, sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();
    else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
});

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__map__["a" /* default */])();
}

function setMap(map, key, value) {
  map.set(key, value);
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map__ = __webpack_require__(2);


function Set() {}

var proto = __WEBPACK_IMPORTED_MODULE_0__map__["a" /* default */].prototype;

Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function(value) {
    value += "";
    this[__WEBPACK_IMPORTED_MODULE_0__map__["b" /* prefix */] + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set;

  // Copy constructor.
  if (object instanceof Set) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

/* unused harmony default export */ var _unused_webpack_default_export = (set);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
});


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(map) {
  var values = [];
  for (var key in map) values.push(map[key]);
  return values;
});


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(map) {
  var entries = [];
  for (var key in map) entries.push({key: key, value: map[key]});
  return entries;
});


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dispatch_js__ = __webpack_require__(15);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__dispatch_js__["a"]; });



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

/* harmony default export */ __webpack_exports__["a"] = (dispatch);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__type__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__type__["a" /* default */])("text/html", function(xhr) {
  return document.createRange().createContextualFragment(xhr.responseText);
}));


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__type__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__type__["a" /* default */])("application/json", function(xhr) {
  return JSON.parse(xhr.responseText);
}));


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__type__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__type__["a" /* default */])("text/plain", function(xhr) {
  return xhr.responseText;
}));


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__type__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__type__["a" /* default */])("application/xml", function(xhr) {
  var xml = xhr.responseXML;
  if (!xml) throw new Error("parse error");
  return xml;
}));


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_dsv__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dsv__ = __webpack_require__(5);



/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1__dsv__["a" /* default */])("text/csv", __WEBPACK_IMPORTED_MODULE_0_d3_dsv__["a" /* csvParse */]));


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return csvParse; });
/* unused harmony export csvParseRows */
/* unused harmony export csvFormat */
/* unused harmony export csvFormatBody */
/* unused harmony export csvFormatRows */
/* unused harmony export csvFormatRow */
/* unused harmony export csvFormatValue */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dsv_js__ = __webpack_require__(3);


var csv = Object(__WEBPACK_IMPORTED_MODULE_0__dsv_js__["a" /* default */])(",");

var csvParse = csv.parse;
var csvParseRows = csv.parseRows;
var csvFormat = csv.format;
var csvFormatBody = csv.formatBody;
var csvFormatRows = csv.formatRows;
var csvFormatRow = csv.formatRow;
var csvFormatValue = csv.formatValue;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return tsvParse; });
/* unused harmony export tsvParseRows */
/* unused harmony export tsvFormat */
/* unused harmony export tsvFormatBody */
/* unused harmony export tsvFormatRows */
/* unused harmony export tsvFormatRow */
/* unused harmony export tsvFormatValue */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dsv_js__ = __webpack_require__(3);


var tsv = Object(__WEBPACK_IMPORTED_MODULE_0__dsv_js__["a" /* default */])("\t");

var tsvParse = tsv.parse;
var tsvParseRows = tsv.parseRows;
var tsvFormat = tsv.format;
var tsvFormatBody = tsv.formatBody;
var tsvFormatRows = tsv.formatRows;
var tsvFormatRow = tsv.formatRow;
var tsvFormatValue = tsv.formatValue;


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function autoType(object) {
  for (var key in object) {
    var value = object[key].trim(), number, m;
    if (!value) value = null;
    else if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (value === "NaN") value = NaN;
    else if (!isNaN(number = +value)) value = number;
    else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
      if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
      value = new Date(value);
    }
    else continue;
    object[key] = value;
  }
  return object;
}

// https://github.com/d3/d3-dsv/issues/45
var fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_dsv__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dsv__ = __webpack_require__(5);



/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1__dsv__["a" /* default */])("text/tab-separated-values", __WEBPACK_IMPORTED_MODULE_0_d3_dsv__["b" /* tsvParse */]));


/***/ })
/******/ ]);