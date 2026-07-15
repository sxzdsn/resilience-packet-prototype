const ALLOWED_ORIGIN = "https://sxzdsn.github.io";
const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
const DOC_PATH = /^\/document\/d\/([A-Za-z0-9_-]+)/;
const TAB_ID = /^[A-Za-z0-9._-]+$/;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Headers": "Accept",
    "Access-Control-Expose-Headers": "X-Google-Doc-Title",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(status, payload, origin = ALLOWED_ORIGIN) {
  return Response.json(payload, {
    status,
    headers: {
      ...corsHeaders(origin),
      "Cache-Control": "no-store",
    },
  });
}

function googleExportUrl(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Paste a valid docs.google.com document link.");
  }

  const match = url.pathname.match(DOC_PATH);
  if (url.protocol !== "https:" || url.hostname !== "docs.google.com" || !match) {
    throw new Error("Paste a valid docs.google.com document link.");
  }

  const exportUrl = new URL(`https://docs.google.com/document/d/${match[1]}/export`);
  exportUrl.searchParams.set("format", "html");
  const tab = url.searchParams.get("tab");
  if (tab && TAB_ID.test(tab)) exportUrl.searchParams.set("tab", tab);
  return exportUrl;
}

function googleEditUrl(value) {
  const url = new URL(value.trim());
  const match = url.pathname.match(DOC_PATH);
  if (url.protocol !== "https:" || url.hostname !== "docs.google.com" || !match) {
    throw new Error("Paste a valid docs.google.com document link.");
  }
  const editUrl = new URL(`https://docs.google.com/document/d/${match[1]}/edit`);
  const tab = url.searchParams.get("tab");
  if (tab && TAB_ID.test(tab)) editUrl.searchParams.set("tab", tab);
  return editUrl;
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function fetchDocumentTitle(value) {
  try {
    const response = await fetch(googleEditUrl(value), {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 ResiliencePacketPublisher/1.0",
      },
      redirect: "follow",
    });
    if (!response.ok || !googleResponseHostAllowed(response.url)) return "";
    const body = await response.text();
    const match = body.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)/i);
    return match ? decodeHtmlEntities(match[1]).trim() : "";
  } catch {
    return "";
  }
}

function googleResponseHostAllowed(value) {
  try {
    const host = new URL(value).hostname;
    return host === "docs.google.com" || host.endsWith(".googleusercontent.com");
  } catch {
    return false;
  }
}

export default {
  async fetch(request) {
    const requestUrl = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "GET" || requestUrl.pathname !== "/api/google-doc") {
      return jsonResponse(404, { error: "Not found." });
    }
    if (origin && origin !== ALLOWED_ORIGIN) {
      return jsonResponse(403, { error: "This proxy only accepts requests from the published packet." });
    }

    const documentUrl = requestUrl.searchParams.get("url") || "";
    let exportUrl;
    try {
      exportUrl = googleExportUrl(documentUrl);
    } catch (error) {
      return jsonResponse(400, { error: error.message });
    }

    const documentTitlePromise = fetchDocumentTitle(documentUrl);
    if (requestUrl.searchParams.get("metadata") === "1") {
      return jsonResponse(200, { title: await documentTitlePromise }, origin || ALLOWED_ORIGIN);
    }

    let upstream;
    try {
      upstream = await fetch(exportUrl, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "Mozilla/5.0 ResiliencePacketPublisher/1.0",
        },
        redirect: "follow",
      });
    } catch {
      return jsonResponse(502, { error: "The proxy could not reach Google Docs. Check the connection and try again." });
    }

    if (!googleResponseHostAllowed(upstream.url)) {
      return jsonResponse(403, { error: "Google redirected to sign-in. Share the document so anyone with the link can view it, then try again." });
    }
    if (!upstream.ok) {
      const unavailable = [401, 403, 404].includes(upstream.status);
      return jsonResponse(
        unavailable ? upstream.status : 502,
        {
          error: unavailable
            ? "The document is private or unavailable. Share it so anyone with the link can view it, then try again."
            : `Google Docs returned an error (${upstream.status}). Try again.`,
        },
      );
    }

    const declaredLength = Number(upstream.headers.get("Content-Length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_DOCUMENT_BYTES) {
      return jsonResponse(413, { error: "This Google Doc is too large for the prototype importer." });
    }

    const body = await upstream.arrayBuffer();
    if (body.byteLength > MAX_DOCUMENT_BYTES) {
      return jsonResponse(413, { error: "This Google Doc is too large for the prototype importer." });
    }

    const prefix = new TextDecoder().decode(body.slice(0, 20000));
    if (prefix.includes("accounts.google.com") || prefix.includes("ServiceLogin")) {
      return jsonResponse(403, { error: "Google requested sign-in. Share the document so anyone with the link can view it, then try again." });
    }

    const documentTitle = await documentTitlePromise;
    return new Response(body, {
      headers: {
        ...corsHeaders(origin || ALLOWED_ORIGIN),
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
        ...(documentTitle ? { "X-Google-Doc-Title": encodeURIComponent(documentTitle) } : {}),
      },
    });
  },
};
