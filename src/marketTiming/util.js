
const animationDuration = 2000;

function addXAxisLabel(svg, label, margin, width, height) {
	const x = margin.left + ((width - margin.left - margin.right) / 2)
	svg.append("text")
		.attr("transform",
			"translate(" + x + " ," +
			(height - 10) + ")")
		.attr("class", "xaxis-text")
		.text(label);
}

function addYAxisLabel(svg, label, margin, height) {
	const x = 2;
	const y = margin.top + ((height - margin.top - margin.bottom) / 2)
	svg.append("text")
		.attr("transform", `rotate(-90, ${x}, ${y})`)
		.attr("y", y)
		.attr("x", x)
		.attr("dy", "1em")
		.attr("class", "yaxis-text")
		.text(label);
}

function drawOrUpdateAxis(svg, className, translateValue, callable, addLabel) {
	const selection = svg.select(`.${className}`);

	if (selection.empty()) {
		svg.append("g")
			.attr("class", className)
			.attr("transform", translateValue)
			.call(callable);

		addLabel();
	} else {
		selection.transition().duration(animationDuration).call(callable);
	}

}

const monthMap = {
	0.01: "Jan",
	0.02: "Feb",
	0.03: "Mar",
	0.04: "April",
	0.05: "May",
	0.06: "Jun",
	0.07: "Jul",
	0.08: "Aug",
	0.09: "Sep",
	0.10: "Oct",
	0.11: "Nov",
	0.12: "Dec",
}

function getDateText(v) {
	const d = (v % 1).toFixed(2)

	return `${monthMap[d]} ${Math.floor(v)}`;
}

function monthYearFormat(d) {
	return d.format("MMM YYYY");
}

export default {
	addXAxisLabel,
	addYAxisLabel,
	drawOrUpdateAxis,
	getDateText,
	animationDuration,
	monthYearFormat
}