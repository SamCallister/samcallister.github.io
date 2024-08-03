---
layout: single
title:  "S&P Best of Times Wost of Times"
date:   2020-07-01
categories: finance
header:
  image: /assets/images/reference-books-on-shelves.jpg
author: Sam
permalink: /projects/sp-performance
---

[Investment wizards](https://www.businessinsider.com/personal-finance/warren-buffett-recommends-index-funds-for-most-investors) tell us regular folks to buy and hold index funds. I've read many times that while the market goes up and down year to year, the _average_ yearly return of the market is positive; patient investors will make money in the long term.

An average return of 7% per year sounds pretty good, but as the United States Airforce discovered, [averages can be misleading](https://www.thestar.com/news/insight/2016/01/16/when-us-air-force-discovered-the-flaw-of-averages.html). I want to know what's hiding behind that average. What if I were to buy into the market right before a big crash? What if I bought in at the best possible time? What does the spread of possible returns look like? Does the spread look different for lump sum investments vs monthly investments made over a long period of time? This article will address these questions and allow you to explore S&P investment scenarios yourself.

## The Lump Sum Case

If you unexpectedly inherited $1000 dollars, what would you do with it? If your mind went to investing, reconsider your boring life. Just kidding! You’re in the [right place](https://en.wikipedia.org/wiki/FIRE_movement). Read on to experience this lame fantasy vicariously through Jim, our hypothetical heir.

Jim inherits $1000 from his great aunt Betsy, God rest her soul. He plans to buy into the market and hold his position for 10 years at which point he will cash out. Jim is about to call his broker when his friend Tom drops by and relates a tragic tale of losing half his fortune in the S&P! Now Jim is worried about losing money. He wants to know what his chances are. Using historical S&P prices, we can give Jim an idea of the range of possible outcomes for a 10-year investment in the S&P.

In this graph, we consider buying into the S&P in a given month and selling in that same month 10 years later. We will consider all such intervals from 1970-2020. Our first interval will buy into the market Jan 1970 and sell Jan 1980, our second buys in Feb 1970 and sells Feb 1980, our third... you get the idea. There are 480 such intervals from Jan 1970 to Jan 2020. Of these 480 intervals the graph below shows the best, worst and average percent returns.

<div id="lump-best-worst" class="svg-container"></div>
<div id="lump-best-worst-desc" class="best-worst-desc"></div>

<br>

If Jim bought during the dotcom run up and sold before the bust, he would quadruple his initial investment in 10 years! On the flipside, buying in right before the dot com bust and selling after the 2008 mortgage crisis would cause him to lose half of his investment like his friend Tom. However, the median interval looks promising, showing a doubling of the initial investment in 10 years.

Now let's take a look at the percent return of all 480 intervals. I included a dashed line at 0% return, so we can see roughly how many intervals provide a positive vs negative return.

<div id="lump-best-worst-hist" class="svg-container"></div>

Here we can see that the majority of 480 intervals are on the north side of 0. Comforting news for Jim, showing that based on past returns a 10-year investment in the S&P can be expected to make money ~87% of the time. YOLO Jimbo, go west young man!

## Monthly Investments Case

At one time or another I’m sure _most_ of us, while plugging through another work week, have thought: “Is this the rest of my life?” David Graebor’s fascinating [Debt the First 5000 years](https://www.amazon.com/Debt-First-5-000-Years/dp/1612191290) claims the ancient Greeks would have seen modern employment as akin to slavery. We rent ourselves out for 40 hours a week for our livelihood! For most of us, the only way to buy back our time is saving enough money for retirement.

Most 401Ks allow you to invest a part of your paycheck into the market every month. Here we will consider investing the same _total_ amount of money as the lump sum case ($1000) split up over each month in the 10-year interval. This comes out to investing $8.33 each month. Here are the investment returns for each 10-year interval in the past 50 years.

<div id="monthly-best-worst" class="svg-container"></div>
<div id="monthly-best-worst-desc" class="best-worst-desc"></div>

<div id="monthly-best-worst-hist" class="svg-container"></div>

Like the lump sum case, the majority of the intervals yield a positive return. However the monthly case has a slightly better win rate of ~90% compared to ~87% in the lump sum case.

## Lump Sum vs Monthly Investment Comparison

Let's take a closer look at the differences between the lump sum and monthly case by overlaying the distribution of returns for each on the same graph. We replace each histogram with a curve estimating its shape, so that we can more easily plot both distributions on the same graph.

<div id="monthly-vs-lump" class="svg-container"></div>

The _variance_ of the monthly investment distribution of possible returns is significantly less than the lump sum distribution. By investing monthly, we hedge against the chance of choosing a _single_ terrible (or amazing) 10-year entry and exit. Instead we are investing 12 times a year in each of the 10 years = 120 entry and exit intervals.

In this case, spacing out a sum of money into monthly investments decreases the magnitude of downside and upside on the distribution of possible returns.

## Interactive Exploration

Take the data for a spin! Below I have selected investing $1000 per month for 20 years, considering 20-year intervals between 1950 and 2020. There is a million dollar spread between the best and worst outcomes. You could be the guy diligently socking away $1000 dollars per month over a 20-year career from 1962 and 1982 and be down 14% on that $240,000 dollars invested over the 20 years! Begs the question: If I invest monthly into the market, and the market falls significantly when I retire, *how long do I need to wait for my investment to be in the black again*? A question for another post.

<div id="root">
</div>
<script src="{{'/assets/js/custom/marketTiming.js' | prepend: site.baseurl}}"></script>

<br>

This data was compiled by [Mr. Robert Shiller](http://www.econ.yale.edu/~shiller/data.htm). The S&P price index used reflects dividends in addition to share price. Past performance may not indicate future returns.