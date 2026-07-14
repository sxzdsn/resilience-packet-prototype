const sampleSource = window.RESILIENCE_PACKET_SOURCE;

const els = {
  shell: document.querySelector(".app-shell"),
  settings: document.querySelector("#publisherSettings"),
  settingsToggle: document.querySelector("#toggleSettings"),
  figmaToggle: document.querySelector("#toggleFigma"),
  title: document.querySelector("#packetTitle"),
  subtitle: document.querySelector("#packetSubtitle"),
  website: document.querySelector("#packetWebsite"),
  year: document.querySelector("#packetYear"),
  summaryTitle: document.querySelector("#summaryTitle"),
  summaryRights: document.querySelector("#summaryRights"),
  summaryEmotions: document.querySelector("#summaryEmotions"),
  summaryEmotionsDetail: document.querySelector("#summaryEmotionsDetail"),
  summaryConfidentiality: document.querySelector("#summaryConfidentiality"),
  summaryBilling: document.querySelector("#summaryBilling"),
  summaryBillingDetail: document.querySelector("#summaryBillingDetail"),
  summaryOrganization: document.querySelector("#summaryOrganization"),
  summaryFootnote: document.querySelector("#summaryFootnote"),
  docsUrl: document.querySelector("#docsUrl"),
  docsLink: document.querySelector("#openDocsLink"),
  source: document.querySelector("#docsSource"),
  importButton: document.querySelector("#importButton"),
  importSummary: document.querySelector("#importSummary"),
  pages: document.querySelector("#pages"),
  warnings: document.querySelector("#renderWarnings"),
  printBlocker: document.querySelector("#printBlocker"),
  measurement: document.querySelector("#measurementStage"),
  zoom: document.querySelector("#zoomRange"),
  zoomValue: document.querySelector("#zoomValue"),
  printButton: document.querySelector("#printButton"),
};

let documentModel = { chapters: [] };
let renderTimer;

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cleanHtml(node) {
  const clone = node.cloneNode(true);
  const allowedTags = new Set(["A", "B", "BR", "EM", "I", "LI", "OL", "P", "SPAN", "STRONG", "U", "UL"]);
  clone.querySelectorAll("script, style, iframe, object, embed, link, meta").forEach((child) => child.remove());
  [...clone.querySelectorAll("*")].forEach((child) => {
    if (!allowedTags.has(child.tagName)) {
      child.replaceWith(...child.childNodes);
      return;
    }

    [...child.attributes].forEach((attribute) => {
      if (child.tagName !== "A" || attribute.name.toLowerCase() !== "href") {
        child.removeAttribute(attribute.name);
      }
    });

    if (child.tagName === "A") {
      const href = child.getAttribute("href") || "";
      if (!/^(https?:|mailto:|tel:)/i.test(href)) child.removeAttribute("href");
    }
  });
  return clone.innerHTML.trim();
}

function parseSource() {
  const chapters = [];
  let chapter = null;
  let subsection = null;

  const ensureChapter = () => {
    if (!chapter) {
      chapter = { id: "untitled-chapter", title: "Untitled chapter", subsections: [] };
      chapters.push(chapter);
    }
    return chapter;
  };

  const ensureSubsection = () => {
    ensureChapter();
    if (!subsection) {
      subsection = {
        id: `${chapter.id}-introduction`,
        title: "Introduction",
        policy: "auto",
        blocks: [],
      };
      chapter.subsections.push(subsection);
    }
    return subsection;
  };

  [...els.source.children].forEach((node) => {
    const tag = node.tagName.toLowerCase();
    const text = node.textContent.trim();
    if (!text && !node.dataset.blockType) return;

    if (tag === "h1") {
      const id = slugify(text) || `chapter-${chapters.length + 1}`;
      chapter = { id, title: text, footerLabel: text, dek: "", subsections: [] };
      chapters.push(chapter);
      subsection = null;
      return;
    }

    if (tag === "h2" || tag === "h3") {
      ensureChapter();
      const id = `${chapter.id}-${slugify(text) || chapter.subsections.length + 1}`;
      subsection = {
        id,
        title: text,
        titleHtml: cleanHtml(node),
        policy: node.dataset.policy || "auto",
        pageBreakBefore: node.dataset.pageBreakBefore === "true",
        startsContinued: node.dataset.startContinued === "true",
        continuationStyle: ["header", "none"].includes(node.dataset.repeat) ? node.dataset.repeat : "badge",
        blocks: [],
      };
      chapter.subsections.push(subsection);
      return;
    }

    if (tag === "p" && node.dataset.role === "chapter-dek" && chapter && !subsection) {
      chapter.dek = cleanHtml(node);
      return;
    }

    const target = ensureSubsection();
    if (tag === "ul" || tag === "ol") {
      target.blocks.push({
        type: "list",
        ordered: tag === "ol",
        items: [...node.querySelectorAll(":scope > li")].map((li) => cleanHtml(li)),
      });
    } else if (tag === "table") {
      target.blocks.push({
        type: "table",
        rows: [...node.rows].map((row) =>
          [...row.cells].map((cell) => ({
            html: cleanHtml(cell),
            header: cell.tagName.toLowerCase() === "th",
            colspan: cell.colSpan || 1,
          })),
        ),
      });
    } else if (tag === "figure" && node.dataset.blockType === "emotion-exercise") {
      target.blocks.push({
        type: "emotion-exercise",
        prompt: node.querySelector("figcaption")?.textContent.trim() || "",
        items: [...node.querySelectorAll("li")].map((item) => item.textContent.trim()),
        reassurance: node.querySelector("[data-role='reassurance']")?.textContent.trim() || "It’s all valid.",
      });
    } else if (tag === "figure" && node.dataset.blockType === "visual-grid") {
      target.blocks.push({
        type: "visual-grid",
        label: node.querySelector("figcaption")?.textContent.trim() || "",
        count: Number(node.dataset.count) || 6,
      });
    } else if (node.dataset.blockType === "contact-row") {
      target.blocks.push({
        type: "contact-row",
        items: [...node.children].map((item) => item.textContent.trim()).filter(Boolean),
      });
    } else if (node.dataset.blockType === "resource-link") {
      target.blocks.push({ type: "resource-link", text });
    } else if (node.dataset.blockType === "steps") {
      target.blocks.push({
        type: "steps",
        items: [...node.querySelectorAll("li")].map((item) => cleanHtml(item)),
      });
    } else if (node.dataset.blockType === "callout-group") {
      target.blocks.push({
        type: "callout-group",
        parts: [...node.children].map((part) => {
          if (part.dataset.blockType === "card-grid") {
            return {
              type: "card-grid",
              layout: part.dataset.layout || "columns",
              cards: [...part.querySelectorAll(":scope > article")].map((item) => cleanHtml(item)),
            };
          }
          if (part.dataset.blockType === "contact-row") {
            return {
              type: "contact-row",
              items: [...part.children].map((item) => item.textContent.trim()).filter(Boolean),
            };
          }
          if (part.dataset.blockType === "steps") {
            return {
              type: "steps",
              items: [...part.querySelectorAll("li")].map((item) => cleanHtml(item)),
            };
          }
          return { type: "paragraph", html: cleanHtml(part) };
        }),
      });
    } else if (node.dataset.blockType === "card-grid") {
      target.blocks.push({
        type: "card-grid",
        layout: node.dataset.layout || "columns",
        cards: [...node.querySelectorAll(":scope > article")].map((item) => cleanHtml(item)),
      });
    } else if (node.dataset.blockType === "section-divider") {
      target.blocks.push({ type: "section-divider" });
    } else if (tag === "blockquote") {
      target.blocks.push({ type: "callout", html: cleanHtml(node) });
    } else {
      target.blocks.push({ type: "paragraph", html: cleanHtml(node) || text });
    }
  });

  chapters.forEach((item) => {
    item.subsections = item.subsections.filter((section) => section.blocks.length > 0);
  });

  const arranged = chapters.filter((item) => item.subsections.length > 0);
  arranged.forEach((item) => {
    const last = item.subsections.at(-1);
    if (last) last.isChapterLast = true;
  });
  return { chapters: arranged };
}

function makeBlock(block) {
  if (block.type === "emotion-exercise") {
    const figure = document.createElement("figure");
    figure.className = "content-block emotion-exercise";
    const prompt = document.createElement("figcaption");
    prompt.className = "emotion-prompt";
    prompt.textContent = block.prompt;
    const list = document.createElement("div");
    list.className = "emotion-pills";
    block.items.forEach((item) => {
      const pill = document.createElement("span");
      pill.className = "emotion-pill";
      pill.textContent = item;
      list.append(pill);
    });
    const reassurance = document.createElement("p");
    reassurance.className = "emotion-reassurance";
    reassurance.textContent = block.reassurance;
    if (block.prompt) figure.append(prompt);
    figure.append(list, reassurance);
    return figure;
  }

  if (block.type === "visual-grid") {
    const figure = document.createElement("figure");
    figure.className = "content-block visual-grid-block";
    if (block.label) {
      const caption = document.createElement("figcaption");
      caption.className = "visual-grid-label";
      caption.textContent = block.label;
      figure.append(caption);
    }
    const grid = document.createElement("div");
    grid.className = "visual-grid";
    for (let index = 0; index < block.count; index += 1) {
      const cell = document.createElement("div");
      cell.className = "visual-grid-cell";
      grid.append(cell);
    }
    figure.append(grid);
    return figure;
  }

  if (block.type === "contact-row") {
    const row = document.createElement("div");
    row.className = "content-block contact-row";
    const icons = ["website.svg", "phone.svg", "email.svg"];
    block.items.forEach((item, index) => {
      const entry = document.createElement("span");
      entry.className = "contact-entry";
      entry.innerHTML = `<img class="contact-icon" src="assets/icons/${icons[index] || icons[0]}" alt="">${escapeHtml(item)}`;
      row.append(entry);
    });
    return row;
  }

  if (block.type === "resource-link") {
    const row = document.createElement("div");
    row.className = "content-block resource-link";
    row.innerHTML = `<img src="assets/icons/website.svg" alt="">${escapeHtml(block.text)}`;
    return row;
  }

  if (block.type === "steps") {
    const steps = document.createElement("div");
    steps.className = "content-block process-steps";
    block.items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "process-step";
      row.innerHTML = `<strong>STEP ${index + 1}</strong><span>${item}</span>`;
      steps.append(row);
    });
    return steps;
  }

  if (block.type === "card-grid") {
    const grid = document.createElement("div");
    grid.className = `content-block card-grid card-grid-${block.layout || "columns"}`;
    block.cards.forEach((card) => {
      const article = document.createElement("article");
      article.innerHTML = card;
      grid.append(article);
    });
    return grid;
  }

  if (block.type === "section-divider") {
    const divider = document.createElement("div");
    divider.className = "content-block section-divider";
    return divider;
  }

  if (block.type === "callout-group") {
    const group = document.createElement("div");
    group.className = "content-block callout callout-group";
    block.parts.forEach((part) => {
      if (part.type === "card-grid" || part.type === "contact-row" || part.type === "steps") {
        group.append(makeBlock(part));
      } else {
        const copy = document.createElement("div");
        copy.className = "callout-copy";
        copy.innerHTML = part.html;
        const strong = copy.querySelector("strong");
        if (strong) {
          strong.classList.add("callout-title");
          if (strong.nextSibling?.nodeName === "BR") strong.nextSibling.remove();
        }
        group.append(copy);
      }
    });
    return group;
  }

  if (block.type === "table") {
    const table = document.createElement("table");
    table.className = "content-block content-table";
    const prompt = plainText(block.rows[0]?.[0]?.html || "");
    if (prompt.startsWith("Make a report to police")) table.classList.add("table-police-report");
    const body = document.createElement("tbody");
    block.rows.forEach((row) => {
      const tr = document.createElement("tr");
      if (row.length > 1) {
        const td = document.createElement("td");
        td.colSpan = row.reduce((sum, cell) => sum + (cell.colspan || 1), 0);
        td.className = "citation-cell";
        const columns = document.createElement("div");
        columns.className = "citation-columns";
        row.forEach((cell) => {
          const column = document.createElement("div");
          column.innerHTML = cell.html;
          columns.append(column);
        });
        td.append(columns);
        tr.append(td);
      } else row.forEach((cell) => {
        const td = document.createElement(cell.header ? "th" : "td");
        td.innerHTML = cell.html.replace(/<\/strong><br>(?!<br>)/i, '</strong><span class="table-gap"></span>');
        td.colSpan = cell.colspan || 1;
        tr.append(td);
      });
      body.append(tr);
    });
    table.append(body);
    return table;
  }

  if (block.type === "list") {
    const list = document.createElement(block.ordered ? "ol" : "ul");
    list.className = "content-block content-list";
    block.items.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = item;
      list.append(li);
    });
    return list;
  }

  const element = document.createElement(block.type === "callout" ? "div" : "p");
  element.className = `content-block${block.type === "callout" ? " callout" : ""}`;
  element.innerHTML = block.html;

  if (block.type === "callout") {
    const strong = element.querySelector("strong");
    if (strong) {
      strong.classList.add("callout-title");
      if (strong.nextSibling?.nodeName === "BR") strong.nextSibling.remove();
    }
  }
  return element;
}

function makeSubsection(subsection, blocks, continued = false) {
  const wrapper = document.createElement("section");
  wrapper.className = "subsection";
  wrapper.classList.toggle("is-chapter-last", subsection.isChapterLast === true);
  wrapper.dataset.subsection = subsection.id;

  const headingRow = document.createElement("div");
  headingRow.className = "subsection-heading-row";
  const heading = document.createElement("h3");
  heading.className = "subsection-heading";
  heading.innerHTML = subsection.titleHtml || escapeHtml(subsection.title);
  headingRow.append(heading);

  if (continued && subsection.continuationStyle !== "header") {
    const badge = document.createElement("span");
    badge.className = "continued-badge";
    badge.innerHTML = '<img src="assets/icons/continued.svg" alt="Continued">';
    headingRow.append(badge);
  }

  if (!(continued && subsection.continuationStyle === "none")) wrapper.append(headingRow);
  wrapper.append(...blocks.map(makeBlock));
  return wrapper;
}

function measure(node) {
  const container = document.createElement("div");
  container.className = "measurement-content";
  container.append(node);
  els.measurement.replaceChildren(container);
  return container.getBoundingClientRect().height;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function plainText(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.textContent.trim();
}

function splitParagraphToFit(subsection, block, maxHeight) {
  const text = plainText(block.html);
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()).filter(Boolean) || [text];
  if (sentences.length < 2) return null;

  const chunks = [];
  let current = "";
  sentences.forEach((sentence) => {
    const candidate = current ? `${current} ${sentence}` : sentence;
    const candidateBlock = { type: "paragraph", html: escapeHtml(candidate) };
    const candidateHeight = measure(makeSubsection(subsection, [candidateBlock], false));
    if (candidateHeight <= maxHeight || !current) {
      current = candidate;
    } else {
      chunks.push({ type: "paragraph", html: escapeHtml(current) });
      current = sentence;
    }
  });
  if (current) chunks.push({ type: "paragraph", html: escapeHtml(current) });
  return chunks.length > 1 ? chunks : null;
}

function normalizeOversizedBlocks(subsection, maxHeight, warnings, fatalWarnings) {
  const normalized = [];
  subsection.blocks.forEach((block) => {
    const height = measure(makeSubsection(subsection, [block], false));
    if (height <= maxHeight) {
      normalized.push(block);
      return;
    }

    if (block.type === "list" && block.items.length > 1) {
      block.items.forEach((item) => normalized.push({ ...block, items: [item] }));
      warnings.push(`An oversized list in “${subsection.title}” was split between list items.`);
      return;
    }

    if (block.type === "table" && block.rows.length > 2) {
      const header = block.rows[0].some((cell) => cell.header) ? block.rows[0] : null;
      block.rows.slice(header ? 1 : 0).forEach((row) => {
        normalized.push({ type: "table", rows: header ? [header, row] : [row] });
      });
      warnings.push(`An oversized table in “${subsection.title}” was split between rows.`);
      return;
    }

    if (block.type === "paragraph") {
      const chunks = splitParagraphToFit(subsection, block, maxHeight);
      if (chunks) {
        normalized.push(...chunks);
        warnings.push(`An oversized paragraph in “${subsection.title}” was split at sentence boundaries.`);
        return;
      }
    }

    normalized.push(block);
    const message = `A single ${block.type} in “${subsection.title}” is taller than a page and needs an editorial edit before export.`;
    warnings.push(message);
    fatalWarnings.push(message);
  });
  return normalized;
}

function contentHeightPx() {
  const probe = document.createElement("div");
  probe.style.height = "var(--content-height)";
  els.measurement.replaceChildren(probe);
  return probe.getBoundingClientRect().height;
}

function makePaper(chapter, showChapterTitle, pageNumber) {
  const paper = document.createElement("article");
  paper.className = "paper content-page";
  paper.setAttribute("aria-label", `${chapter.title}, page ${pageNumber}`);

  if (showChapterTitle && chapter.showTitle !== false) {
    const title = document.createElement("h2");
    title.className = "chapter-title";
    title.textContent = chapter.title;
    paper.append(title);

    if (chapter.dek) {
      const dek = document.createElement("p");
      dek.className = "chapter-dek";
      dek.innerHTML = chapter.dek;
      paper.append(dek);
    }
  }

  const content = document.createElement("div");
  content.className = "page-content";
  paper.append(content, makeFooter(chapter.footerLabel || chapter.title, pageNumber));
  return { paper, content, used: 0 };
}

function makeFooter(label, pageNumber) {
  const footer = document.createElement("footer");
  footer.className = "packet-footer";
  const left = document.createElement("span");
  left.className = "footer-label";
  left.textContent = label;
  const right = document.createElement("span");
  right.className = "footer-number";
  right.textContent = pageNumber;
  footer.append(left, right);
  return footer;
}

function makeCover() {
  const paper = document.createElement("article");
  paper.className = "paper cover-page";
  paper.setAttribute("aria-label", "Packet cover");
  paper.innerHTML = `
    <p class="cover-brand">RESILIENCE</p>
    <h2 class="cover-title"></h2>
    <p class="cover-subtitle"></p>
    <p class="cover-meta cover-site"></p>
    <p class="cover-meta cover-year"></p>
  `;
  paper.querySelector(".cover-title").textContent = els.title.value;
  paper.querySelector(".cover-subtitle").textContent = els.subtitle.value;
  paper.querySelector(".cover-site").textContent = els.website.value;
  paper.querySelector(".cover-year").textContent = els.year.value;
  return paper;
}

function makeOrientationPage(data) {
  const summary = {
    title: els.summaryTitle.value,
    rights: els.summaryRights.value,
    emotions: els.summaryEmotions.value,
    emotionsDetail: els.summaryEmotionsDetail.value,
    confidentiality: els.summaryConfidentiality.value,
    billing: els.summaryBilling.value,
    billingDetail: els.summaryBillingDetail.value,
    organization: els.summaryOrganization.value,
    footnote: els.summaryFootnote.value,
  };
  const splitSupportingCopy = (value) => {
    const match = value.trim().match(/^(.+?[.!?])\s+(.+)$/);
    return match ? [match[1], match[2]] : [value.trim(), ""];
  };
  const [emotionsDetail, emotionsClosing] = splitSupportingCopy(summary.emotionsDetail);
  const [organizationMessage, organizationDetail] = splitSupportingCopy(summary.organization);
  const paper = document.createElement("article");
  paper.className = "paper orientation-page";
  paper.setAttribute("aria-label", "Orientation and reassurance");
  paper.innerHTML = `
    <img class="orientation-banner" src="assets/icons/orientation-banner.svg" alt="">
    <h2 class="orientation-title">${escapeHtml(summary.title)}</h2>
    <article class="orientation-card orientation-rights"><p>${escapeHtml(summary.rights)}</p></article>
    <article class="orientation-card orientation-emotions">
      <p>${escapeHtml(summary.emotions)}</p>
      <div class="orientation-emotion-icons" aria-hidden="true">
        <img src="assets/icons/orientation-emotion-1.svg" alt="">
        <img src="assets/icons/orientation-emotion-3.svg" alt="">
        <img src="assets/icons/orientation-emotion-star.svg" alt="">
        <img src="assets/icons/orientation-emotion-2.svg" alt="">
      </div>
      <small>${escapeHtml(emotionsDetail)}</small>
      <small>${escapeHtml(emotionsClosing)}</small>
    </article>
    <article class="orientation-card orientation-confidentiality">
      <span class="orientation-conf-icon" aria-hidden="true">
        <img src="assets/icons/orientation-conf-composite-1.svg" alt="">
        <img src="assets/icons/orientation-conf-composite-2.svg" alt="">
        <img src="assets/icons/orientation-conf-composite-3.svg" alt="">
      </span>
      <img class="orientation-card-asterisk" src="assets/icons/orientation-card-asterisk.svg" alt="">
      <p>${escapeHtml(summary.confidentiality).replace(/\byou\b/i, "<u>$&</u>")}</p>
    </article>
    <article class="orientation-card orientation-billing">
      <img class="orientation-card-bg" src="assets/icons/orientation-billing-bg.svg" alt="">
      <span class="orientation-billing-mark"><img src="assets/icons/orientation-billing-icon.svg" alt=""></span>
      <p>${escapeHtml(summary.billing)}</p>
      <small>${escapeHtml(summary.billingDetail)}</small>
    </article>
    <article class="orientation-card orientation-organization">
      <img class="orientation-card-bg" src="assets/icons/orientation-org-bg.svg" alt="">
      <img class="orientation-org-photo" src="assets/icons/orientation-org-photo.png" alt="">
      <b>RESILIENCE</b>
      <p>${escapeHtml(organizationMessage)}</p>
      <small>${escapeHtml(organizationDetail)}</small>
      <img class="orientation-underline" src="assets/icons/orientation-underline.svg" alt="">
    </article>
    <img class="orientation-footnote-asterisk" src="assets/icons/orientation-footnote-asterisk.svg" alt="">
    <p class="orientation-footnote">${escapeHtml(summary.footnote)}</p>
  `;
  return paper;
}

function makeLetterPage(data) {
  const paper = document.createElement("article");
  paper.className = "paper letter-page";
  paper.setAttribute("aria-label", "Introductory letter");
  const salutation = document.createElement("h2");
  salutation.className = "letter-salutation";
  salutation.textContent = data.salutation;
  const main = document.createElement("div");
  main.className = "letter-main";
  data.paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    main.append(p);
  });
  const signoff = document.createElement("p");
  signoff.className = "letter-signoff";
  signoff.innerHTML = `${data.signoff}<br><strong>${data.organization}</strong>`;
  const notes = document.createElement("div");
  notes.className = "letter-notes";
  data.notes.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    notes.append(p);
  });
  notes.append(makeBlock({ type: "contact-row", items: data.contacts }));
  paper.append(salutation, main, signoff, notes);
  return paper;
}

function makeContentsPage(data, pageNumber) {
  const paper = document.createElement("article");
  paper.className = "paper contents-page";
  paper.setAttribute("aria-label", "In this packet");
  const title = document.createElement("h2");
  title.className = "chapter-title";
  title.textContent = data.title;
  const list = document.createElement("div");
  list.className = "contents-list";
  data.items.forEach((item) => {
    const entry = document.createElement("div");
    entry.className = "contents-entry";
    entry.innerHTML = `<strong>${item.title}</strong><span>${item.description}</span>`;
    list.append(entry);
  });
  paper.append(title, list, makeFooter("Contents", pageNumber));
  return paper;
}

function paginate() {
  const warnings = [];
  const fatalWarnings = [];
  const preface = window.RESILIENCE_PREFACE || {};
  const output = [makeCover()];
  if (preface.orientation) output.push(makeOrientationPage(preface.orientation));
  if (preface.letter) output.push(makeLetterPage(preface.letter));
  if (preface.contents) output.push(makeContentsPage(preface.contents, 3));
  const maxHeight = contentHeightPx();
  let pageNumber = preface.contents ? 4 : 1;

  documentModel.chapters.forEach((chapter) => {
    let current = makePaper(chapter, true, pageNumber++);
    output.push(current.paper);

    const nextPage = () => {
      current = makePaper(chapter, false, pageNumber++);
      output.push(current.paper);
    };

    chapter.subsections.forEach((subsection) => {
      if (subsection.pageBreakBefore && current.used > 0) nextPage();
      const startsContinued = subsection.startsContinued === true;
      const allNode = makeSubsection(subsection, subsection.blocks, startsContinued);
      const allHeight = measure(allNode.cloneNode(true));
      const available = maxHeight - current.used;

      if (allHeight <= available) {
        current.content.append(allNode);
        current.used += allHeight;
        return;
      }

      if (allHeight <= maxHeight && subsection.policy !== "split") {
        if (current.used > 0) nextPage();
        current.content.append(allNode);
        current.used = allHeight;
        return;
      }

      if (subsection.policy === "keep" && allHeight > maxHeight) {
        warnings.push(`“${subsection.title}” is taller than a full page, so the prototype split it despite Keep together.`);
      }

      let remaining = normalizeOversizedBlocks(subsection, maxHeight, warnings, fatalWarnings);
      let continued = startsContinued;

      while (remaining.length) {
        const firstCandidate = makeSubsection(subsection, [remaining[0]], continued);
        const firstHeight = measure(firstCandidate.cloneNode(true));
        if (firstHeight > maxHeight - current.used && current.used > 0) nextPage();

        const selected = [];
        let selectedHeight = 0;
        for (const block of remaining) {
          const candidate = makeSubsection(subsection, [...selected, block], continued);
          const candidateHeight = measure(candidate.cloneNode(true));
          if (candidateHeight <= maxHeight - current.used || selected.length === 0) {
            selected.push(block);
            selectedHeight = candidateHeight;
          } else {
            break;
          }
        }

        const fragment = makeSubsection(subsection, selected, continued);
        fragment.classList.toggle("continues-next-page", remaining.length > selected.length);
        current.content.append(fragment);
        current.used += selectedHeight;
        remaining = remaining.slice(selected.length);

        if (remaining.length) {
          nextPage();
          continued = true;
        }
      }
    });
  });

  const legacyFrameClass = {
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

  output.forEach((paper, index) => {
    const pageNumber = index + 1;
    const pageLabel = String(pageNumber).padStart(2, "0");
    paper.classList.add(`page-${pageLabel}`);
    if (legacyFrameClass[pageNumber]) paper.classList.add(`letter-${legacyFrameClass[pageNumber]}`);
    paper.dataset.figmaFrame = pageLabel;
  });

  const comparisons = output.map((paper) => {
    const frameName = paper.dataset.figmaFrame;
    const comparison = document.createElement("section");
    comparison.className = "page-comparison";
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
    prototypeLabel.textContent = frameName === "01"
      ? "Cover"
      : frameName === "02"
        ? "Summary Graphic"
        : `Prototype · ${frameName}`;
    prototypeColumn.append(prototypeLabel, paper);

    comparison.append(referenceColumn, prototypeColumn);
    return comparison;
  });

  els.pages.replaceChildren(...comparisons);
  els.warnings.textContent = warnings.join(" ");
  els.warnings.classList.toggle("is-visible", warnings.length > 0);
  const exportBlocked = fatalWarnings.length > 0;
  els.printButton.disabled = exportBlocked;
  document.body.classList.toggle("has-fatal-overflow", exportBlocked);
  els.printBlocker.textContent = exportBlocked
    ? `PDF export blocked: ${fatalWarnings.join(" ")}`
    : "";
}

function importAndRender() {
  const docsUrl = normalizeGoogleDocsUrl(els.docsUrl.value);
  if (!docsUrl) {
    els.docsUrl.setAttribute("aria-invalid", "true");
    els.importSummary.textContent = "Paste a valid Google Docs link to continue.";
    return;
  }
  els.docsUrl.removeAttribute("aria-invalid");
  els.docsUrl.value = docsUrl;
  els.docsLink.href = docsUrl;
  documentModel = parseSource();
  paginate();
  const subsectionCount = documentModel.chapters.reduce((sum, chapter) => sum + chapter.subsections.length, 0);
  const chapterCount = new Set(documentModel.chapters.map((chapter) => chapter.title)).size;
  els.importSummary.textContent = `Linked document. ${chapterCount} chapters and ${subsectionCount} subsections are paginated from its local semantic snapshot.`;
}

function normalizeGoogleDocsUrl(value) {
  try {
    const url = new URL(value.trim());
    const match = url.pathname.match(/^\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (url.hostname !== "docs.google.com" || !match) return "";
    return `https://docs.google.com/document/d/${match[1]}/edit`;
  } catch {
    return "";
  }
}

function scheduleRender() {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(paginate, 120);
}

els.importButton.addEventListener("click", importAndRender);
[
  els.title,
  els.subtitle,
  els.website,
  els.year,
  els.summaryTitle,
  els.summaryRights,
  els.summaryEmotions,
  els.summaryEmotionsDetail,
  els.summaryConfidentiality,
  els.summaryBilling,
  els.summaryBillingDetail,
  els.summaryOrganization,
  els.summaryFootnote,
].forEach((input) => input.addEventListener("input", scheduleRender));
els.zoom.addEventListener("input", () => {
  const value = Number(els.zoom.value);
  document.documentElement.style.setProperty("--page-scale", value / 100);
  els.zoomValue.textContent = `${value}%`;
});
els.settingsToggle.addEventListener("click", () => {
  const collapsed = els.shell.classList.toggle("settings-collapsed");
  els.settingsToggle.setAttribute("aria-expanded", String(!collapsed));
  els.settingsToggle.textContent = collapsed ? "Show settings" : "Hide settings";
});
els.figmaToggle.addEventListener("click", () => {
  const hidden = els.shell.classList.toggle("figma-hidden");
  els.figmaToggle.setAttribute("aria-pressed", String(hidden));
  els.figmaToggle.textContent = hidden ? "Show Figma" : "Hide Figma";
});
els.printButton.addEventListener("click", () => window.print());

els.source.innerHTML = sampleSource;
els.docsLink.href = normalizeGoogleDocsUrl(els.docsUrl.value);
document.fonts.ready.then(importAndRender);
