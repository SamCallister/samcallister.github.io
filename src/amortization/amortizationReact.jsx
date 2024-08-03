import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getAmortizationSchedule } from './paymentMath';
import { draw, changeData } from './amortizationSvg.js';
import { TextField, InputAdornment } from '@material-ui/core';
import { isNaN } from 'lodash';
import * as d3 from 'd3';

const width = 500;
const height = 300;

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
	},
	clickable: {
		cursor: 'pointer',
		pointerEvents: 'bounding-box'
	},
	interestRate: {
		width: '6em'
	},
	mortgageAmount: {
		width: '9em'
	},
	inputContainer: {
		display: 'flex',
		justifyContent: 'space-around'
	}
});


function AmortizationReact() {
	const classes = useStyles();
	const d3Container = useRef(null);
	const [interestRate, setInterestRate] = useState(3);
	const [mortgageAmount, setMortgageAmount] = useState(100000);
	const [svgRef, setSvgRef] = useState(null);

	const handleInterestRateChange = (e) => {
		const newRate = parseFloat(e.target.value);

		if (svgRef) {

			setInterestRate(newRate);

			if (!isNaN(newRate) && !isNaN(mortgageAmount) && newRate > 0) {
				changeData(svgRef, newRate, mortgageAmount);
			}
		}
	};

	const handleMortgageAmountChange = (e) => {
		const newMortgageAmount = parseFloat(e.target.value);

		if (svgRef) {
			setMortgageAmount(newMortgageAmount);

			if (!isNaN(newMortgageAmount) && !isNaN(interestRate) && interestRate > 0) {
				changeData(svgRef, interestRate, newMortgageAmount);
			}
		}
	};

    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
	useEffect(() => {
		if (d3Container.current) {
			const amortizationData = getAmortizationSchedule(
				mortgageAmount,
				interestRate / 100,
				30 * 12
			);

			const svgInstance = draw({
				svg: d3.select(d3Container.current),
				data: amortizationData,
				width,
				height
			});

			setSvgRef(svgInstance);
		}
	}, [d3Container])

	return (
		<div className={classes.outerContainer}>
			<div className={classes.svgContainer}>
				<svg ref={d3Container}
					preserveAspectRatio="xMinYMin meet"
					viewBox={`0 0 ${width} ${height}`}
					className={classes.svgResponsive}
				>
					<g
						id="layer1"
						transform="translate(0, 20)"
					>
						<g
							style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
							transform="translate(-1.7998866,-19.798752)"
							clipPath="none"
							id="g172">
							<g
								style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
								id="g170"
							>
								<rect
									style={{ fill: '#008000', fillRule: 'evenodd', strokeWidth: '1.62970739', fillOpacity: '0.84210527', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }}
									id="rect22"
									width="433.77264"
									height="183.58842"
									x="32.397957"
									y="37.613392" />
								<g
									style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
									transform="translate(4.9496881,0.44997167)"
									clipPath="url(#clipPath327)"
									id="g325">
									<g
										style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
										id="g323"
									>
										<path
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }}
											id="path88-13"
											d="m 452.59405,48.435234 c -3.87278,-0.80134 -7.77998,-0.84929 -11.68964,-0.3335 -5.90383,1.36393 -12.27231,4.50561 -13.98671,10.46271 -0.24939,0.86654 -0.26929,1.77886 -0.40393,2.66829 0.18602,0.78836 0.19425,1.63545 0.55806,2.36508 2.0865,4.18453 9.24931,3.69287 13.22372,4.00836 4.00533,0.37352 8.83247,1.36577 10.37078,5.4763 0.25175,0.67269 0.28784,1.40202 0.43175,2.10303 0.0872,2.4208 -0.41575,4.61068 -2.24531,6.40532 -0.63708,0.62492 -1.48726,1.01916 -2.16381,1.60505 -0.65509,0.56731 2.77756,-1.00728 2.09928,-1.54916 -0.81055,-0.64754 -2.04241,0.51917 -3.06362,0.77875 -2.76619,0.3885 -5.49813,0.0301 -8.23157,-0.34968 0,0 -4.65727,3.13172 -4.65727,3.13172 v 0 c 2.78024,0.40686 5.56438,0.79547 8.38813,0.5055 4.8896,-1.10624 12.00424,-3.59835 14.2241,-8.39165 0.83974,-1.81325 0.64533,-2.7713 0.67498,-4.70574 -0.17047,-0.74832 -0.23153,-1.5273 -0.51142,-2.24497 -1.65822,-4.25183 -6.44425,-5.52143 -10.70192,-5.91058 -3.38864,-0.26756 -11.08441,0.0581 -12.81921,-3.43456 -0.33318,-0.67078 -0.31568,-1.45393 -0.47352,-2.18089 0.41996,-2.34903 0.30818,-2.99551 1.66643,-5.13128 0.47593,-0.74839 2.46241,-1.51203 1.73167,-2.04087 -0.83622,-0.60517 -1.88492,0.89673 -2.88211,1.2083 -1.42303,0.4446 5.33832,-2.40702 4.20447,-1.5094 3.84838,-0.60107 7.70856,-0.59837 11.53352,0.20688 0,0 4.72315,-3.14301 4.72315,-3.14301 z" />
										<path
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }}
											id="path94-4"
											d="m 437.15076,43.250864 c 1.32493,8.93973 2.21977,17.931 3.40339,26.88708 0.84584,6.53903 2.1847,13.00427 3.11373,19.532758 0.178,1.54701 0.44773,3.08924 0.54359,4.64454 -6e-5,0.0282 -1.2e-4,0.0564 -1.9e-4,0.0846 0,0 5.14243,-2.53612 5.14243,-2.53612 v 0 c -0.003,-0.0321 -0.007,-0.0643 -0.0105,-0.0964 -0.1706,-1.55007 -0.41121,-3.09244 -0.63146,-4.636468 -0.99499,-6.50543 -2.33453,-12.95708 -3.20312,-19.4797 -1.20776,-8.96556 -2.13467,-17.96508 -3.28165,-26.93824 0,0 -5.07618,2.53801 -5.07618,2.53801 z" />
									</g>
								</g>
								<g
									style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
									id="g325-1"
									clipPath="url(#clipPath327-9)"
									transform="translate(4.9496881,123.22736)">
									<g
										style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
										id="g323-4">
										<path
											d="m 452.59405,48.435234 c -3.87278,-0.80134 -7.77998,-0.84929 -11.68964,-0.3335 -5.90383,1.36393 -12.27231,4.50561 -13.98671,10.46271 -0.24939,0.86654 -0.26929,1.77886 -0.40393,2.66829 0.18602,0.78836 0.19425,1.63545 0.55806,2.36508 2.0865,4.18453 9.24931,3.69287 13.22372,4.00836 4.00533,0.37352 8.83247,1.36577 10.37078,5.4763 0.25175,0.67269 0.28784,1.40202 0.43175,2.10303 0.0872,2.4208 -0.41575,4.61068 -2.24531,6.40532 -0.63708,0.62492 -1.48726,1.01916 -2.16381,1.60505 -0.65509,0.56731 2.77756,-1.00728 2.09928,-1.54916 -0.81055,-0.64754 -2.04241,0.51917 -3.06362,0.77875 -2.76619,0.3885 -5.49813,0.0301 -8.23157,-0.34968 0,0 -4.65727,3.13172 -4.65727,3.13172 v 0 c 2.78024,0.40686 5.56438,0.79547 8.38813,0.5055 4.8896,-1.10624 12.00424,-3.59835 14.2241,-8.39165 0.83974,-1.81325 0.64533,-2.7713 0.67498,-4.70574 -0.17047,-0.74832 -0.23153,-1.5273 -0.51142,-2.24497 -1.65822,-4.25183 -6.44425,-5.52143 -10.70192,-5.91058 -3.38864,-0.26756 -11.08441,0.0581 -12.81921,-3.43456 -0.33318,-0.67078 -0.31568,-1.45393 -0.47352,-2.18089 0.41996,-2.34903 0.30818,-2.99551 1.66643,-5.13128 0.47593,-0.74839 2.46241,-1.51203 1.73167,-2.04087 -0.83622,-0.60517 -1.88492,0.89673 -2.88211,1.2083 -1.42303,0.4446 5.33832,-2.40702 4.20447,-1.5094 3.84838,-0.60107 7.70856,-0.59837 11.53352,0.20688 0,0 4.72315,-3.14301 4.72315,-3.14301 z"
											id="path88-13-4"
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
										<path
											d="m 437.15076,43.250864 c 1.32493,8.93973 2.21977,17.931 3.40339,26.88708 0.84584,6.53903 2.1847,13.00427 3.11373,19.532758 0.178,1.54701 0.44773,3.08924 0.54359,4.64454 -6e-5,0.0282 -1.2e-4,0.0564 -1.9e-4,0.0846 0,0 5.14243,-2.53612 5.14243,-2.53612 v 0 c -0.003,-0.0321 -0.007,-0.0643 -0.0105,-0.0964 -0.1706,-1.55007 -0.41121,-3.09244 -0.63146,-4.636468 -0.99499,-6.50543 -2.33453,-12.95708 -3.20312,-19.4797 -1.20776,-8.96556 -2.13467,-17.96508 -3.28165,-26.93824 0,0 -5.07618,2.53801 -5.07618,2.53801 z"
											id="path94-4-2"
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
									</g>
								</g>
								<g
									style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
									transform="translate(-390.92167,123.22736)"
									clipPath="url(#clipPath327-9-7)"
									id="g325-1-1">
									<g
										style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
										id="g323-4-7"
									>
										<path
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }}
											id="path88-13-4-4"
											d="m 452.59405,48.435234 c -3.87278,-0.80134 -7.77998,-0.84929 -11.68964,-0.3335 -5.90383,1.36393 -12.27231,4.50561 -13.98671,10.46271 -0.24939,0.86654 -0.26929,1.77886 -0.40393,2.66829 0.18602,0.78836 0.19425,1.63545 0.55806,2.36508 2.0865,4.18453 9.24931,3.69287 13.22372,4.00836 4.00533,0.37352 8.83247,1.36577 10.37078,5.4763 0.25175,0.67269 0.28784,1.40202 0.43175,2.10303 0.0872,2.4208 -0.41575,4.61068 -2.24531,6.40532 -0.63708,0.62492 -1.48726,1.01916 -2.16381,1.60505 -0.65509,0.56731 2.77756,-1.00728 2.09928,-1.54916 -0.81055,-0.64754 -2.04241,0.51917 -3.06362,0.77875 -2.76619,0.3885 -5.49813,0.0301 -8.23157,-0.34968 0,0 -4.65727,3.13172 -4.65727,3.13172 v 0 c 2.78024,0.40686 5.56438,0.79547 8.38813,0.5055 4.8896,-1.10624 12.00424,-3.59835 14.2241,-8.39165 0.83974,-1.81325 0.64533,-2.7713 0.67498,-4.70574 -0.17047,-0.74832 -0.23153,-1.5273 -0.51142,-2.24497 -1.65822,-4.25183 -6.44425,-5.52143 -10.70192,-5.91058 -3.38864,-0.26756 -11.08441,0.0581 -12.81921,-3.43456 -0.33318,-0.67078 -0.31568,-1.45393 -0.47352,-2.18089 0.41996,-2.34903 0.30818,-2.99551 1.66643,-5.13128 0.47593,-0.74839 2.46241,-1.51203 1.73167,-2.04087 -0.83622,-0.60517 -1.88492,0.89673 -2.88211,1.2083 -1.42303,0.4446 5.33832,-2.40702 4.20447,-1.5094 3.84838,-0.60107 7.70856,-0.59837 11.53352,0.20688 0,0 4.72315,-3.14301 4.72315,-3.14301 z" />
										<path
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }}
											id="path94-4-2-9"
											d="m 437.15076,43.250864 c 1.32493,8.93973 2.21977,17.931 3.40339,26.88708 0.84584,6.53903 2.1847,13.00427 3.11373,19.532758 0.178,1.54701 0.44773,3.08924 0.54359,4.64454 -6e-5,0.0282 -1.2e-4,0.0564 -1.9e-4,0.0846 0,0 5.14243,-2.53612 5.14243,-2.53612 v 0 c -0.003,-0.0321 -0.007,-0.0643 -0.0105,-0.0964 -0.1706,-1.55007 -0.41121,-3.09244 -0.63146,-4.636468 -0.99499,-6.50543 -2.33453,-12.95708 -3.20312,-19.4797 -1.20776,-8.96556 -2.13467,-17.96508 -3.28165,-26.93824 0,0 -5.07618,2.53801 -5.07618,2.53801 z" />
									</g>
								</g>
								<g
									style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
									id="g325-1-1-7"
									clipPath="url(#clipPath327-9-7-9)"
									transform="translate(-390.92167,0.20511325)">
									<g
										style={{ stroke: '#c6d5bf', strokeOpacity: '1', strokeWidth: '1.62970739', strokeMiterlimit: '4', strokeDasharray: 'none' }}
										id="g323-4-7-9">
										<path
											d="m 452.59405,48.435234 c -3.87278,-0.80134 -7.77998,-0.84929 -11.68964,-0.3335 -5.90383,1.36393 -12.27231,4.50561 -13.98671,10.46271 -0.24939,0.86654 -0.26929,1.77886 -0.40393,2.66829 0.18602,0.78836 0.19425,1.63545 0.55806,2.36508 2.0865,4.18453 9.24931,3.69287 13.22372,4.00836 4.00533,0.37352 8.83247,1.36577 10.37078,5.4763 0.25175,0.67269 0.28784,1.40202 0.43175,2.10303 0.0872,2.4208 -0.41575,4.61068 -2.24531,6.40532 -0.63708,0.62492 -1.48726,1.01916 -2.16381,1.60505 -0.65509,0.56731 2.77756,-1.00728 2.09928,-1.54916 -0.81055,-0.64754 -2.04241,0.51917 -3.06362,0.77875 -2.76619,0.3885 -5.49813,0.0301 -8.23157,-0.34968 0,0 -4.65727,3.13172 -4.65727,3.13172 v 0 c 2.78024,0.40686 5.56438,0.79547 8.38813,0.5055 4.8896,-1.10624 12.00424,-3.59835 14.2241,-8.39165 0.83974,-1.81325 0.64533,-2.7713 0.67498,-4.70574 -0.17047,-0.74832 -0.23153,-1.5273 -0.51142,-2.24497 -1.65822,-4.25183 -6.44425,-5.52143 -10.70192,-5.91058 -3.38864,-0.26756 -11.08441,0.0581 -12.81921,-3.43456 -0.33318,-0.67078 -0.31568,-1.45393 -0.47352,-2.18089 0.41996,-2.34903 0.30818,-2.99551 1.66643,-5.13128 0.47593,-0.74839 2.46241,-1.51203 1.73167,-2.04087 -0.83622,-0.60517 -1.88492,0.89673 -2.88211,1.2083 -1.42303,0.4446 5.33832,-2.40702 4.20447,-1.5094 3.84838,-0.60107 7.70856,-0.59837 11.53352,0.20688 0,0 4.72315,-3.14301 4.72315,-3.14301 z"
											id="path88-13-4-4-6"
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
										<path
											d="m 437.15076,43.250864 c 1.32493,8.93973 2.21977,17.931 3.40339,26.88708 0.84584,6.53903 2.1847,13.00427 3.11373,19.532758 0.178,1.54701 0.44773,3.08924 0.54359,4.64454 -6e-5,0.0282 -1.2e-4,0.0564 -1.9e-4,0.0846 0,0 5.14243,-2.53612 5.14243,-2.53612 v 0 c -0.003,-0.0321 -0.007,-0.0643 -0.0105,-0.0964 -0.1706,-1.55007 -0.41121,-3.09244 -0.63146,-4.636468 -0.99499,-6.50543 -2.33453,-12.95708 -3.20312,-19.4797 -1.20776,-8.96556 -2.13467,-17.96508 -3.28165,-26.93824 0,0 -5.07618,2.53801 -5.07618,2.53801 z"
											id="path94-4-2-9-9"
											style={{ fill: '#000000', strokeWidth: '1.62970739', stroke: '#c6d5bf', strokeOpacity: '1', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
									</g>
								</g>
							</g >
						</g >
						<rect
							y="47.785122"
							x="73.215225"
							height="117.04652"
							width="348.68011"
							id="rect502"
							style={{ fill: '#000000', stroke: '#e3e2db', strokeWidth: '1.20274', strokeMiterlimit: '4', strokeDasharray: 'none', fillOpacity: '0' }} />
					</g >
					<g transform="translate(0, 243)">
						<g id="pause-button" transform="scale(0.07)" className={classes.clickable} style={{ display: 'none' }}>
							<path d="m436.508 74.94c-99.913-99.913-261.64-99.928-361.567 0-99.913 99.913-99.928 261.64 0 361.567 99.913 99.913 261.64 99.928 361.567 0 99.912-99.912 99.927-261.639 0-361.567zm-180.784 394.45c-117.816 0-213.667-95.851-213.667-213.667s95.851-213.666 213.667-213.666 213.666 95.851 213.666 213.667-95.85 213.666-213.666 213.666z" /><path d="m298.39 160.057c-11.598 0-21 9.402-21 21v149.333c0 11.598 9.402 21 21 21s21-9.402 21-21v-149.333c0-11.598-9.401-21-21-21z" /><path d="m213.057 160.057c-11.598 0-21 9.402-21 21v149.333c0 11.598 9.402 21 21 21s21-9.402 21-21v-149.333c0-11.598-9.401-21-21-21z" />
						</g>
					</g>
					<g transform="translate(0, 243)">
						<g id="play-button" transform="scale(0.07)" className={classes.clickable}>
							<path d="m436.508 74.941c-99.913-99.913-261.639-99.928-361.566 0-99.914 99.912-99.93 261.64 0 361.567 99.913 99.913 261.639 99.928 361.566 0 99.913-99.912 99.929-261.64 0-361.567zm-180.784 394.45c-117.816 0-213.667-95.851-213.667-213.667s95.851-213.666 213.667-213.666 213.667 95.851 213.667 213.667-95.85 213.666-213.667 213.666z" /><path d="m332.617 239.148-96-74.667c-13.774-10.715-33.893-.863-33.893 16.577v149.333c0 17.563 20.25 27.186 33.893 16.577l96-74.667c10.796-8.398 10.809-24.745 0-33.153zm-87.893 48.305v-63.458l40.795 31.729z" />
						</g>
					</g>
				</svg >
			</div >
			<div className={classes.inputContainer}>
				<TextField
					value={interestRate}
					label="Interest Rate"
					onChange={handleInterestRateChange}
					className={classes.interestRate}
					step={0.1}
					InputProps={{
						startAdornment: <InputAdornment position="start">%</InputAdornment>,
						type: "number"
					}}
				>
				</TextField>
				<TextField
					value={mortgageAmount}
					label="Mortgage Amount"
					onChange={handleMortgageAmountChange}
					className={classes.mortgageAmount}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
						type: "number"
					}}
				>
				</TextField>
			</div>
		</div >
	);
}

export default AmortizationReact;