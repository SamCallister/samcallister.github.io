import * as d3 from 'd3';
import { round, range, map, min, findIndex, last, first, max, debounce, isNull } from 'lodash';
import { getAmortizationSchedule } from './paymentMath.js';
// eslint-disable-next-line
const simpleSlider = require("d3-simple-slider");


const margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 40
};
const bottomRectHeight = 20;
const moneyWidth = 431;
const moneyY = 37.81464;
const moneyHeight = 183.58842;
const moneyMargin = {
	left: 32.397957
}


function moneyFormat(amount) {
	return new Intl.NumberFormat('en-US',
		{ style: 'currency', currency: 'USD' }
	).format(amount);
}

function paymentRects(opts) {
	const {
		width, height, interestGroup, principalGroup, textGroup, interestPayment, principalPayment, years, months, totalInterest, totalPrincipal, totalPrincipalGroup, totalInterestGroup
	} = opts;
	const paymentAmount = interestPayment + principalPayment;
	const x = d3.scaleLinear()
		.domain([0, paymentAmount])
		.range([0, moneyWidth]);

	const topTextTranslateY = 16;


	// interest side
	interestGroup.selectAll("rect")
		.data([interestPayment])
		.join("rect")
		.attr("x", moneyMargin.left)
		.attr("y", moneyY)
		.attr("height", moneyHeight)
		.attr("width", x(interestPayment))
		.attr("class", "interest-rect");


	totalInterestGroup.selectAll("#total-interest-label").remove();
	totalPrincipalGroup.selectAll("#total-principal-label").remove();

	const interestText = totalInterestGroup.append("g")
		.attr("class", "total-paid-text")
		.attr("id", "total-interest-label")
		.attr("transform", `translate(${width * 0.25}, ${topTextTranslateY})`)
		.append("text");

	interestText.append("tspan")
		.text("Total interest paid");
	interestText.append("tspan")
		.attr("x", 0)
		.attr("dy", "1em")
		.text(moneyFormat(totalInterest));

	// principal side

	const principalText = totalPrincipalGroup.append("g")
		.attr("class", "total-paid-text")
		.attr("id", "total-principal-label")
		.attr("transform", `translate(${width * 0.75}, ${topTextTranslateY})`)
		.append("text");

	principalText.append("tspan")
		.text("Total principal paid");
	principalText.append("tspan")
		.attr("x", 0)
		.attr("dy", "1em")
		.text(moneyFormat(totalPrincipal));


	// add interest and principal labels

	const monthlyTextAmountsY = moneyY + moneyHeight + 17;
	interestGroup.selectAll("text")
		.data([interestPayment])
		.join("text")
		.attr("transform", `translate(${moneyMargin.left},${monthlyTextAmountsY})`)
		.attr("class", "bottom-rect-text")
		.text(`Interest: ${moneyFormat(interestPayment)}`);

	principalGroup.selectAll("text")
		.data([principalPayment])
		.join("text")
		.attr("transform", `translate(${moneyMargin.left + moneyWidth},${monthlyTextAmountsY})`)
		.attr("class", "principal-text")
		.text(`Principal: ${moneyFormat(principalPayment)}`);

	// add text group
	textGroup.selectAll("text")
		.data([{ months, years }])
		.join("text")
		.attr("transform", `translate(${margin.left + 10 + (width / 2) + 20}, ${height - (margin.bottom / 2) + 5})`)
		.attr("class", "year-month-text")
		.text((d) => `Year:${d.years} Month:${d.months}`);
}

const twelths = map(range(1, 13), (v) => v / 12);

function getClosestMonth(rawYear) {
	const leftOver = round(rawYear, 2) - Math.floor(rawYear);
	const differences = map(twelths, (v) => Math.abs(v - leftOver));
	const minValue = min(differences);

	return findIndex(differences, (v) => v == minValue) + 1;
}

function addMonthlyPaymentText(self) {
	const firstData = first(self.data);
	self.svg.select('#monthly-payment-text').remove();
	const monthlyPaymentText = self.svg.append('g')
		.attr('class', 'monthly-payment-text-group')
		.attr('id', 'monthly-payment-text')
		.attr('transform', `translate(${self.width / 2}, ${(self.height / 2) - 28})`)
		.append('text');

	monthlyPaymentText.append('tspan')
		.text('Monthly Payment');


	monthlyPaymentText.append("tspan")
		.attr("x", 0)
		.attr("dy", "1em")
		.text(moneyFormat(firstData.principalPayment + firstData.interestPayment));
}

function handleSliderChange(self, rawYears) {
	// round to the nearest 12th
	let months = getClosestMonth(rawYears);
	let years = Math.floor(rawYears);

	if (months === 12) {
		months = 0;
		years = years + 1;
	}

	if (years === 30) {
		months = 0;
		if (!isNull(self.intervalId)) {
			clearInterval(self.intervalId);
			self.svg.select("#pause-button").style('display', 'none');
			self.svg.select("#play-button").style('display', 'inherit');
		}

	}

	let totalMonths = months + (years * 12);
	const selectedData = self.data[totalMonths - 1] || last(self.data);


	paymentRects({
		...self,
		interestPayment: selectedData.interestPayment,
		principalPayment: selectedData.principalPayment,
		totalInterest: selectedData.totalInterest,
		totalPrincipal: selectedData.totalPrincipal,
		years: years,
		months: months
	});
}

function setYScale(self) {
	const lastData = last(self.data);

	const y = d3.scaleLinear()
		.domain([0, max([lastData.totalInterest, lastData.totalPrincipal])]).nice()
		.range([self.height - margin.bottom - bottomRectHeight, margin.top]);

	self.y = y;
}


function draw(opts) {
	const { svg, data, width, height } = opts;
	const self = {
		svg,
		width,
		height,
		data,
		interestGroup: svg.append("g"),
		principalGroup: svg.append("g"),
		textGroup: svg.append("g"),
		totalInterestGroup: svg.append("g"),
		totalPrincipalGroup: svg.append("g"),
		intervalId: null
	};

	setYScale(self)

	const numberLoanYears = 30;
	const firstData = first(self.data);

	paymentRects({
		...self,
		interestPayment: firstData.interestPayment,
		principalPayment: firstData.principalPayment,
		totalInterest: firstData.totalInterest,
		totalPrincipal: firstData.totalPrincipal,
		years: 0,
		months: 1,
	});

	// add slider
	const sliderSimple = simpleSlider
		.sliderBottom()
		.min(0)
		.max(numberLoanYears)
		.width((width / 2))
		.ticks(7)
		.default(1 / 12)
		.on('onchange', debounce(handleSliderChange.bind(null, self), 10));

	self.slider = sliderSimple;


	svg.select("#pause-button")
		.on("click", function () {
			// show play button
			d3.select(this).style('display', 'none');
			svg.select("#play-button").style('display', 'inherit');

			// stop interval
			clearInterval(self.intervalId);
		});

	svg.select("#play-button")
		.on("click", function () {
			// show pause button
			d3.select(this).style('display', 'none');
			svg.select("#pause-button").style('display', 'inherit');

			// begin moving slider
			self.intervalId = setInterval(() => {
				const currentValue = self.slider.value();
				self.slider.value(currentValue + (6 / 12));
			}, 100)
		});

	const sliderGroup = svg.append("g")
		.attr("transform", `translate(${margin.left + 10}, ${height - (margin.bottom / 2)})`);

	sliderGroup.call(sliderSimple);

	// add monthly payment text
	addMonthlyPaymentText(self);

	return self;
}

function changeData(self, newRate, mortgageAmount) {
	const amortizationData = getAmortizationSchedule(
		mortgageAmount,
		newRate / 100,
		30 * 12
	);

	self.data = amortizationData;

	addMonthlyPaymentText(self);
	handleSliderChange(self, self.slider.value());

	// need to change total interest paid, total principal changed
	// interest and principal.
	// also need to change data that is being referenced
	// really just need to trigger handle slider changed but
	// referencing new array of data should fix everything? except maybe monthly payment?

	// find out which number slider is currently
}



export {
	draw,
	changeData
};