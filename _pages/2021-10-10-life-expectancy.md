---
layout: single
title:  "Death of a Peer Group"
date:   2021-10-10
categories: life
header:
  image: /assets/images/graveyard.jpg
published: true
author: Sam
permalink: /projects/life-expectancy
---

Growing up on Utah’s Wasatch front, I enjoyed running along the [Bonneville Shoreline Trail](https://www.bonnevilleshorelinetrail.org/). The trail snakes along mountainsides, offering spectacular views of the valley below. One day, I noticed a plaque beneath a tall transmission tower just off the trail.

![memorial](/assets/images/bonneville_trail.jpg)
*Bonneville Shoreline Trail*

The plaque memorializes a 15-year-old boy who died climbing one of the tall transmission towers along the trail. Its text praises the adventurous spirit while urging caution in all endeavors. 

![memorial](/assets/images/memorial.jpg)
*Memorial*

Thinking back on that plaque, I found myself caught up in a moment of morbid curiosity. How many of those born the same year as me have already died? 1%? 5%?

There are many organizations with a vested stake in estimating the duration of a human life. I’m currently employed by one&#8212;Ladder ([easy, online life insurance](https://www.ladderlife.com/)). In the public sector, important policy decisions are informed by life expectancies. The Social Security administration provides [cohort life expectancy tables](https://www.ssa.gov/oact/NOTES/as116/as116LOT.html), which provide a rough estimate of deaths per year for a given  cohort of people born in the same year.
 
The visualization below uses the Social Security administration's [1990 cohort life table](https://www.ssa.gov/oact/NOTES/as116/as116_Tbl_7_1990.html#wp1081276) to show what percent of Americans born in 1990 are expected to die within a given decade. The data comes from a 2002 study. Mortality data not yet available is estimated (you can read about the methodology [here](https://www.ssa.gov/oact/NOTES/as116/as116_I_II_III.html#wp998295)). We can use this visual to estimate how many of our own peers will be dead as we age.

Each color represents a decade of life. For example, the dark blue bar represents what percentage of those born in 1990 died when they were 0-10 yrs old.

<div class="svg-container">
  <svg id="people-svg">
  
  </svg>
  
</div>

<script src="{{'/assets/js/custom/lifeExpectancy.js' | prepend: site.baseurl}}"></script>

We can see that childhood death is quite rare with 99% of the cohort making it into their twenties. Also noteworthy is that the forecast shows ~62% of people living to the age of 80, surpassing the general life expectancy of ~78 years. The average is pulled down because the first year of life has a spike in mortality.

And so, our morbid question is answered with good news. If you make it through the first year of life, you and your peers will most likely live past 80 years old.
