# Resilience Packet Publisher Prototype

A local, dependency-free browser prototype containing the complete 25-page Figma packet and demonstrating:

- exact US Letter page geometry based on the Figma packet;
- a permanently reserved chapter-title band;
- a Google Docs URL handoff control backed by a local semantic content snapshot;
- automatic keep-together behavior for short subsections;
- semantic splitting of long subsections;
- repeated subsection headings with generated `CONTINUED` badges;
- chapter-aware footers and print-to-PDF output;
- dedicated cover, orientation-card, introductory-letter, and contents templates;
- the full Caregiver, About Resilience, Navigating Emotions, Hospital Visit, Legal Process, At School and Work, and Minors Rights chapters;
- legal Q&A cards, emotion exercises, visual grids, process rows, contact strips, comparison cards, and left-rule callouts.

The design-QA pass uses Figma’s native 612×792 coordinate system directly in CSS pixels, with a 4/3 print zoom for physical US Letter output. Frame-specific variants preserve the packet’s intentional differences in title typeface, content rails, subsection spacing, continuation placement, tables, and interactive layouts.

Figma SVGs are bundled under `assets/icons/` for the website, phone, email, continuation label, and the complete Letter 118 orientation artwork. The prototype does not depend on Figma’s temporary asset URLs at runtime.

The rendered packet follows the exact numbered Figma frame order, `01` through `25`. The reordered run now keeps About Resilience and Navigating Emotions together, and includes the added Orders of Protection, survivor-based immigration, and continued employment pages. The corrected Hospital Visit continuation repeats “The hospital is required to offer you” with a `CONTINUED` badge.

Pasted markup is reduced to supported semantic formatting, and PDF export is blocked if an unsplittable block is taller than a page. Print colors are forced to exact mode where the browser supports it.

Run locally:

```sh
python3 -m http.server 8765
```

Then open `http://localhost:8765/outputs/resilience-packet-prototype/`.

This is still a prototype: the Google Docs URL is retained as the editorial source link while the browser renders the bundled semantic snapshot. Live document fetching would require an authenticated Docs API or a same-origin server endpoint. Blank gray visual-grid cells remain placeholders for final imagery.
