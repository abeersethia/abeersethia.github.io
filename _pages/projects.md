---
layout: page
title: Work
permalink: /projects/
description: Deep learning projects in 3D medical imaging, time-series modeling, computer vision, graphs, and NLP.
nav: true
nav_order: 2
horizontal: true
---

<div class="work-page">
  <div class="work-page__intro">
    <p class="work-page__label">{{ site.data.portfolio.work.label }}</p>
    {% if site.data.portfolio.work.note %}
      <p class="work-page__label work-page__label--note">{{ site.data.portfolio.work.note }}</p>
    {% endif %}
  </div>
  <hr class="work-page__rule" aria-hidden="true">
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
</div>
