const LEGACY_FRAME_CLASSES = {
  1: 117,
  2: 118,
  3: 119,
  4: 120,
  5: 121,
  6: 122,
  7: 130,
  8: 129,
  9: 131,
  10: 123,
  11: 124,
  12: 125,
  13: 126,
  14: 127,
  15: 128,
  16: 132,
  20: 133,
  22: 134,
  23: 135,
  24: 136,
  25: 137,
};

function decoratePaper(paper, index, isLiveDocument) {
  const pageNumber = index + 1;
  const pageLabel = String(pageNumber).padStart(2, "0");
  paper.classList.add(isLiveDocument ? `imported-page-${pageLabel}` : `page-${pageLabel}`);
  if (!isLiveDocument && LEGACY_FRAME_CLASSES[pageNumber]) {
    paper.classList.add(`letter-${LEGACY_FRAME_CLASSES[pageNumber]}`);
  }
  paper.dataset.figmaFrame = pageLabel;
}

function makeComparison(paper) {
  const frameName = paper.dataset.figmaFrame;
  const pageStyle = paper.dataset.pageStyle || "";
  const comparison = document.createElement("section");
  comparison.className = "page-comparison";
  if (pageStyle) comparison.classList.add(`page-style-${pageStyle}`);
  comparison.setAttribute("aria-label", `${frameName} comparison`);

  const referenceColumn = document.createElement("figure");
  referenceColumn.className = "comparison-column figma-reference-column";
  const referenceLabel = document.createElement("figcaption");
  referenceLabel.className = "comparison-label";
  referenceLabel.textContent = `Figma · ${frameName}`;
  const referenceImage = document.createElement("img");
  referenceImage.className = "figma-reference-page";
  referenceImage.src = `assets/figma/page-${frameName}.png`;
  referenceImage.alt = `Page ${frameName} from Figma`;
  referenceImage.width = 612;
  referenceImage.height = 792;
  referenceColumn.append(referenceLabel, referenceImage);

  const prototypeColumn = document.createElement("div");
  prototypeColumn.className = "comparison-column prototype-column";
  const prototypeLabel = document.createElement("p");
  prototypeLabel.className = "comparison-label";
  prototypeLabel.textContent = ({
    cover: "Cover",
    "summary-graphic": "Summary Graphic",
    letter: "Letter",
  })[pageStyle] || `Prototype · ${frameName}`;
  prototypeColumn.append(prototypeLabel, paper);

  comparison.append(referenceColumn, prototypeColumn);
  return comparison;
}

export function makePageComparisons(papers, isLiveDocument) {
  papers.forEach((paper, index) => decoratePaper(paper, index, isLiveDocument));
  return papers.map(makeComparison);
}
