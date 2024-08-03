import { first, last, partial, sortBy, map, round, chain, isNaN, isUndefined } from 'lodash';
import * as d3 from 'd3';
import util from './util';
import processData from './processData';
import * as moment from 'moment';

const marketEvents = {
	"Housing Crash": moment('2008-09-16', "YYYY-MM-DD"),
	"Dotcom Bubble": moment("2000-03-10", "YYYY-MM-DD"),
	"Black Monday": moment("1987-10-19", "YYYY-MM-DD"),
	"Great Depression": moment("1929-10-24", "YYYY-MM-DD"),
	"Covid Crash": moment("2020-02-24", "YYYY-MM-DD")
}

const margin = {
	top: 62,
	right: 48,
	bottom: 50,
	left: 62
};

function removeOld(svg) {
	svg.select(".line-group").remove();
	svg.select(".title-group").remove();
	svg.select(".market-events-group").remove();
}

function draw(opts) {
	const { svg, intervalData, priceData, height, width, monthly, yearInterval, callback, amountCallback, id, investAmount, monthlyInvestAmount } = opts;

	removeOld(svg);

	const startDate = first(priceData).Date;
	const endDate = last(priceData).Date;

	const sortedIntervalData = sortBy(intervalData, (d) => d.percentReturn);


	const y = d3.scaleLinear()
		.domain(d3.extent(priceData, (d) => d.RealTotalReturnPrice)).nice()
		.range([height - margin.bottom, margin.top])

	const x = d3.scaleTime()
		.domain([startDate, endDate]).nice()
		.range([margin.left, width - margin.right]);

	// add xAxis
	util.drawOrUpdateAxis(
		svg,
		"xaxis",
		`translate(0,${height - margin.bottom})`,
		d3.axisBottom(x).ticks(5),
		partial(util.addXAxisLabel, svg, "Date", margin, width, height)
	)

	// add yAxis
	util.drawOrUpdateAxis(
		svg,
		"yaxis",
		`translate(${margin.left},0)`,
		d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")),
		partial(util.addYAxisLabel, svg, "S&P Total Price (Dividends Included)", margin, height)
	)

	// title group
	svg.select(".title-group").remove();
	const titleGroup = svg.append("g")
		.attr("class", "title-group")
		.attr("transform", `translate(${width / 2}, 20)`);

	// top title text
	titleGroup.append("text")
		.attr('class', 'title-text')
		.text(
			monthly ? "Monthly Investment S&P Index Performance" : "Lump Sum Investment S&P Index Performance"
		);

	// bottom title text
	titleGroup.append("text")
		.attr("y", 15)
		.attr("class", "interval-text")
		.text(`Considering ${yearInterval} year intervals between ${util.monthYearFormat(startDate)} and ${util.monthYearFormat(endDate)}`)


	// line generator
	const lineGen = d3.line()
		.x((d) => {
			return x(d.Date);
		}) // set the x values for the line generator
		.y(d => y(d.RealTotalReturnPrice)) // set the y values for the line generator 
		.curve(d3.curveMonotoneX) // apply smoothing to the line

	const pathGroup = svg.append("g")
		.attr("class", "line-group");

	const linePath = pathGroup.append("path")
		.datum(priceData)
		.attr("class", "line")
		.attr("d", lineGen);

	const totalLineLength = linePath.node().getTotalLength();

	// Add market events
	const marketEventsGroup = svg.append("g")
		.attr("class", "market-events-group");

	chain(marketEvents)
		.pickBy((v) => {
			const [start, end] = x.domain();
			return v >= start && v <= end;
		})
		.map((v, k) => {
			marketEventsGroup.append("line")
				.attr("class", "zero-line")
				.attr("x1", x(v))
				.attr("y1", y(y.domain()[0]))
				.attr("x2", x(v))
				.attr("y2", y.range()[1] - 5);

			marketEventsGroup.append("text")
				.attr("class", "market-event-text")
				.attr("x", x(v))
				.attr("y", y.range()[1] - 7)
				.attr("transform", `rotate(30, ${x(v)}, ${y.range()[1] + 7})`)
				.text(k);
		})
		.value();

	const threeValues = {
		best: last(sortedIntervalData),
		worst: first(sortedIntervalData),
		median: sortedIntervalData[Math.floor(sortedIntervalData.length / 2)]
	};

	linePath
		.attr("stroke-dasharray", totalLineLength + " " + totalLineLength)
		.attr("stroke-dashoffset", totalLineLength)
		.transition(d3.easeLinear)
		.duration(util.animationDuration)
		.attr("stroke-dashoffset", 0)
		.on("end", () => {
			// draw best
			drawSegment(pathGroup, lineGen, priceData, threeValues.best, "best-line");
		});

	if (callback) {

		let relevantInvestmentAmount;
		if (!isUndefined(monthlyInvestAmount)) {
			relevantInvestmentAmount = round(monthly ? monthlyInvestAmount : investAmount, 2);
		} else {
			relevantInvestmentAmount = getRelevantInvestmentAmount(investAmount, monthly, yearInterval * 12);
		}

		const html = map(threeValues, (v, k) => {
			return `
				<div>
				<input type="radio" value="${k}" name="bestWorst-${id}"${k == 'best' ? " checked" : ""}/>
				<span class="${k}-text">${k}</span>: ${util.monthYearFormat(v.startDate)} to ${util.monthYearFormat(v.endDate)} <span class="${getPercentClassName(v.percentReturn)}">${getSign(v.percentReturn)}${round(v.percentReturn, 1)}%</span><span> ${getMoneyText(monthly ? relevantInvestmentAmount * 12 * yearInterval : relevantInvestmentAmount, v.percentReturn, id)}</span>
				<div>
				`
		}).join('')



		const finalHtml = `
		<div>
			<div>$<input name='bestWorst-number-${id}' type="number" class="invest-input" value="${relevantInvestmentAmount}" />
			invested ${monthly ? "monthly" : "at the beginning of the period"} ${monthly ? getMonthlyToTotalSpan(relevantInvestmentAmount, yearInterval, id) : ""}</div>
			${html}
		</div>
		`

		if (callback) {
			callback(finalHtml);
		}


		d3.selectAll(`input[name='bestWorst-${id}']`).on("change", function () {
			const newRadioSelection = this.value;
			const specificChoice = threeValues[newRadioSelection];

			drawSegment(pathGroup, lineGen, priceData, specificChoice, `${newRadioSelection}-line`);
		});

		d3.select(`input[name='bestWorst-number-${id}']`).on("change textInput input", function () {
			const newValue = parseFloat(this.value);

			d3.selectAll(`span.money-holder-${id}`).nodes().forEach((node) => {

				const percent = parseFloat(node.getAttribute("data-percent"));
				const amount = monthly ? newValue * 12 * yearInterval : newValue;

				if (isNaN(amount)) {
					node.innerHTML = "";
				} else {
					node.innerHTML = getMoneyFormat(amount, percent);
				}

				if (amountCallback) {
					amountCallback(amount, amount / (yearInterval * 12));
				}
			});

			d3.selectAll(`span.total-money-${id}`).nodes().forEach((node) => {
				node.innerHTML = isNaN(newValue) ? "" : getMonthlyTotalMoney(newValue, yearInterval);
			});

		});
	}
}

function getMonthlyTotalMoney(relevantInvestmentAmount, years) {
	return new Intl.NumberFormat('en-US',
		{ style: 'currency', currency: 'USD' }
	).format(relevantInvestmentAmount * 12 * years);
}

function getMonthlyToTotalSpan(relevantInvestmentAmount, years, id) {
	const money = getMonthlyTotalMoney(relevantInvestmentAmount, years);

	return `=<span class="total-money-${id}">${money}</span> invested over ${years} years`;
}

function getMoneyFormat(amount, percent) {
	const value = round(amount + (amount * (percent / 100)));

	return new Intl.NumberFormat('en-US',
		{ style: 'currency', currency: 'USD' }
	).format(value)
}

function getRelevantInvestmentAmount(amount, monthly, months) {
	return monthly ? round(amount / months, 2) : amount;
}

function drawSegment(pathGroup, lineGen, generalPriceData, specificObj, className) {
	const specificPriceData = processData.getDataBetween(generalPriceData, specificObj.startDate, specificObj.endDate);
	appendSegment(pathGroup, lineGen, specificPriceData, className);
}

function getPercentClassName(v) {
	return v >= 0 ? "green" : "red";
}

function getSign(v) {
	return v >= 0 ? "+" : "";
}

function getMoneyText(amount, percent, id) {
	return `end amount <span data-percent="${percent}" class="money-holder-${id}" >${getMoneyFormat(amount, percent)}</span>`;
}


function appendSegment(group, gen, priceData, className) {
	group.selectAll(".line-segment").remove();
	group.append("path")
		.datum(priceData)
		.attr("class", `line-segment ${className}`)
		.attr("d", gen);
}

export default {
	draw
};