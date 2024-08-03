import * as d3 from 'd3';
import { map, partial, first, last } from 'lodash';
import util from './util';

const margin = {
	top: 44,
	right: 48,
	bottom: 50,
	left: 58
};

const formatPercent = (v) => {
	return d3.format(".0%")(v / 100);
}

function drawHist(opts) {
	const { svg, intervalData, priceData, width, height, yearInterval, monthly } = opts;

	// setup xscale
	const x = d3.scaleLinear()
		.domain(d3.extent(intervalData, (d) => d.percentReturn)).nice()
		.range([margin.left, width - margin.right])

	const bins = d3.histogram()
		.domain(x.domain())
		.thresholds(x.ticks(7))(map(intervalData, (d) => d.percentReturn))

	const numberOfIntervals = intervalData.length;
	// setup yscale
	const y = d3.scaleLinear()
		.domain(
			[0,
				d3.max(bins, d => {
					return d.length;
				}
				)
			])
		.range([height - margin.bottom, margin.top]);


	// add xaxis
	util.drawOrUpdateAxis(
		svg,
		"xaxis",
		`translate(0,${height - margin.bottom})`,
		d3.axisBottom(x).tickFormat(formatPercent).ticks(7),
		partial(util.addXAxisLabel, svg, "Percent Return Bucket", margin, width, height)
	);

	// add yaxis
	util.drawOrUpdateAxis(
		svg,
		"yaxis",
		`translate(${margin.left},0)`,
		d3.axisLeft(y).ticks(5),
		partial(util.addYAxisLabel, svg, "Number of Intervals", margin, height)
	);

	svg.select(".bar-group").remove();
	// draw rects
	svg.append("g")
		.attr("class", "bar-group")
		.selectAll("rect")
		.data(bins)
		.join("rect")
		.attr("class", (d) => {
			return d.x0 < 0 ? "worst-fill" : "best-fill";
		})
		.attr("x", d => x(d.x0) + 1)
		.attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
		.attr("y", y(0))
		.attr("height", 0)
		.transition(d3.easeLinear)
		.duration(util.animationDuration)
		.attr("height", d => y(0) - y(d.length)
		)
		.attr("y", d => y(d.length));

	svg.select(".title-group").remove();
	const titleGroup = svg.append("g")
		.attr("class", "title-group")
		.attr("transform", `translate(${width / 2}, 20)`);

	// top title text
	titleGroup.append("text")
		.attr('class', 'title-text')
		.text(monthly ? "Monthly Investment S&P Index Performance" : "Lump Sum Investment S&P Index Performance");

	// bottom title text
	titleGroup.append("text")
		.attr("y", 15)
		.attr("class", "interval-text")
		.text(`Considering all ${numberOfIntervals} ${yearInterval}-year intervals between ${util.monthYearFormat(first(priceData).Date)} and ${util.monthYearFormat(last(priceData).Date)}`)

	// remove zero line
	svg.select(".zero-line").remove();
	if (x(0) >= x.range()[0] && x(0) <= x.range()[1]) {
		// add zero line
		svg.append("g")
			.attr("class", "zero-line")
			.append("line")
			.attr("x1", x(0))
			.attr("y1", y(0))
			.attr("x2", x(0))
			.attr("y2", y.range()[1])
	}

}

export default {
	drawHist
}