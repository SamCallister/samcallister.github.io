import * as focusVisible from 'focus-visible'; // necessary to get blue outline off of tooltip rectangles
import tippy from 'tippy.js';
import * as d3 from 'd3';
import './styles.css';

const stickmanViewX = 640;
const stickmanViewY = 1280;
const width = 600;
const height = 900;
"0 0 609.53 111.46"

const stickmanHTML = `<g>
<g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2901 12789 c-438 -49 -792 -208 -1056 -473 -199 -200 -316 -406
-384 -676 -147 -583 61 -1183 532 -1534 263 -196 587 -300 977 -313 746 -26
1361 289 1659 847 60 114 124 299 147 430 26 143 24 374 -4 518 -126 637 -633
1082 -1354 1187 -130 19 -407 27 -517 14z"/>
<path d="M1207 8243 l-1208 -1257 248 -248 c136 -136 250 -248 254 -248 3 0
433 455 955 1010 l949 1010 7 -387 c4 -214 11 -980 16 -1703 l8 -1315 -729
-2255 c-401 -1240 -771 -2385 -822 -2545 -52 -159 -92 -292 -89 -295 10 -10
1028 -4 1059 6 35 12 -8 -145 356 1279 519 2030 848 3295 897 3450 12 37 22
54 25 45 4 -8 116 -409 251 -890 291 -1041 743 -2656 940 -3360 l141 -505 514
-3 c486 -2 513 -1 508 15 -2 10 -190 585 -417 1278 -226 693 -595 1823 -819
2510 l-407 1250 8 1265 c4 696 11 1467 16 1713 l7 448 973 -986 c535 -542 976
-985 980 -985 4 0 135 107 290 237 l284 236 -1244 1244 -1243 1243 -750 0
-750 0 -1208 -1257z"/>
</g>
</g>`

const margin = {
	top: 45,
	right: 5,
	bottom: 0,
	left: 0
};

const tippyClass = "tippy-class"

const peoplePerRow = 25;
const rowHeight = 25;
const numberOfPeople = 500;
const animationDuration = 2500;
const startTextDuration = 3500;
const totalNumRows = (numberOfPeople / peoplePerRow);

const peopleSvg = d3.select("#people-svg")
	.attr("class", "svg-responsive")
	.attr("viewBox", `0 0 ${width} ${height}`)
	.attr("preserveAspectRatio", "xMinYMin meet");

const dataPromise = d3.csv("/data/cohortLifetime/life_expectancy_cohort_1990.csv")
	.then((data) => {
		return data.map((r) => {
			return {
				ending_age: r.ending_age,
				past_10_proportion_died_sum: parseFloat(r.past_10_proportion_died_sum),
				age_range: r.age_range,
				proportion_dead_so_far: r.proportion_dead_so_far
			}
		});
	});

dataPromise.then((d) => {
	setupPeople(d, peopleSvg);

	// add scroll listener
	document.addEventListener("scroll", startAnimationWhenInView, false);
	// let fired = false;
	// document.addEventListener("keypress", () => {
	// 	if(!fired) {
	// 		drawAnimation(d, peopleSvg);
	// 		fired = true;
	// 	}
	// })
});


function isScrolledIntoView(el) {
	const rect = el.getBoundingClientRect();
	const elemTop = rect.top;
	const elemBottom = rect.bottom;

	// Only completely visible elements return true:
	const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);

	return isVisible;
}

function startAnimationWhenInView(_) {
	if (isScrolledIntoView(d3.select("#alive-group").node())) {
		document.removeEventListener("scroll", startAnimationWhenInView, false);
		// fire
		dataPromise.then((d) => {
			drawAnimation(d, peopleSvg);
		});
	}
}


const peopleScaleX = d3.scaleLinear()
	.domain([0, peoplePerRow])
	.range([margin.left, width - margin.right]);

function drawAnimation(parsedData, svg) {
	// draw the decade rectangles
	const [startLoc, endLoc] = peopleScaleX.range();
	const rowWidth = endLoc - startLoc;
	const totalLength = rowWidth * totalNumRows;

	let currentXLocation = startLoc;
	let currentRow = 0;
	const decadeShapeData = parsedData.map((d, i) => {
		let remainingDecadeWidth = totalLength * d.past_10_proportion_died_sum;

		const rectsToAdd = [];
		let remainingWidthInRow = rowWidth - (currentXLocation - startLoc);

		while (remainingDecadeWidth > 0) {
			// add rect to Draw
			if (remainingDecadeWidth >= remainingWidthInRow) { // takes remainder of the row
				rectsToAdd.push({
					row: currentRow,
					x: currentXLocation,
					width: remainingWidthInRow
				});
				remainingDecadeWidth -= remainingWidthInRow;
				// new row
				remainingWidthInRow = rowWidth;
				currentXLocation = startLoc;
				currentRow += 1;
			} else { // doesn't take up the row
				rectsToAdd.push({
					row: currentRow,
					x: currentXLocation,
					width: remainingDecadeWidth
				});
				currentXLocation += remainingDecadeWidth;
				remainingWidthInRow -= remainingDecadeWidth;
				remainingDecadeWidth = 0;
			}
		}

		return {
			ending_age: d.ending_age,
			age_range: d.age_range,
			past_10_proportion_died_sum: d.past_10_proportion_died_sum,
			proportion_dead_so_far: d.proportion_dead_so_far,
			rectsToAdd,
			color: d3.schemeTableau10[i]
		};
	});

	drawStartingText(svg, rowHeight, totalNumRows)
		.then(() => {
			d3.select("#decade-text-group").remove();

			decadeShapeData.slice(1, decadeShapeData.length)
				.reduce((previousValue, currentValue, i) => {
					return previousValue.then(() => {
						d3.select("#decade-text-group").remove();
						return drawDecade(svg, currentValue, rowHeight, totalNumRows);
					});
				}, drawDecade(svg, decadeShapeData[0], rowHeight))
				.then(() => {
					d3.select("#decade-text-group").remove();
					tippy(
						`.${tippyClass}`,
						{
							allowHTML: true
						}
					);

					drawEndingText(svg)
				});
		});
}

// setup viz about 
function setupPeople(parsedData, svg) {
	const alivePeopleData = d3.range(0, numberOfPeople);
	const peopleScaleY = d3.scaleOrdinal()
		.domain(d3.range(numberOfPeople / peoplePerRow))
		.range(d3.range(numberOfPeople / peoplePerRow).map((v) =>
			(v * rowHeight) + margin.top));

	const stickmanScale = `scale(${((width / 10) / stickmanViewX) * .2}, ${(height / stickmanViewY) * 0.02})`;
	const smallStickmanScale = `scale(${((width / 10) / stickmanViewX) * .15}, ${(height / stickmanViewY) * 0.015})`;

	// people group
	svg.append("g")
		.attr("id", "alive-group")
		.selectAll("g")
		.data(alivePeopleData)
		.enter()
		.append("g")
		.attr("transform", (d) => {
			return `translate(${peopleScaleX(d % peoplePerRow) + 6}, ${peopleScaleY(Math.floor(d / peoplePerRow))}) ${stickmanScale}`
		})
		.html(stickmanHTML);

	// add legend
	addLegendInfo(svg, smallStickmanScale, parsedData, rowHeight, totalNumRows);
}

function addLegendInfo(svg, stickmanScale, data, rowHeight, totalNumRows) {
	const stickmanLegend = svg.append("g")
		.attr("id", "stickman-legend")
		.attr("transform", `translate(0, ${margin.top + (totalNumRows * rowHeight) + 5})`);

	const stickmanLegendInnerGroup = stickmanLegend.append("g")
		.attr("transform", "translate(0, -3.5)");

	stickmanLegendInnerGroup.append("g")
		.attr("transform", `translate(1, 2) ${stickmanScale}`)
		.html(stickmanHTML);

	stickmanLegendInnerGroup.append("g")
		.attr("transform", "translate(12, 15)")
		.append("text")
		.attr("class", "legend-text")
		.text(" = 0.2% of cohort");

	// add the row
	stickmanLegendInnerGroup.append("g")
		.attr("transform", `translate(1, 32)`)
		.append("text")
		.attr("class", "legend-text")
		.text("row = 5% of cohort");

	const rectGroup = stickmanLegend.append("g")
		.attr('transform', "translate(50, 0)")
		.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", (d, i) => {
			const numberPerRow = 5;
			const transformY = i >= numberPerRow ? 15 : 0;
			return `translate(${120 + ((i % numberPerRow) * 85)}, ${transformY})`;
		});

	rectGroup.append("rect")
		.attr("width", 13)
		.attr("height", 13)
		.attr("fill", (d, i) => d3.schemeTableau10[i]);

	rectGroup.append("text")
		.attr("transform", "translate(15, 12)")
		.attr("class", "rect-legend-text")
		.text((d) => `${d.age_range} y.o.`);
}

function drawStartingText(svg, rowHeight, totalNumRows) {
	return new Promise((resolve, reject) => {
		const topTextGroup = svg.append("g")
			.attr("class", "introductory-text")
			.attr("id", "decade-text-group")
			.attr("transform", `translate(0, 25)`);

		// starting text

		return topTextGroup.append("text")
			.attr("x", "50%")
			.text("These stick figures represent all of the people born in 1990.")
			.transition()
			.delay(startTextDuration)
			.text("Each figure represents 0.2% of the cohort.")
			.transition()
			.delay(startTextDuration)
			.text("Each row represents 5% of the cohort.")
			.transition()
			.delay(startTextDuration)
			.text("Watch each decade claim its share of the birth cohort of 1990.")
			.transition()
			.delay(startTextDuration)
			.on("end", () => {
				return resolve(true);
			});
	});
}

function drawEndingText(svg) {
	const topTextGroup = svg.append("g")
		.attr("class", "introductory-text")
		.attr("id", "decade-text-group")
		.attr("transform", `translate(0, 13)`);

	topTextGroup.append("text")
		.attr("x", "50%")
		.text("1990 Birth Cohort Death by Decade");

	topTextGroup.append("text")
		.attr("transform", "translate(0, 18)")
		.attr("class", "hover-over-callout-text")
		.attr("x", "50%")
		.text("Hover over an age range color for its details.");
}

function drawDecade(svg, decadeInfo, rowHeight) {
	return new Promise((resolve, _) => {

		const formatPercent = (x) => Math.round(x * 10000) / 100 + "%";

		const topTextGroup = svg.append("g")
			.attr("class", "bottom-main-text")
			.attr("id", "decade-text-group")
			.attr("transform", `translate(0, 15)`);

		topTextGroup.append("text")
			.text(`Ages ${decadeInfo.age_range}`);

		topTextGroup.append("text")
			.attr("transform", "translate(0, 20)")
			.text(`Dead in this age range: ${formatPercent(decadeInfo.past_10_proportion_died_sum)}`);

		topTextGroup.append("text")
			.attr("class", "dead-so-far-text")
			.attr("transform", `translate(${width}, 0)`)
			.text(`Dead by the age of ${decadeInfo.ending_age}`);

		topTextGroup.append("text")
			.attr("class", "dead-so-far-text")
			.attr("transform", `translate(${width}, 20)`)
			.text(formatPercent(decadeInfo.proportion_dead_so_far));

		const totalWidth = decadeInfo.rectsToAdd
			.map((a) => a.width)
			.reduce((a, b) => a + b);


		const tooltipContent = `<div class="tooltip-container">
		<svg width="10" height="10" viewBox="0 0 10 10" preserveAspectRatio="xMinYMin meet" class="tooltip-svg"><rect width="10" height="10" fill="${decadeInfo.color}"></rect></svg><div class="tooltip-age-range">Ages ${decadeInfo.age_range}</div>
		<div>• Died in this age range: ${formatPercent(decadeInfo.past_10_proportion_died_sum)}</div>
		<div>• Dead by the age of ${decadeInfo.ending_age}: ${formatPercent(decadeInfo.proportion_dead_so_far)}</div>
		</div>`;

		const decadeRectGroup = svg.append("g")
			.attr("class", tippyClass);
		
		const drawRect = (d, attachTippy) => {
			return new Promise((resolveNested, _) => {
				return decadeRectGroup.append("rect")
					.attr("x", d.x)
					.attr("y", margin.top + (d.row * rowHeight) - 5)
					.attr("height", rowHeight)
					.attr("fill", decadeInfo.color)
					.attr("opacity", 0.7)
					.attr("width", 0)
					.transition(d3.easeLinear)
					.duration(animationDuration * (d.width / totalWidth))
					.attr("width", d.width)
					.on("end", () => resolveNested());
				
			});
		};
		// animate time each according to the their proportional length
		const finalPromise = decadeInfo.rectsToAdd.slice(1, decadeInfo.rectsToAdd.length)
			.reduce((a, b) => {
				return a.then(() => {
					return drawRect(b)
				})
			}, drawRect(decadeInfo.rectsToAdd[0], true));


		return finalPromise.then(() => {
			decadeRectGroup.attr("data-tippy-content", tooltipContent);
			resolve();
		});
	});

}