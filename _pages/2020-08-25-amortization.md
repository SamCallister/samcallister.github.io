---
layout: single
title:  "Amortization Visualized"
date:   2020-08-25
categories: finance
header:
  image: /assets/images/money-amortization.jpg
published: true
author: Sam
permalink: /projects/amortization
---

The majority of consumer debt in America is [housing related](https://www.newyorkfed.org/microeconomics/hhdc.html). You will likely find yourself saddled with a mortgage at some point. In this article we will visualize the concept at the heart of paying off a mortgage: amortization.

## Amortization

Most home buyers do not have enough money to buy a home outright. Instead, they pay a small fraction of the home price and take out a loan to cover the rest. They then slowly pay off the loan over some period of time (usually 15 or 30 years) by making monthly payments.

This process of paying a loan off over time through regular payments is called amortization. Some portion of every mortgage payment goes towards paying interest: the monthly cost of borrowing the money. Another portion of the payment goes towards principal: the remaining balance due. Other portions of the monthly payment may go towards things like property taxes, private mortgage insurance, and homeowners insurance. These other categories will not be addressed in this article.

What’s interesting about the interest and principal payments is that their amounts change over the life of the loan. As time progresses, the portion of each monthly payment that goes towards interest shrinks while the amount going towards principal increases.

This happens because the amount of interest owed in a given month depends on the remaining balance of the loan at that time. Take a yearly interest rate of 3% and a remaining balance of $100,000 for example. The interest owed on the next mortgage payment is equal to the _monthly_ interest rate times the remaining loan balance: (0.03/12) * $100,000 = $250. If the interest and principal portion of the mortgage payment was $1,000 in this case, $250 would go to interest and $750 would go to the remaining balance. Now the remaining balance is $99,828.4 which means the interest on next month’s payment will be $249.57 meaining more of that payment will go towards decreasing the loan balance. The visualization below illustrates this phenomenon.


<div id="amortization-svg">
</div>

Try changing the interest rate and mortgage amount. If the interest rate is high enough, a borrower will end up paying more interest than principal over the life of a loan!

If borrowers have the means, they can choose to make extra principal payments towards their loan balance. Doing so will result in them paying _less_ total interest than if they only made regular payments. I will visualize this concept in another post coming soon!

<script src="{{'/assets/js/custom/amortization.js' | prepend: site.baseurl}}"></script>