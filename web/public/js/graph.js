var resizeTimer;
// let data;
let status;
var statusHumidity = 1;
var statusTemperature = 1;

window.addEventListener("resize", function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function () {
		switch (status) {
			case 1:
				loadDataDefault();
				break;
			case 2:
				loadDataLast24h();
				break;
			case 3:
				loadDataLast7d();
				break;
			case 4:
				loadDataLast1m();
				break;
		}
	}, 250);
});

function loadDataDefault() {
	fetch("http://localhost:3000/dataJSONAll").then((result) =>
		result.json().then(function (fetch_result) {
			data = fetch_result.rows;

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showAllData")
				.setAttribute("class", "button active");
			document.getElementById("showLast24h").setAttribute("class", "button");
			document.getElementById("showLast7d").setAttribute("class", "button");
			document.getElementById("showLast1m").setAttribute("class", "button");

			status = 1;

			renderGraph(data);
		})
	);
}

function loadDataLast24h() {
	fetch("https://engineering4music.herokuapp.com/dataJSONlast24h").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showLast24h")
				.setAttribute("class", "button active");
			document.getElementById("showAllData").setAttribute("class", "button");
			document.getElementById("showLast7d").setAttribute("class", "button");
			document.getElementById("showLast1m").setAttribute("class", "button");

			status = 2;

			renderGraph(data);
		})
	);
}
function loadDataLast7d() {
	fetch("https://engineering4music.herokuapp.com/dataJSONlast7d").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showLast7d")
				.setAttribute("class", "button active");
			document.getElementById("showAllData").setAttribute("class", "button");
			document.getElementById("showLast24h").setAttribute("class", "button");
			document.getElementById("showLast1m").setAttribute("class", "button");

			status = 3;

			renderGraph(data);
		})
	);
}
function loadDataLast1m() {
	fetch("https://engineering4music.herokuapp.com/dataJSONlast1m").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showLast1m")
				.setAttribute("class", "button active");
			document.getElementById("showAllData").setAttribute("class", "button");
			document.getElementById("showLast24h").setAttribute("class", "button");
			document.getElementById("showLast7d").setAttribute("class", "button");

			status = 4;

			renderGraph(data);
		})
	);
}

function emptyGraph() {
	// DELETE ALL ELEMENTS WITHIN #graph-graph
	const parent = document.getElementById("graph-graph");
	while (parent.firstChild) {
		parent.firstChild.remove();
	}

	// RESET HEADER & FOOTER OF GRAPH
	d3.select("#date-min").html("");
	d3.select("#date-max").html("");
	d3.select("#temperature-min").html("");
	d3.select("#temperature-max").html("");
	d3.select("#humidity-min").html("");
	d3.select("#humidity-max").html("");
}

function renderGraph(data) {
	// REMOVE ALL DATA
	emptyGraph();

	// TURN DATE-STRING INTO DATE-OBJECT
	data.forEach(function (item, index) {
		data[index].date = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z")(item.date);
	});

	// HEADER: MIN-DATE & MAX-DATE
	d3.select("#raspberry-name").html(data[0].raspberry_name);
	d3.select("#date-min").html(
		d3.min(data, function (d) {
			const datum = d.date;
			return `${datum.toLocaleDateString()}, ${datum.toLocaleTimeString()}`;
		})
	);
	d3.select("#date-max").html(
		d3.max(data, function (d) {
			const datum = d.date;
			return `${datum.toLocaleDateString()}, ${datum.toLocaleTimeString()}`;
		})
	);

	// FOOTER: MIN/MAX TEMPERATURE & HUMIDITY
	d3.select("#temperature-min").html(
		d3.min(data, function (d) {
			return d.temperature;
		})
	);
	d3.select("#temperature-max").html(
		d3.max(data, function (d) {
			return d.temperature;
		})
	);
	d3.select("#humidity-min").html(
		d3.min(data, function (d) {
			return d.humidity;
		})
	);
	d3.select("#humidity-max").html(
		d3.max(data, function (d) {
			return d.humidity;
		})
	);

	// SET DIMENSIONS AND MARGINS OF GRAPH
	var margin = { top: 10, right: 30, bottom: 50, left: 60 },
		width = 0.8 * window.innerWidth - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// APPEND SVG OBJECT TO BODY OF PAGE
	var svg = d3
		.select("#graph-graph")
		.append("svg")
		.attr("id", "graph-svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		// .attr("viewBox", `0 0 800 400`)
		// .attr("preserveAspectRatio", "xMinYMin meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// ADD X-AXIS (date format)
	var x = d3
		.scaleTime()
		.domain(
			d3.extent(data, function (d) {
				return d.date;
			})
		)
		.range([0, width]);
	svg
		.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	// ADD Y-AXIS
	var y = d3
		.scaleLinear()
		.domain([
			0,
			d3.max(data, function (d) {
				return +d.humidity + 10;
			}),
		])
		.range([height, 0]);
	svg.append("g").call(d3.axisLeft(y));

	// ADD LINE (TEMPERATURE)
	svg
		.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "#cb464a")
		.attr("stroke-width", 2.5)
		.attr("id", "temperature-line")
		.attr(
			"d",
			d3
				.line()
				.x(function (d) {
					return x(d.date);
				})
				.y(function (d) {
					return y(d.temperature);
				})
		);

	// ADD LINE (HUMIDITY)
	svg
		.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "#248bcc")
		.attr("stroke-width", 2.5)
		.attr("id", "humidity-line")
		.attr(
			"d",
			d3
				.line()
				.x(function (d) {
					return x(d.date);
				})
				.y(function (d) {
					return y(d.humidity);
				})
		);

	// ADD TOOLTIP
	d3.select("body").append("div").attr("id", "tooltip");

	// ADD POINTS & TOOLTIP-ANIMATION (TEMPERATURE)
	svg
		.selectAll(".dot-temperature")
		.data(data)
		.join("circle")
		.attr("class", "dot-temperature")
		.attr("cx", function (d) {
			return x(d.date);
		})
		.attr("cy", function (d) {
			return y(d.temperature);
		})
		.attr("r", 5)
		.on("mouseover", function (event, datapoint) {
			d3.select("#tooltip")
				.transition()
				.duration(300)
				.style("opacity", 1)
				.text(
					`${datapoint.date.toLocaleDateString()}, ${datapoint.date.toLocaleTimeString()}: ${
						datapoint.temperature
					}°C`
				);
		})
		.on("mouseout", function () {
			d3.select("#tooltip").style("opacity", 0);
		})
		.on("mousemove", function () {
			d3.select("#tooltip")
				.style("left", event.pageX + 10 + "px")
				.style("top", event.pageY + 10 + "px");
		});

	// ADD POINTS & TOOLTIP-ANIMATION (HUMIDITY)
	svg
		.selectAll(".dot-humidity")
		.data(data)
		.join("circle")
		.attr("class", "dot-humidity")
		.attr("cx", function (d) {
			return x(d.date);
		})
		.attr("cy", function (d) {
			return y(d.humidity);
		})
		.attr("r", 5)
		.on("mouseover", function (event, datapoint) {
			d3.select("#tooltip")
				.transition()
				.duration(300)
				.style("opacity", 1)
				.text(
					`${datapoint.date.toLocaleDateString()}, ${datapoint.date.toLocaleTimeString()}: ${
						datapoint.humidity
					}%`
				);
		})
		.on("mouseout", function () {
			d3.select("#tooltip").style("opacity", 0);
		})
		.on("mousemove", function () {
			d3.select("#tooltip")
				.style("left", event.pageX + 10 + "px")
				.style("top", event.pageY + 10 + "px");
		});

	if (statusTemperature === 0) {
		toggleTemperature();
	}
	if (statusHumidity === 0) {
		toggleHumidity();
	}
}

function toggleTemperature() {
	var temperature_line = document.getElementById("temperature-line");
	if (temperature_line.style.display === "none") {
		temperature_line.style.display = "block";
		d3.selectAll(".dot-temperature").style("display", "block");
		statusTemperature = 1;
	} else {
		temperature_line.style.display = "none";
		d3.selectAll(".dot-temperature").style("display", "none");
		statusTemperature = 0;
	}
}

function toggleHumidity() {
	var humidity_line = document.getElementById("humidity-line");
	if (humidity_line.style.display === "none") {
		humidity_line.style.display = "block";
		d3.selectAll(".dot-humidity").style("display", "block");
		statusHumidity = 1;
	} else {
		humidity_line.style.display = "none";
		d3.selectAll(".dot-humidity").style("display", "none");
		statusHumidity = 0;
	}
}
