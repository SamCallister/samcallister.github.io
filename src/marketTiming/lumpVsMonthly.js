import * as science from 'science';
import * as d3 from 'd3';
import { map, partial, first, last, concat } from 'lodash';
import util from './util';

const margin = {
	top: 44,
	right: 48,
	bottom: 50,
	left: 66
};

const formatPercent = (v) => {
	return d3.format(".0%")(v / 100);
}

function draw(opts) {
	const {
		svg,
		lumpIntervalData,
		monthlyIntervalData,
		priceData,
		width,
		height,
		yearInterval
	} = opts;

	const combinedArrays = concat(lumpIntervalData, monthlyIntervalData);

	const numberOfIntervals = combinedArrays.length;

	const lumpKDE = science.stats.kde().sample(map(lumpIntervalData, (d) => d.percentReturn));
	const monthlyKDE = science.stats.kde().sample(map(monthlyIntervalData, (d) => d.percentReturn));

	// setup xscale
	const x = d3.scaleLinear()
		.domain(d3.extent(combinedArrays, (d) => d.percentReturn)).nice()
		.range([margin.left, width - margin.right]);

	// d3.extent(map(lumpIntervalData, (d) => d.percentReturn));
	const [lumpStart, lumpStop] = x.domain();
	const lumpKDEValues = lumpKDE.bandwidth(science.stats.bandwidth.nrd)(
		d3.range(lumpStart, lumpStop, 1)
	);

	// d3.extent(map(monthlyIntervalData, (d) => d.percentReturn));
	const [monthlyStart, monthlyStop] = x.domain();
	const monthlyKDEValues = monthlyKDE.bandwidth(science.stats.bandwidth.nrd)(
		d3.range(monthlyStart, monthlyStop, 1)
	);

	// setup yscale
	const y = d3.scaleLinear()
		.domain(
			d3.extent(map(
				concat(lumpKDEValues, monthlyKDEValues),
				(d) => d[1]
			)
			)
		).nice()
		.range([height - margin.bottom, margin.top]);


	// add xaxis
	util.drawOrUpdateAxis(
		svg,
		"xaxis",
		`translate(0,${height - margin.bottom})`,
		d3.axisBottom(x).tickFormat(formatPercent).ticks(5),
		partial(util.addXAxisLabel, svg, "Percent Return Bucket", margin, width, height)
	);

	// add yaxis
	util.drawOrUpdateAxis(
		svg,
		"yaxis",
		`translate(${margin.left},0)`,
		d3.axisLeft(y).tickFormat(d3.format("0.1%")).ticks(5),
		partial(util.addYAxisLabel, svg, "Percentage of Intervals", margin, height)
	);

	// line generator
	const lineGen = d3.line()
		.x(function (d) { return x(d[0]); })
		.y(function (d) { return y(d[1]); })
		.curve(d3.curveMonotoneX);


	svg.selectAll(".kde-line").remove();
	const paths = svg.append("g")
		.attr("class", "kde-line")
		.selectAll("path")
		.data([lumpKDEValues, monthlyKDEValues])
		.enter().append("path")
		.attr("stroke", (_, i) => d3.schemeCategory10[i])
		.attr("d", function (d) {
			return lineGen(d);
		});

	paths
		.attr("stroke-dasharray", (_, i) => {
			const totalLineLength = paths.nodes()[i].getTotalLength();
			return totalLineLength + " " + totalLineLength
		})
		.attr("stroke-dashoffset", (_, i) => {
			return paths.nodes()[i].getTotalLength();
		})
		.transition(d3.easeLinear)
		.duration(util.animationDuration)
		.attr("stroke-dashoffset", 0)

	svg.select(".title-group").remove();
	const titleGroup = svg.append("g")
		.attr("class", "title-group")
		.attr("transform", `translate(${width / 2}, 20)`);

	// top title text
	titleGroup.append("text")
		.attr('class', 'title-text')
		.text("Lump vs Monthly S&P Index Performance");

	// bottom title text
	titleGroup.append("text")
		.attr("y", 15)
		.attr("class", "interval-text")
		.text(`Considering all ${numberOfIntervals} ${yearInterval}-year intervals between ${util.monthYearFormat(first(priceData).Date)} and ${util.monthYearFormat(last(priceData).Date)}`)

	// add legend
	svg.selectAll('.legend-group').remove();
	const legendGroup = svg.append('g')
		.attr("class", 'legend-group')
		.attr("transform", `translate(${x.range()[1] - 50},${y.range()[1] + 10})`);

	const enteredLegendGroup = legendGroup.selectAll("g")
		.data(["lump", "monthly"])
		.enter();

	enteredLegendGroup.append("text")
		.attr("y", (_, i) => i * 15)
		.attr("fill", (_, i) => d3.schemeCategory10[i])
		.text((d) => d);

	enteredLegendGroup.append("line")
		.attr("x1", -10)
		.attr("x2", -2)
		.attr("y1", (_, i) => (i * 15) - 4)
		.attr("y2", (_, i) => (i * 15) - 4)
		.attr("stroke", (_, i) => d3.schemeCategory10[i]);


}

export default {
	draw
}