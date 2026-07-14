<!-- last reviewed: 2026-07-13 -->

# Resilience Packet Prototype

## Purpose

This folder contains a dependency-free HTML/CSS/JavaScript prototype for publishing Resilience Chicago’s information packet for minors. The primary requirement is to preserve the Figma document’s visual design and pagination behavior while allowing nonprofit staff to maintain source content using Google Docs-style structure.

Treat this as a design-led publishing system. Visual fidelity, considerate information hierarchy, and deterministic page breaks are core requirements—not optional polish.

## Source of Truth

- Packet Figma page: <https://www.figma.com/design/nX8yFtz9kKYPjBQSy8Q3W8/RESILIENCE-CHICAGO?node-id=92-6089>
- Page-system Figma section: <https://www.figma.com/design/nX8yFtz9kKYPjBQSy8Q3W8/RESILIENCE-CHICAGO?node-id=120-8897>
- Google Docs demo: <https://docs.google.com/document/d/1u_cX62gQvb2xD770e0bpoiOryG_DKsj0DKi7_G0hUdY/edit?tab=t.uyp0hctjs5rq>
- Figma frames `01` through `25`, sorted numerically (or left-to-right by canvas position), are the packet pages in order.

When visual details are uncertain, inspect the actual Figma node. Do not approximate icons, page geometry, typography, or spacing from memory. Exact Figma icons and reference-page PNGs are already stored under `assets/`.

## Current Surfaces

- `index.html`: Packet Publisher interface and side-by-side Figma/prototype comparison.
- `style-guide.html`: Document style system, live styled-template preview, live Google Doc embed, component specimens, and pagination rules.
- `packet-content.js`: Complete semantic packet source used by the publisher.
- `app.js`: Content parsing, page generation, deterministic pagination, continuation behavior, Figma comparisons, and publisher controls.
- `styles.css`: Production packet geometry and component styling.
- `style-guide.css` / `style-guide.js`: Style-guide layout and interactions.
- `assets/figma/`: Local reference images for every Figma page.
- `assets/icons/`: Source SVGs and artwork exported from Figma.
- `assets/fonts/`: Local Inter and Raleway variable fonts with license files.

There is no build step or package manager. Keep the project dependency-free unless the user explicitly changes that constraint.

## Running Locally

From this folder:

```sh
python3 -m http.server 8765
```

Open:

- Publisher: <http://localhost:8765/>
- Style guide: <http://localhost:8765/style-guide.html>

The existing Codex preview may instead be served from a parent directory at <http://localhost:8765/outputs/resilience-packet-prototype/>.

Whenever handing off a visual change, include the applicable plain clickable localhost URL.

## Non-Negotiable Page Rules

- Some pages are intentional special-format exceptions and must not be normalized to the standard chapter/content page system:
  - `Prototype · 01` is the packet cover.
  - `Prototype · 02` is the summary graphic. Its visible copy is maintained through the dedicated Summary graphic publisher settings, not the Google Docs content mapping.
- Page geometry is Figma’s native US Letter frame: `612 × 792` CSS pixels.
- Print output uses a `4/3` zoom to produce physical US Letter pages.
- Chapter-opening pages reserve the top title band.
- Subsequent content begins on the shared `y = 136px` content rail; it must not drift upward into the title band.
- Chapter titles occupy the reserved top area only on the opening page.
- Short subsections stay together when they fit. Do not split a small semantic group merely to fill available space.
- Long subsections may split only at semantic block boundaries.
- A split subsection repeats its heading on the next page and normally receives the `CONTINUED` badge.
- Respect the existing `header` and `none` continuation variants where a badge or repeated heading is intentionally suppressed.
- Footers reflect the current chapter and include the page number below the divider.
- Printed page numbers first appear on “In this packet” as page `3`; subsequent packet pages continue from `4`. This footer sequence is separate from the `Prototype · 01` through `Prototype · 25` comparison labels.
- The Hospital Visit continuation intentionally repeats “The hospital is required to offer you” with a `CONTINUED` badge.
- Preserve the deliberate `01` through `25` sequence. About Resilience is pages 06–07, Navigating Emotions is 08–09, Hospital Visit is 10–15, Legal Process is 16–19, School and Work is 20–21, and Minors Rights is 22–25.
- PDF export remains blocked when an unsplittable block is taller than a page.

## Google Docs Mapping

- Heading 1 → chapter title. Normal text immediately following it may become the optional chapter subtitle.
- Heading 2 → chapter section. If split, it repeats with continuation context.
- Heading 3 → nested subsection with the restrained left rule.
- Normal text → packet body copy.
- Website, phone number, and email on one line → formatted contact group.
- Google Docs tables → packet cards or parallel information rows.

The publisher accepts and validates a Google Docs URL, then renders the bundled semantic snapshot in `packet-content.js`. The URL is preserved as the editorial handoff link. It is not authenticated to the Google Docs API and does not claim to live-sync arbitrary documents. The style guide’s Google Doc state is a live external embed of the demo document above.

## Design and QA Expectations

- Pixel-perfect means matching measured Figma values, not making a visually similar approximation.
- Preserve the user’s wording and design intent unless alternatives are requested.
- Use the bundled Inter and Raleway files; do not substitute system fonts.
- Use the real SVG/PNG assets in `assets/`; do not redraw icons.
- Keep frame-specific differences when Figma intentionally varies title type, content width, rail position, spacing, tables, or continuation placement.
- After visual changes, reload the local page and compare the affected prototype page against its matching `assets/figma/page-*.png` reference.
- Check both Figma-visible and Figma-hidden publisher states.
- Verify the settings-collapse control, zoom control, print state, and style-guide Styled Template / Google Doc toggle when touching shared layout or interactions.
- Check for horizontal overflow, clipped content, broken images, and browser console errors.
- Do not clear browser storage or overwrite unrelated user changes.

## Current Intentional Limitations

- The live Google Doc requires network access and remains external to this folder.
- Blank gray visual-grid cells are placeholders for final imagery.
- `assets/google-doc-source.png` is an unused earlier screenshot and is not a runtime dependency.

## Change Discipline

- Inspect the real Figma frame, current HTML/CSS, and rendered browser state before changing visual values.
- Keep changes scoped to the named page, component, or breakpoint.
- Do not broadly normalize frame-specific rules.
- Do not remove Figma comparison assets or publisher QA controls unless explicitly asked.
- Do not publish, deploy, push, or delete files without explicit approval.
