import { range, each } from 'lodash';


function getMonthlyPayment(loanAmount, yearlyInterest, months) {
	const a = loanAmount;
	const i = yearlyInterest / 12;
	const n = months

	return a * (i * (i + 1) ** n) / (((1 + i) ** n) - 1)
}

/*
* Returns [{interestPayment, principalPayment, totalInterest, totalPrincipal, endBalance}]
*/
function getAmortizationSchedule(loanAmount, yearlyInterest, months) {
	const monthlyPayment = getMonthlyPayment(loanAmount, yearlyInterest, months);
	const monthlyInterestRate = yearlyInterest / 12;

	let interestPayment = loanAmount * monthlyInterestRate;
	let principalPayment = monthlyPayment - interestPayment;
	let endBalance = loanAmount - principalPayment;

	const payments = [{
		interestPayment,
		principalPayment,
		totalInterest: interestPayment,
		totalPrincipal: principalPayment,
		endBalance
	}];

	each(range(months - 1), (i) => {
		const prevPaymentInfo = payments[i];
		let interestPayment = prevPaymentInfo.endBalance * monthlyInterestRate;
		let principalPayment = monthlyPayment - interestPayment;
		let endBalance = prevPaymentInfo.endBalance - principalPayment;

		payments.push({
			interestPayment,
			principalPayment,
			totalInterest: prevPaymentInfo.totalInterest + interestPayment,
			totalPrincipal: prevPaymentInfo.totalPrincipal + principalPayment,
			endBalance
		})
	});

	return payments;
}

export {
	getAmortizationSchedule
};