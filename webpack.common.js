const path = require("path");

module.exports = {
	entry: {
		marketTiming: path.join(
			__dirname, "src", "marketTiming", "bestOfTimesWorstOfTimesIndex.js"
		),
		amortization: path.join(
			__dirname, "src", "amortization", "amortizationIndex.js"
		),
		lifeExpectancy: path.join(
			__dirname, "src", "lifeExpectancy", "lifeExpectancyIndex.js"
		),
	},
	output: {
		path: path.join(__dirname, 'assets/js/custom'),
		filename: '[name].js',
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: [
				path.resolve(__dirname, "node_modules"),
			],
			include: path.resolve(__dirname, "src"),
			use: ["babel-loader"]
		},
		{
			test: /\.css$/i,
			exclude: [
				path.resolve(__dirname, "node_modules"),
			],
			include: path.resolve(__dirname, "src"),
			use: ['style-loader', 'css-loader'],
		},
		],
	},
	resolve: {
		extensions: [".json", ".js", ".jsx"],
	},
};