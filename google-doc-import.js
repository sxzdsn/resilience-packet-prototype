const GOOGLE_DOC_BLOCK_SELECTOR = "h1,h2,h3,h4,h5,h6,p,ul,ol,table,figure,img,hr";

function styleDeclarations(node, styleMap) {
  const classRules = [...node.classList].map((name) => styleMap.get(name) || "").join(";");
  return `${classRules};${node.getAttribute("style") || ""}`.toLowerCase();
}

function googleClassStyleMap(doc) {
  const map = new Map();
  const css = [...doc.querySelectorAll("style")].map((node) => node.textContent).join("\n");
  const rulePattern = /\.([a-zA-Z0-9_-]+)\s*\{([^}]*)\}/g;
  let match;
  while ((match = rulePattern.exec(css))) map.set(match[1], match[2]);
  return map;
}

function isRedStyle(declarations) {
  return /(?:^|;)\s*(?:color|background-color)\s*:\s*(?:red|#(?:f00|ff0000)\b|rgb\(\s*255\s*,\s*0\s*,\s*0\s*\)|rgba\(\s*255\s*,\s*0\s*,\s*0\s*,)/i.test(declarations);
}

function isPageBreak(node, styleMap) {
  const declarations = styleDeclarations(node, styleMap);
  if (/page-break-(?:before|after)\s*:\s*always|break-(?:before|after)\s*:\s*page/.test(declarations)) return true;
  return node.tagName === "HR" && /page-break|break-before|break-after/.test(declarations);
}

function wrapNode(node, tagName) {
  const wrapper = node.ownerDocument.createElement(tagName);
  node.replaceWith(wrapper);
  wrapper.append(node);
  return wrapper;
}

function preserveGoogleInlineStyles(root, styleMap, ignoreRedText) {
  const candidates = [root, ...root.querySelectorAll("span,a")];
  candidates.forEach((node) => {
    if (node !== root && !root.contains(node)) return;
    const declarations = styleDeclarations(node, styleMap);
    if (ignoreRedText && isRedStyle(declarations)) {
      node.remove();
      return;
    }

    if (node.tagName !== "SPAN") return;
    let outer = node;
    if (/font-weight\s*:\s*(?:bold|[6-9]00)/.test(declarations)) outer = wrapNode(outer, "strong");
    if (/font-style\s*:\s*italic/.test(declarations)) outer = wrapNode(outer, "em");
    if (/text-decoration(?:-line)?\s*:[^;]*underline/.test(declarations)) wrapNode(outer, "u");
    node.replaceWith(...node.childNodes);
  });
}

function topLevelGoogleBlocks(doc) {
  return [...doc.body.querySelectorAll(GOOGLE_DOC_BLOCK_SELECTOR)].filter((node) => {
    const parentBlock = node.parentElement?.closest(GOOGLE_DOC_BLOCK_SELECTOR);
    return !parentBlock;
  });
}

function contactItemsFromText(value) {
  const email = value.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0];
  const phone = value.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/)?.[0];
  const website = value.match(/(?:https?:\/\/|www\.)[^\s,;]+|\b[a-z0-9-]+\.(?:org|com|net|edu)\b[^\s,;]*/i)?.[0];
  return website && phone && email ? [website.replace(/[.)]+$/, ""), phone, email] : null;
}

function makeContactSourceBlock(items) {
  const block = document.createElement("div");
  block.dataset.blockType = "contact-row";
  items.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    block.append(span);
  });
  return block;
}

function makeCardGridSourceBlock(table) {
  const grid = table.ownerDocument.createElement("div");
  grid.dataset.blockType = "card-grid";
  grid.dataset.layout = "columns";
  grid.dataset.importedTable = "true";
  [...table.rows].forEach((row) => {
    [...row.cells].forEach((cell) => {
      const article = table.ownerDocument.createElement("article");
      article.innerHTML = cell.innerHTML;
      grid.append(article);
    });
  });
  return grid;
}

function safeImageSource(value) {
  return /^(?:https:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(value || "");
}

function imageDimension(image, property) {
  const attribute = Number.parseFloat(image.getAttribute(property));
  if (Number.isFinite(attribute) && attribute > 0) return attribute;
  const match = (image.getAttribute("style") || "").match(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([\\d.]+)px`, "i"));
  return match ? Number.parseFloat(match[1]) : 0;
}

function makeImageSourceBlocks(node) {
  const images = node.tagName === "IMG" ? [node] : [...node.querySelectorAll("img")];
  const caption = node.tagName === "IMG" ? "" : node.textContent.trim();
  return images.flatMap((sourceImage, index) => {
    const src = sourceImage.getAttribute("src") || "";
    if (!safeImageSource(src)) return [];
    const figure = node.ownerDocument.createElement("figure");
    figure.dataset.blockType = "doc-image";
    const image = node.ownerDocument.createElement("img");
    image.src = src;
    image.alt = sourceImage.getAttribute("alt") || sourceImage.getAttribute("title") || "";
    const width = imageDimension(sourceImage, "width");
    const height = imageDimension(sourceImage, "height");
    if (width) figure.dataset.width = String(width);
    if (height) figure.dataset.height = String(height);
    figure.append(image);
    if (caption && index === 0) {
      const figcaption = node.ownerDocument.createElement("figcaption");
      figcaption.textContent = caption;
      figure.append(figcaption);
    }
    return [figure];
  });
}

function pageDirectiveType(node, styleMap) {
  const match = node.textContent.trim().match(/^\[(cover|summary graphic|letter)\]$/i);
  if (!match) return "";
  const isRed = [node, ...node.querySelectorAll("span,a")]
    .some((candidate) => isRedStyle(styleDeclarations(candidate, styleMap)));
  if (!isRed) return "";
  return match[1].toLowerCase().replace(" ", "-");
}

function manualPageBreakRuns(node, styleMap) {
  return [node, ...node.querySelectorAll("span,a")].filter((candidate) => (
    /^<\s*page break\s*>$/i.test(candidate.textContent.trim())
    && isRedStyle(styleDeclarations(candidate, styleMap))
  ));
}

function isStandalonePageBreakDirective(node, styleMap) {
  return /^<\s*page break\s*>$/i.test(node.textContent.trim())
    && manualPageBreakRuns(node, styleMap).length > 0;
}

function splitAtManualPageBreaks(node, styleMap) {
  const markers = manualPageBreakRuns(node, styleMap).filter((candidate) => candidate !== node);
  if (!markers.length) return { nodes: [node], count: 0, trailingBreak: false };

  const segments = [];
  let startContainer = node;
  let startOffset = 0;
  let breakBefore = false;

  const appendSegment = (range) => {
    const segment = node.cloneNode(false);
    segment.removeAttribute("id");
    segment.append(range.cloneContents());
    const hasContent = Boolean(segment.textContent.trim() || segment.querySelector("img,br"));
    if (!hasContent) return false;
    if (breakBefore) segment.dataset.pageBreakBefore = "true";
    segments.push(segment);
    return true;
  };

  markers.forEach((marker) => {
    const range = node.ownerDocument.createRange();
    range.setStart(startContainer, startOffset);
    range.setEndBefore(marker);
    appendSegment(range);
    const parent = marker.parentNode;
    startContainer = parent;
    startOffset = [...parent.childNodes].indexOf(marker) + 1;
    breakBefore = true;
  });

  const tail = node.ownerDocument.createRange();
  tail.setStart(startContainer, startOffset);
  tail.setEnd(node, node.childNodes.length);
  const hasTrailingContent = appendSegment(tail);
  return { nodes: segments, count: markers.length, trailingBreak: !hasTrailingContent };
}

function isStartHeading(node, startHeadingAliases) {
  return /^H[1-6]$/.test(node.tagName)
    && startHeadingAliases.has(node.textContent.trim().toLocaleLowerCase());
}

function directiveSections(blocks, styleMap, startHeadingAliases) {
  const sections = [];
  let current = null;
  blocks.forEach((node) => {
    const type = pageDirectiveType(node, styleMap);
    if (type) {
      current = { type, nodes: [] };
      sections.push(current);
      return;
    }
    const letterHasSignoff = current?.type === "letter"
      && current.nodes.some((item) => /^(?:sincerely|with care|best),?$/i.test(item.textContent.trim()));
    const startsRegularContent = node.tagName === "H1" && letterHasSignoff;
    if (current && (startsRegularContent || isPageBreak(node, styleMap) || isStartHeading(node, startHeadingAliases))) {
      current = null;
    }
    if (current) current.nodes.push(node);
  });
  return sections;
}

function meaningfulText(nodes) {
  return nodes.map((node) => node.textContent.trim()).filter(Boolean);
}

function textWithLineBreaks(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll("br").forEach((breakNode) => breakNode.replaceWith("\n"));
  return clone.textContent.trim();
}

function parseCover(nodes) {
  const texts = meaningfulText(nodes);
  const title = nodes.find((node) => node.classList.contains("title") && node.textContent.trim())?.textContent.trim()
    || texts[0]
    || "";
  const subtitle = nodes.find((node) => node.classList.contains("subtitle") && node.textContent.trim())?.textContent.trim()
    || "";
  const allText = texts.join(" ");
  const website = allText.match(/(?:https?:\/\/|www\.)[^\s,;]+|\b[a-z0-9-]+\.(?:org|com|net|edu)\b[^\s,;]*/i)?.[0]
    ?.replace(/[.)]+$/, "")
    || "";
  const year = texts.find((text) => /^\d{4}$/.test(text)) || "";
  return { title, subtitle, website, year };
}

function splitPrimaryAndDetail(value) {
  const match = value.trim().match(/^(.+?[.!?])(?:\s+(.+))?$/);
  return match ? [match[1], match[2] || ""] : [value.trim(), ""];
}

function parseSummaryGraphic(nodes) {
  const texts = meaningfulText(nodes);
  const categoryPattern = /\bright(?:s)?\b|confidential|emotion|\bbill(?:ed|ing)?\b|\bresilience\b/i;
  const footnoteIndex = texts.findIndex((text) => /exception to confidentiality/i.test(text));
  const title = texts.find((text, index) => index !== footnoteIndex && !categoryPattern.test(text)) || texts[0] || "";

  const group = (pattern) => {
    const index = texts.findIndex((text) => pattern.test(text));
    if (index < 0) return ["", ""];
    const [primary, inlineDetail] = splitPrimaryAndDetail(texts[index]);
    const next = texts[index + 1] || "";
    const followingDetail = !inlineDetail
      && next
      && index + 1 !== footnoteIndex
      && !categoryPattern.test(next)
      ? next
      : "";
    return [primary, inlineDetail || followingDetail];
  };

  const [rights] = group(/\bright(?:s)?\b/i);
  const [confidentiality] = group(/confidential/i);
  const [emotions, emotionsDetail] = group(/emotion/i);
  const [billing, billingDetail] = group(/\bbill(?:ed|ing)?\b/i);
  const [organization, organizationDetail] = group(/\bresilience\b/i);
  return {
    title,
    rights,
    emotions,
    emotionsDetail,
    confidentiality,
    billing,
    billingDetail,
    organization: [organization, organizationDetail].filter(Boolean).join(" "),
    footnote: footnoteIndex >= 0 ? texts[footnoteIndex] : "",
  };
}

function isItalicBlock(node, styleMap) {
  const blockLength = node.textContent.trim().length;
  if (!blockLength) return false;
  return [node, ...node.querySelectorAll("span,em,i")].some((candidate) => {
    const candidateLength = candidate.textContent.trim().length;
    const isItalic = ["EM", "I"].includes(candidate.tagName)
      || /font-style\s*:\s*italic/.test(styleDeclarations(candidate, styleMap));
    return isItalic && candidateLength >= blockLength * 0.8;
  });
}

function parseLetter(nodes, styleMap) {
  const entries = nodes.flatMap((node) => {
    const italic = isItalicBlock(node, styleMap);
    return textWithLineBreaks(node)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({ text, italic }));
  });
  const blocks = entries.map(({ text }) => text);
  const salutationIndex = blocks.findIndex((text) => /^hello\b/i.test(text));
  const signoffIndex = blocks.findIndex((text) => /^(?:sincerely|with care|best),?$/i.test(text));
  const contactLineIndex = entries.findIndex(({ text }) => /^\[.*\]$/.test(text) && Boolean(contactItemsFromText(text)));
  const contacts = contactLineIndex >= 0 ? contactItemsFromText(entries[contactLineIndex].text) : [];
  const bodyStart = salutationIndex >= 0 ? salutationIndex + 1 : 0;
  const bodyEnd = signoffIndex >= 0 ? signoffIndex : blocks.length;
  const candidates = entries
    .map((entry, index) => ({ ...entry, index }))
    .filter(({ index }) => ![
      salutationIndex,
      signoffIndex,
      signoffIndex >= 0 ? signoffIndex + 1 : -1,
      contactLineIndex,
    ].includes(index));
  const bodyEntries = candidates.filter(({ index }) => index >= bodyStart && index < bodyEnd);
  const isSupportingNote = ({ italic }) => italic;
  return {
    salutation: salutationIndex >= 0 ? blocks[salutationIndex] : "Hello,",
    paragraphs: bodyEntries.filter((entry) => !isSupportingNote(entry)).map(({ text }) => text),
    signoff: signoffIndex >= 0 ? blocks[signoffIndex] : "Sincerely,",
    organization: signoffIndex >= 0 ? blocks[signoffIndex + 1] || "" : "",
    notes: candidates.filter(isSupportingNote).map(({ text }) => text),
    contacts,
    hasDivider: nodes.some((node) => node.tagName === "HR" && !isPageBreak(node, styleMap)),
    isImported: true,
  };
}

function parseSpecialPages(sections, styleMap) {
  return sections.map(({ type, nodes }) => {
    if (type === "cover") return { type, data: parseCover(nodes) };
    if (type === "summary-graphic") return { type, data: parseSummaryGraphic(nodes) };
    return { type, data: parseLetter(nodes, styleMap) };
  });
}

export function transformGoogleDocExport(html, options = {}) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const styleMap = googleClassStyleMap(doc);
  const startAtHeading = (options.startAtHeading || "").trim().toLocaleLowerCase();
  const startHeadingAliases = /^(?:in this packet|what[’']s inside|contents)$/.test(startAtHeading)
    ? new Set(["in this packet", "what’s inside", "what's inside", "contents"])
    : new Set([startAtHeading]);
  const ignoreRedText = options.ignoreRedText !== false;
  const blocks = topLevelGoogleBlocks(doc);
  const sections = directiveSections(blocks, styleMap, startHeadingAliases);
  const specialPages = parseSpecialPages(sections, styleMap);
  const specialPageNodes = new Set(sections.flatMap(({ nodes }) => nodes));
  const imported = [];
  let reachedStart = !startAtHeading;
  let ignoredRedNodes = 0;
  let importedImages = 0;
  let pendingBlankLines = 0;
  let pendingPageBreak = false;
  let pageBreakDirectives = 0;

  const pushImported = (...nodes) => {
    const firstNode = nodes[0];
    if (firstNode?.tagName === "H1") {
      pendingBlankLines = 0;
      pendingPageBreak = false;
    } else if (firstNode) {
      if (pendingBlankLines) firstNode.dataset.blankLinesBefore = String(pendingBlankLines);
      if (pendingPageBreak) firstNode.dataset.pageBreakBefore = "true";
      pendingBlankLines = 0;
      pendingPageBreak = false;
    }
    imported.push(...nodes);
  };

  blocks.forEach((sourceNode) => {
    if (pageDirectiveType(sourceNode, styleMap) || specialPageNodes.has(sourceNode)) {
      pendingBlankLines = 0;
      return;
    }
    if (!reachedStart) {
      const candidate = sourceNode.textContent.trim().toLocaleLowerCase();
      if (isStartHeading(sourceNode, startHeadingAliases)) reachedStart = true;
      else return;
    }
    if (isStandalonePageBreakDirective(sourceNode, styleMap)) {
      pendingBlankLines = 0;
      pendingPageBreak = true;
      pageBreakDirectives += 1;
      return;
    }
    if (isPageBreak(sourceNode, styleMap) || sourceNode.tagName === "HR") {
      pendingBlankLines = 0;
      pendingPageBreak = false;
      return;
    }

    const node = sourceNode.cloneNode(true);
    const inlineSplit = splitAtManualPageBreaks(node, styleMap);
    if (inlineSplit.count) {
      pageBreakDirectives += inlineSplit.count;
      inlineSplit.nodes.forEach((segment, segmentIndex) => {
        if (segmentIndex === 0 && segment.dataset.pageBreakBefore === "true") pendingBlankLines = 0;
        const redBefore = [segment, ...segment.querySelectorAll("span,a")]
          .filter((candidate) => isRedStyle(styleDeclarations(candidate, styleMap))).length;
        preserveGoogleInlineStyles(segment, styleMap, ignoreRedText);
        ignoredRedNodes += ignoreRedText ? redBefore : 0;
        if (!segment.textContent.trim()) return;
        const contacts = contactItemsFromText(segment.textContent);
        const importedNode = contacts ? makeContactSourceBlock(contacts) : segment;
        if (segment.dataset.pageBreakBefore === "true") importedNode.dataset.pageBreakBefore = "true";
        pushImported(importedNode);
      });
      if (inlineSplit.trailingBreak) pendingPageBreak = true;
      return;
    }
    const redBefore = [node, ...node.querySelectorAll("span,a")]
      .filter((candidate) => isRedStyle(styleDeclarations(candidate, styleMap))).length;
    if (ignoreRedText && isRedStyle(styleDeclarations(node, styleMap))) {
      ignoredRedNodes += 1;
      return;
    }
    preserveGoogleInlineStyles(node, styleMap, ignoreRedText);
    ignoredRedNodes += ignoreRedText ? redBefore : 0;
    const imageBlocks = makeImageSourceBlocks(node);
    if (imageBlocks.length) {
      pushImported(...imageBlocks);
      importedImages += imageBlocks.length;
      return;
    }
    if (!node.textContent.trim() && !["TABLE", "UL", "OL"].includes(node.tagName)) {
      if (node.tagName === "P") pendingBlankLines += 1;
      if (node.tagName === "H1") pendingBlankLines = 0;
      return;
    }

    if (/^H[4-6]$/.test(node.tagName)) {
      const nestedHeading = document.createElement("h3");
      nestedHeading.innerHTML = node.innerHTML;
      pushImported(nestedHeading);
      return;
    }

    if (node.tagName === "TABLE") {
      pushImported(makeCardGridSourceBlock(node));
      return;
    }

    const contacts = node.tagName === "P" ? contactItemsFromText(node.textContent) : null;
    pushImported(contacts ? makeContactSourceBlock(contacts) : node);
  });

  if (!reachedStart) throw new Error(`Could not find the heading “${options.startAtHeading}” in this document.`);

  if (!imported.some((node) => node.tagName === "H1")) {
    const heading = document.createElement("h1");
    heading.textContent = doc.title.trim() || "Imported document";
    imported.unshift(heading);
  }

  imported.forEach((node, index) => {
    if (node.tagName !== "H1" || imported[index + 1]?.tagName !== "P") return;
    const nextStructuralNode = imported.slice(index + 2).find((candidate) => candidate.textContent.trim());
    if (nextStructuralNode && /^H[2-6]$/.test(nextStructuralNode.tagName)) {
      imported[index + 1].dataset.role = "chapter-dek";
    }
  });

  return {
    nodes: imported,
    title: doc.title.trim() || "Imported document",
    importedImages,
    ignoredRedNodes,
    pageBreakDirectives,
    specialPages,
  };
}

function splitSectionsAtH1(nodes) {
  const sections = [];
  let section = null;
  nodes.forEach((node) => {
    if (node.tagName === "H1") {
      section = { heading: node, nodes: [] };
      sections.push(section);
    } else if (section) {
      section.nodes.push(node);
    }
  });
  return sections;
}

export function filterImportedContent(nodes) {
  return splitSectionsAtH1(nodes)
    .filter((section) => !/^hello\b/i.test(section.heading.textContent.trim()))
    .flatMap((section) => [section.heading, ...section.nodes]);
}
