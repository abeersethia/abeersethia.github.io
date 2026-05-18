---
layout: page
title: Work
permalink: /projects/
description: Selected projects in medical imaging, computer vision, and machine learning.
nav: true
nav_order: 2
horizontal: true
---

{% assign work = site.data.portfolio.pages.work %}

<p class="page-intro">{{ work.intro }}</p>

{% include project_filters.liquid %}

<div class="projects" id="projects-grid">
{% assign sorted_projects = site.projects | sort: 'importance' | reverse %}
<div class="container px-0">
  <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% if project.listed != false %}
        {% include projects_horizontal.liquid %}
      {% endif %}
    {% endfor %}
  </div>
</div>
</div>
