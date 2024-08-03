import { chain, minBy, maxBy, findIndex, mean, zip, map, range, last, toNumber, toInteger, filter, reduce, slice } from 'lodash';

import * as moment from 'moment';

function readyData(data) {
	return map(data, (d) => {
		return {
			Date: moment(d.Date, "YYYY-MM-DD"),
			RealTotalReturnPrice: toNumber(d.RealTotalReturnPrice)
		}
	})
}

function processDataForGraphs(data, startDate, endDate, monthInterval, monthly) {
	const filteredData = getDataBetween(data, startDate, endDate);

	if (monthly) {
		return getEachMonthlyIntervalTotalReturn(
			filteredData,
			monthInterval
		)
	}

	return getEachInterval(filteredData, monthInterval);
}

function getMonthlyPercents(data, startIndex, endIndex) {
	const startPrice = data[startIndex].RealTotalReturnPrice;
	return chain(data)
		.slice(startIndex, endIndex + 1)
		.map((d) => {
			return {
				date: d.Date,
				percent: getPercentChange(startPrice, d.RealTotalReturnPrice),
			}
		}).value()
}

function getPercentChange(start, end) {
	return parseFloat(((end - start) / start) * 100);
}

function getPercentChangeAsString(start, end) {
	return stringifyPercent(getPercentChange(start, end));
}

function stringifyPercent(v) {
	return v.toFixed(1) + '%';
}

function packIntoPercentObj(v) {
	return { percent: v }
}

function getAverageValues(data, months, final_start) {
	const allMonthlyPercents = map(range(final_start), (d) => {
		return map(
			getMonthlyPercents(data, d, d + months),
			(d) => d.percent
		)
	});

	const transposed = zip.apply(null, allMonthlyPercents);

	return map(
		map(transposed, mean),
		packIntoPercentObj
	);
}

function calculateFractionDifference(start, stop) {
	return (stop - start) / start
}

function getMonthlyInvestmentReturnsForInterval(intervalData) {
	return map(intervalData, (d, i) => {
		const currentPrice = d.RealTotalReturnPrice;

		return mean(map(slice(intervalData, 0, i + 1), (innerData) => {
			return calculateFractionDifference(
				innerData.RealTotalReturnPrice,
				currentPrice
			)
		}))
	})
}

function addMonthsBackAndTimesBy100(intervalObj, data) {
	const dataInterval = slice(
		data,
		intervalObj.startIndex,
		intervalObj.endIndex + 1
	);

	return map(dataInterval, (d, i) => {
		return {
			date: d.Date,
			percent: intervalObj.data[i] * 100
		}
	})
}

function getMonthlyValuesOfInterest(data, months) {
	const final_start = data.length - months;
	const filteredData = slice(data, 0, final_start);

	const avgPercentChangeForEachInterval = map(filteredData, (d, i) => {
		return {
			data: getMonthlyInvestmentReturnsForInterval(
				slice(data, i, i + months + 1)
			),
			startIndex: i,
			endIndex: i + months
		}
	});

	const maxReturns = maxBy(avgPercentChangeForEachInterval, (d) => last(d.data));
	const minReturns = minBy(avgPercentChangeForEachInterval, (d) => last(d.data));
	const avgReturns = map(
		zip.apply(
			null,
			map(avgPercentChangeForEachInterval, (d) => d.data)
		),
		mean
	);

	return {
		best: {
			monthlyPercents: addMonthsBackAndTimesBy100(maxReturns, data),
			label: "Best",
			percentChange: stringifyPercent(
				last(maxReturns.data),
			)
		},
		worst: {
			monthlyPercents: addMonthsBackAndTimesBy100(minReturns, data),
			label: "Worst",
			percentChange: stringifyPercent(
				last(minReturns.data),
			)
		},
		average: {
			monthlyPercents: map(
				map(avgReturns, (d) => d * 100),
				packIntoPercentObj
			),
			label: "Average",
			percentChange: stringifyPercent(
				last(avgReturns),
			)
		}
	}
}

function getEachInterval(data, months) {
	const final_start = (data.length - months) - 1;

	return chain(data)
		.slice(0, final_start)
		.map((d, i) => {
			return {
				percentReturn: ((data[i + months].RealTotalReturnPrice - data[i].RealTotalReturnPrice) / data[i].RealTotalReturnPrice) * 100,
				startDate: data[i].Date,
				endDate: data[i + months].Date
			}
		}).value()
}

function getDataBetween(data, start, end) {
	return filter(data, (d) => {
		return d.Date >= start && d.Date <= end;
	})
}

function getEachMonthlyIntervalTotalReturn(data, months) {
	const final_start = (data.length - months) - 1;
	const filteredData = slice(data, 0, final_start);

	return map(filteredData, (d, i) => {
		const returns = getMonthlyInvestmentReturnsForInterval(
			slice(data, i, i + months + 1)
		);

		return {
			percentReturn: last(returns) * 100,
			startDate: data[i].Date,
			endDate: data[i + months].Date
		}
	})
}

function getValuesOfInterest(data, months) {
	const final_start = data.length - months;
	const everyInterval = getEachInterval(data, months);

	const maxAndMin = reduce(everyInterval, (a, b) => {
		return {
			max: maxBy([a.max, b], (d) => d.percentageMove),
			min: minBy([a.min, b], (d) => d.percentageMove)
		}
	}, {
		max: {
			percentageMove: Number.MIN_VALUE
		},
		min: {
			percentageMove: Number.MAX_VALUE
		}
	})

	const bestStartIndex = findIndex(data, (d) => d.Date === maxAndMin.max.startDate);
	const worstStartIndex = findIndex(data, (d) => d.Date === maxAndMin.min.startDate);
	const averageMonthlyPercents = getAverageValues(data, months, final_start);

	return {
		best: {
			monthlyPercents: getMonthlyPercents(data, bestStartIndex, bestStartIndex + months),
			label: "Best",
			percentChange: getPercentChangeAsString(
				data[bestStartIndex].RealTotalReturnPrice,
				data[bestStartIndex + months].RealTotalReturnPrice
			)
		},
		worst: {
			monthlyPercents: getMonthlyPercents(data, worstStartIndex, worstStartIndex + months),
			label: "Worst",
			percentChange: getPercentChangeAsString(
				data[worstStartIndex].RealTotalReturnPrice,
				data[worstStartIndex + months].RealTotalReturnPrice
			)
		},
		average: {
			monthlyPercents: averageMonthlyPercents,
			label: "Average",
			percentChange: last(averageMonthlyPercents).percent.toFixed(1) + '%'
		}
	}
}

function onlyInPastYears(data, pastYears) {
	const lastYearOfData = toInteger(maxBy(data, (d) => d.Date).Date);

	return filter(data, (d) => {
		return d.Date >= lastYearOfData - pastYears;
	})
}

export default { getValuesOfInterest, readyData, onlyInPastYears, getEachInterval, getMonthlyValuesOfInterest, getEachMonthlyIntervalTotalReturn, processDataForGraphs, getDataBetween };