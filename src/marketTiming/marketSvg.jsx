import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import bestWorstIntervals from './bestWorstIntervals.js';
import returnsHist from './returnsHist.js';
import processData from './processData.js';
import lumpVsMonthly from './lumpVsMonthly.js';

const useStyles = makeStyles({
	svgResponsive: {
		display: "inline-block",
		position: "absolute",
		top: "10px",
		left: "0"
	},
	svgContainer: {
		display: "inline-block",
		position: 'relative',
		width: '100%',
		paddingBottom: '62%', // aspect ratio
		verticalAlign: 'top',
		overflow: 'hidden'
	},
	outerContainer: {
		position: 'relative'
	},
	loadingOverlay: {
		height: "100%",
		position: "absolute",
		width: "100%",
		backgroundColor: "#f3f3f3",
		zIndex: 1,
		textAlign: "center",
		paddingTop: "60px"
	}
});


const width = 500;
const height = 300;

function MarketSvg(props) {
    /* The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement) */
	const d3Container = useRef(null);
	const histContainer = useRef(null);
	const compareContainer = useRef(null);
	const [investAmount, setInvestAmount] = useState(240000);
	const [monthlyInvestAmount, setMonthlyInvestAmount] = useState(1000);
	const [loading, setLoading] = useState(false);

	const classes = useStyles();

    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
	useEffect(
		() => {

			if (d3Container.current && histContainer.current) {
				const priceData = processData.getDataBetween(props.data, props.startDate, props.endDate);

				setLoading(true);
				setTimeout(() => {
					setLoading(false);
					const intervalData = processData.processDataForGraphs(
						props.data,
						props.startDate,
						props.endDate,
						props.yearInterval * 12,
						props.granularity === "monthly"
					);

					const svg = d3.select(d3Container.current);

					bestWorstIntervals.draw(
						{
							svg: svg,
							intervalData: intervalData,
							priceData: priceData,
							width: width,
							height: height,
							yearInterval: props.yearInterval,
							callback: props.calculatedCallback,
							monthly: props.granularity === "monthly",
							investAmount: investAmount,
							monthlyInvestAmount: monthlyInvestAmount,
							callback: (html) => {
								d3.select("#best-worst-interactive").html(html);
							},
							amountCallback: (amount, monthlyAmount) => {
								setInvestAmount(amount);
								setMonthlyInvestAmount(monthlyAmount);
							},
							id: 20
						});

					const histSvg = d3.select(histContainer.current);
					returnsHist.drawHist(
						{
							svg: histSvg,
							intervalData: intervalData,
							priceData: priceData,
							width,
							height,
							yearInterval: props.yearInterval,
							monthly: props.granularity === "monthly"
						}
					);
				}, 100)


			}

			if (compareContainer.current) {
				const priceData = processData.getDataBetween(props.data, props.startDate, props.endDate);

				setLoading(true);

				setTimeout(() => {
					setLoading(false);
					const compareSvg = d3.select(compareContainer.current);

					const lumpIntervalData = processData.processDataForGraphs(
						props.data,
						props.startDate,
						props.endDate,
						props.yearInterval * 12
					);

					const monthlyIntervalData = processData.processDataForGraphs(
						props.data,
						props.startDate,
						props.endDate,
						props.yearInterval * 12,
						true
					);

					lumpVsMonthly.draw(
						{
							svg: compareSvg,
							lumpIntervalData: lumpIntervalData,
							monthlyIntervalData: monthlyIntervalData,
							priceData: priceData,
							width,
							height,
							yearInterval: props.yearInterval
						});
				}, 100)

			}
		},

        /*
            useEffect has a dependency array (below). It's a list of dependency
            variables for this useEffect block. The block will run after mount
            and whenever any of these variables change. We still have to check
            if the variables are valid, but we do not have to compare old props
            to next props to decide whether to rerender.
        */
		[d3Container.current, props.yearInterval, props.pastYears, props.granularity, compareContainer.current, props.startDate, props.endDate]
	)

	return (
		<div className={classes.outerContainer}>
			{loading && (<div className={classes.loadingOverlay}>Loading...</div>)}
			{props.granularity != "compare" ? (
				<div>
					<div className={classes.svgContainer}>
						<svg
							ref={d3Container}
							preserveAspectRatio="xMinYMin meet"
							viewBox={`0 0 ${width} ${height}`}
							className={classes.svgResponsive}
						/>
					</div>
					<div id="best-worst-interactive"></div>
					<div className={classes.svgContainer}>
						<svg
							ref={histContainer}
							preserveAspectRatio="xMinYMin meet"
							viewBox={`0 0 ${width} ${height}`}
							className={classes.svgResponsive}
						/>
					</div>
				</div>
			) : (
					<div className={classes.svgContainer}>
						<svg
							ref={compareContainer}
							preserveAspectRatio="xMinYMin meet"
							viewBox={`0 0 ${width} ${height}`}
							className={classes.svgResponsive}
						/>
					</div>
				)}

		</div>

	);
}

export default MarketSvg;