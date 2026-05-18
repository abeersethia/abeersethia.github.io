---
layout: page
title: Work
permalink: /projects/
description:
nav: true
nav_order: 2
horizontal: true
---

<div class="work-page">
  <p class="work-page__label">Selected Projects in Medical Imaging, CV, GNNs and More</p>
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
