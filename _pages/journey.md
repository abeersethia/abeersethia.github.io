---
layout: page
title: Journey
permalink: /journey/
description: Education, research, and industry experience.
nav: true
nav_order: 3
---

<div class="journey-page">
  {% assign journey = site.data.journey %}

  {% if journey.intro %}
    <p class="page-intro">{{ journey.intro }}</p>
  {% endif %}

  {% include journey_filters.liquid %}
  {% include journey-timeline.liquid %}
</div>
