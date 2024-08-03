import React from 'react';
import ReactDOM from 'react-dom';
import MarketApp from './marketApp.jsx';
import * as d3 from 'd3';
import processData from './processData.js'
import './sharedStyles.css';
import returnsHist from './returnsHist.js';
import lumpVsMonthly from './lumpVsMonthly.js';
import bestWorstIntervals from './bestWorstIntervals.js';
import * as moment from 'moment';
import {
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const width = 500;
const height = 300;

// setup viz about 
d3.csv("/data/marketTiming/historicalSAndP_dates_prices.csv")
	.then((data) => {

		const staticVizYearIntervals = 10;
		const preparedData = processData.readyData(data);

		const startDate = moment("1970-01-01", "YYYY-MM-DD");
		const endDate = moment("2020-01-01", "YYYY-MM-DD");

		const priceData = processData.getDataBetween(preparedData, startDate, endDate);
		const lumpIntervalData = processData.processDataForGraphs(
			preparedData,
			startDate,
			endDate,
			staticVizYearIntervals * 12
		);
		// Best and worst lump
		const bestAndWorstDiv = d3.select("#lump-best-worst");
		const bestAndWorstSvgSelection = bestAndWorstDiv.append("svg")
			.attr("class", "svg-responsive")
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("preserveAspectRatio", "xMinYMin meet");

		bestWorstIntervals.draw(
			{
				svg: bestAndWorstSvgSelection,
				intervalData: lumpIntervalData,
				priceData: priceData,
				width: width,
				height: height,
				yearInterval: staticVizYearIntervals,
				id: '1',
				callback: (html) => {
					d3.select("#lump-best-worst-desc").html(html);
				},
				investAmount: 1000
			});

		// Best and worst lump histogram
		const bestAndWorstHistDiv = d3.select("#lump-best-worst-hist");
		const bestAndWorstHistSvgSelection = bestAndWorstHistDiv.append("svg")
			.attr("class", "svg-responsive")
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("preserveAspectRatio", "xMinYMin meet");
		returnsHist.drawHist(
			{
				svg: bestAndWorstHistSvgSelection,
				intervalData: lumpIntervalData,
				priceData: priceData,
				width,
				height,
				yearInterval: staticVizYearIntervals
			});


		// Best and worst monthly
		const monthlyIntervalData = processData.processDataForGraphs(
			preparedData,
			startDate,
			endDate,
			staticVizYearIntervals * 12,
			true
		);
		const monthlyBestWorstDiv = d3.select("#monthly-best-worst");
		const monthlyBestWorstSvg = monthlyBestWorstDiv.append("svg")
			.attr("class", "svg-responsive")
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("preserveAspectRatio", "xMinYMin meet");

		bestWorstIntervals.draw(
			{
				svg: monthlyBestWorstSvg,
				intervalData: monthlyIntervalData,
				priceData: priceData,
				width: width,
				height: height,
				yearInterval: staticVizYearIntervals,
				id: '2',
				callback: (html) => {
					d3.select("#monthly-best-worst-desc").html(html);
				},
				monthly: true,
				investAmount: 1000
			});

		const monthlyBestAndWorstHistDiv = d3.select("#monthly-best-worst-hist");
		const monthlyBestAndWorstHistSvgSelection = monthlyBestAndWorstHistDiv.append("svg")
			.attr("class", "svg-responsive")
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("preserveAspectRatio", "xMinYMin meet");
		returnsHist.drawHist(
			{
				svg: monthlyBestAndWorstHistSvgSelection,
				intervalData: monthlyIntervalData,
				priceData: priceData,
				width,
				height,
				yearInterval: staticVizYearIntervals,
				monthly: true
			});

		const lumpVsMonthlyDiv = d3.select("#monthly-vs-lump");
		const lumpVsMonthlySvg = lumpVsMonthlyDiv.append("svg")
			.attr("class", "svg-responsive")
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("preserveAspectRatio", "xMinYMin meet");
		lumpVsMonthly.draw(
			{
				svg: lumpVsMonthlySvg,
				lumpIntervalData: lumpIntervalData,
				monthlyIntervalData: monthlyIntervalData,
				priceData: priceData,
				width,
				height,
				yearInterval: staticVizYearIntervals
			});

		// Setup react app for interaction
		ReactDOM.render(
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<MarketApp data={preparedData} />
			</MuiPickersUtilsProvider>
			,
			document.getElementById('root')
		);
	})