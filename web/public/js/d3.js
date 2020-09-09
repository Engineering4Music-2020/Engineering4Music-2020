fetch("http://localhost:3000/dataJSON").then((result) =>
	result.json().then(function (fetch_result) {
		let data = fetch_result.rows;

		// TURN DATE-STRING INTO DATE-OBJECT

		data.forEach(function (item, index) {
			data[index].date = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(item.date);
		});

		console.log(data);

		// SET DIMENSIONS AND MARGINS OF GRAPH
		var margin = { top: 10, right: 30, bottom: 30, left: 60 },
			width = 1200 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		// APPEND SVG OBJECT TO BODY OF PAGE
		var svg = d3
			.select("#my_dataviz")
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
					return +d.humidity;
				}),
			])
			.range([height, 0]);
		svg.append("g").call(d3.axisLeft(y));

		// ADD LINES
		svg
			.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "darkblue")
			.attr("stroke-width", 1.5)
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

		svg
			.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "lightblue")
			.attr("stroke-width", 1.5)
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
	})
);

// MOCK DATA

// data = [
// 	{
// 		humidity: 50,
// 		temperature: 8,
// 		pressure: 1009,
// 		date: "2020-09-09T00:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-09T01:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 11,
// 		pressure: 1009,
// 		date: "2020-09-09T02:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-09T03:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-09T04:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 13,
// 		pressure: 1009,
// 		date: "2020-09-09T05:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 12,
// 		pressure: 1009,
// 		date: "2020-09-09T06:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 14,
// 		pressure: 1009,
// 		date: "2020-09-09T07:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 18,
// 		pressure: 1009,
// 		date: "2020-09-09T08:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 20,
// 		pressure: 1009,
// 		date: "2020-09-09T09:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 25,
// 		pressure: 1009,
// 		date: "2020-09-09T10:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 75,
// 		temperature: 15,
// 		pressure: 1009,
// 		date: "2020-09-09T11:00:00.000Z",
// 		id: 2,
// 	},
// 	{
// 		humidity: 45,
// 		temperature: 20,
// 		pressure: 1009,
// 		date: "2020-09-09T12:00:00.000Z",
// 		id: 3,
// 	},
// 	{
// 		humidity: 65,
// 		temperature: 35,
// 		pressure: 1009,
// 		date: "2020-09-09T13:00:00.000Z",
// 		id: 4,
// 	},
// 	{
// 		humidity: 55,
// 		temperature: 23,
// 		pressure: 1009,
// 		date: "2020-09-09T14:00:00.000Z",
// 		id: 5,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 22,
// 		pressure: 1009,
// 		date: "2020-09-09T15:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 20,
// 		pressure: 1009,
// 		date: "2020-09-09T16:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 18,
// 		pressure: 1009,
// 		date: "2020-09-09T17:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 30,
// 		pressure: 1009,
// 		date: "2020-09-09T18:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 22,
// 		pressure: 1009,
// 		date: "2020-09-09T19:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 26,
// 		pressure: 1009,
// 		date: "2020-09-09T20:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 14,
// 		pressure: 1009,
// 		date: "2020-09-09T21:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 12,
// 		pressure: 1009,
// 		date: "2020-09-09T22:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-09T23:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 8,
// 		pressure: 1009,
// 		date: "2020-09-10T00:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-10T01:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 11,
// 		pressure: 1009,
// 		date: "2020-09-10T02:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-10T03:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-10T04:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 13,
// 		pressure: 1009,
// 		date: "2020-09-10T05:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 12,
// 		pressure: 1009,
// 		date: "2020-09-10T06:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 14,
// 		pressure: 1009,
// 		date: "2020-09-10T07:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 18,
// 		pressure: 1009,
// 		date: "2020-09-10T08:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 20,
// 		pressure: 1009,
// 		date: "2020-09-10T09:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 50,
// 		temperature: 25,
// 		pressure: 1009,
// 		date: "2020-09-10T10:00:00.000Z",
// 		id: 1,
// 	},
// 	{
// 		humidity: 75,
// 		temperature: 15,
// 		pressure: 1009,
// 		date: "2020-09-10T11:00:00.000Z",
// 		id: 2,
// 	},
// 	{
// 		humidity: 45,
// 		temperature: 20,
// 		pressure: 1009,
// 		date: "2020-09-10T12:00:00.000Z",
// 		id: 3,
// 	},
// 	{
// 		humidity: 65,
// 		temperature: 35,
// 		pressure: 1009,
// 		date: "2020-09-10T13:00:00.000Z",
// 		id: 4,
// 	},
// 	{
// 		humidity: 55,
// 		temperature: 23,
// 		pressure: 1009,
// 		date: "2020-09-10T14:00:00.000Z",
// 		id: 5,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 22,
// 		pressure: 1009,
// 		date: "2020-09-10T15:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 20,
// 		pressure: 1009,
// 		date: "2020-09-10T16:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 18,
// 		pressure: 1009,
// 		date: "2020-09-10T17:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 30,
// 		pressure: 1009,
// 		date: "2020-09-10T18:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 22,
// 		pressure: 1009,
// 		date: "2020-09-10T19:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 26,
// 		pressure: 1009,
// 		date: "2020-09-10T20:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 14,
// 		pressure: 1009,
// 		date: "2020-09-10T21:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 12,
// 		pressure: 1009,
// 		date: "2020-09-10T22:00:00.000Z",
// 		id: 6,
// 	},
// 	{
// 		humidity: 35,
// 		temperature: 10,
// 		pressure: 1009,
// 		date: "2020-09-10T23:00:00.000Z",
// 		id: 6,
// 	},
// ];
