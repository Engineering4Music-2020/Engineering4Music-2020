function loadDataDefault() {
	fetch("http://localhost:3000/dataJSONAll").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;
			console.log(data);

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showAllData")
				.setAttribute("class", "button active");
			document.getElementById("showLast24h").setAttribute("class", "button");
			document.getElementById("showLast7d").setAttribute("class", "button");
			document.getElementById("showLast1m").setAttribute("class", "button");

			renderGraph(data);
		})
	);
}

function loadDataLast24h() {
	fetch("http://localhost:3000/dataJSONlast24h").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;
			console.log(data);

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showLast24h")
				.setAttribute("class", "button active");
			document.getElementById("showAllData").setAttribute("class", "button");
			document.getElementById("showLast7d").setAttribute("class", "button");
			document.getElementById("showLast1m").setAttribute("class", "button");

			renderGraph(data);
		})
	);
}
function loadDataLast7d() {
	fetch("http://localhost:3000/dataJSONlast7d").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;
			console.log(data);

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showLast7d")
				.setAttribute("class", "button active");
			document.getElementById("showAllData").setAttribute("class", "button");
			document.getElementById("showLast24h").setAttribute("class", "button");
			document.getElementById("showLast1m").setAttribute("class", "button");

			renderGraph(data);
		})
	);
}
function loadDataLast1m() {
	fetch("http://localhost:3000/dataJSONlast1m").then((result) =>
		result.json().then(function (fetch_result) {
			let data = fetch_result.rows;
			console.log(data);

			// SWITCH BUTTONS ON/OFF
			document
				.getElementById("showLast1m")
				.setAttribute("class", "button active");
			document.getElementById("showAllData").setAttribute("class", "button");
			document.getElementById("showLast24h").setAttribute("class", "button");
			document.getElementById("showLast7d").setAttribute("class", "button");

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
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// APPEND SVG OBJECT TO BODY OF PAGE
	var svg = d3
		.select("#graph-graph")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
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
}

// function toggleTemperature() {
// 	var temperature_line = document.getElementById("temperature-line");
// 	var temperature_label = document.getElementById("temperature-label");
// 	if (temperature_line.style.display === "none") {
// 		temperature_line.style.display = "block";
// 		document.getElementById("toggleTemperature").innerHTML = "Hide Temperature";
// 		document.getElementById("toggleTemperature").style.backgroundColor =
// 			"#501215";
// 		document.getElementById("toggleTemperature").style.color = "#fff";
// 	} else {
// 		temperature_line.style.display = "none";
// 		document.getElementById("toggleTemperature").innerHTML = "Show Temperature";
// 		document.getElementById("toggleTemperature").style.backgroundColor =
// 			"rgb(239, 239, 239)";
// 		document.getElementById("toggleTemperature").style.color = "#000";
// 	}
// 	if (temperature_label.style.display === "none") {
// 		temperature_label.style.display = "block";
// 	} else {
// 		temperature_label.style.display = "none";
// 	}
// }

// function toggleHumidity() {
// 	var humidity_line = document.getElementById("humidity-line");
// 	var humidity_label = document.getElementById("humidity-label");
// 	if (humidity_line.style.display === "none") {
// 		humidity_line.style.display = "block";
// 		document.getElementById("toggleHumidity").innerHTML = "Hide Humidity";
// 		document.getElementById("toggleHumidity").style.backgroundColor = "#fece80";
// 	} else {
// 		humidity_line.style.display = "none";
// 		document.getElementById("toggleHumidity").innerHTML = "Show Humidity";
// 		document.getElementById("toggleHumidity").style.backgroundColor =
// 			"rgb(239, 239, 239)";
// 	}
// 	if (humidity_label.style.display === "none") {
// 		humidity_label.style.display = "block";
// 	} else {
// 		humidity_label.style.display = "none";
// 	}
// }

mock_data = [
	{
		humidity: 50,
		temperature: 8,
		pressure: 1009,
		date: "2020-09-09T00:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-09T01:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 11,
		pressure: 1009,
		date: "2020-09-09T02:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-09T03:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-09T04:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 13,
		pressure: 1009,
		date: "2020-09-09T05:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 12,
		pressure: 1009,
		date: "2020-09-09T06:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 14,
		pressure: 1009,
		date: "2020-09-09T07:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 18,
		pressure: 1009,
		date: "2020-09-09T08:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 20,
		pressure: 1009,
		date: "2020-09-09T09:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 25,
		pressure: 1009,
		date: "2020-09-09T10:00:00.000Z",
		id: 1,
	},
	{
		humidity: 75,
		temperature: 15,
		pressure: 1009,
		date: "2020-09-09T11:00:00.000Z",
		id: 2,
	},
	{
		humidity: 45,
		temperature: 20,
		pressure: 1009,
		date: "2020-09-09T12:00:00.000Z",
		id: 3,
	},
	{
		humidity: 65,
		temperature: 35,
		pressure: 1009,
		date: "2020-09-09T13:00:00.000Z",
		id: 4,
	},
	{
		humidity: 55,
		temperature: 23,
		pressure: 1009,
		date: "2020-09-09T14:00:00.000Z",
		id: 5,
	},
	{
		humidity: 35,
		temperature: 22,
		pressure: 1009,
		date: "2020-09-09T15:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 20,
		pressure: 1009,
		date: "2020-09-09T16:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 18,
		pressure: 1009,
		date: "2020-09-09T17:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 30,
		pressure: 1009,
		date: "2020-09-09T18:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 22,
		pressure: 1009,
		date: "2020-09-09T19:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 26,
		pressure: 1009,
		date: "2020-09-09T20:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 14,
		pressure: 1009,
		date: "2020-09-09T21:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 12,
		pressure: 1009,
		date: "2020-09-09T22:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-09T23:00:00.000Z",
		id: 6,
	},
	{
		humidity: 50,
		temperature: 8,
		pressure: 1009,
		date: "2020-09-10T00:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-10T01:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 11,
		pressure: 1009,
		date: "2020-09-10T02:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-10T03:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-10T04:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 13,
		pressure: 1009,
		date: "2020-09-10T05:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 12,
		pressure: 1009,
		date: "2020-09-10T06:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 14,
		pressure: 1009,
		date: "2020-09-10T07:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 18,
		pressure: 1009,
		date: "2020-09-10T08:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 20,
		pressure: 1009,
		date: "2020-09-10T09:00:00.000Z",
		id: 1,
	},
	{
		humidity: 50,
		temperature: 25,
		pressure: 1009,
		date: "2020-09-10T10:00:00.000Z",
		id: 1,
	},
	{
		humidity: 75,
		temperature: 15,
		pressure: 1009,
		date: "2020-09-10T11:00:00.000Z",
		id: 2,
	},
	{
		humidity: 45,
		temperature: 20,
		pressure: 1009,
		date: "2020-09-10T12:00:00.000Z",
		id: 3,
	},
	{
		humidity: 65,
		temperature: 35,
		pressure: 1009,
		date: "2020-09-10T13:00:00.000Z",
		id: 4,
	},
	{
		humidity: 55,
		temperature: 23,
		pressure: 1009,
		date: "2020-09-10T14:00:00.000Z",
		id: 5,
	},
	{
		humidity: 35,
		temperature: 22,
		pressure: 1009,
		date: "2020-09-10T15:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 20,
		pressure: 1009,
		date: "2020-09-10T16:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 18,
		pressure: 1009,
		date: "2020-09-10T17:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 30,
		pressure: 1009,
		date: "2020-09-10T18:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 22,
		pressure: 1009,
		date: "2020-09-10T19:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 26,
		pressure: 1009,
		date: "2020-09-10T20:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 14,
		pressure: 1009,
		date: "2020-09-10T21:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 12,
		pressure: 1009,
		date: "2020-09-10T22:00:00.000Z",
		id: 6,
	},
	{
		humidity: 35,
		temperature: 10,
		pressure: 1009,
		date: "2020-09-10T23:00:00.000Z",
		id: 6,
	},
];
