#!/usr/bin/env python3
"""Local static server with a narrow Google Docs HTML export proxy."""

from __future__ import annotations

import argparse
import html
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


DOC_PATH = re.compile(r"^/document/d/([A-Za-z0-9_-]+)")
TAB_ID = re.compile(r"^[A-Za-z0-9._-]+$")
MAX_DOCUMENT_BYTES = 8 * 1024 * 1024
MAX_METADATA_BYTES = 1024 * 1024
OG_TITLE = re.compile(rb'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']*)', re.IGNORECASE)


def google_export_url(value: str) -> str:
    parsed = urllib.parse.urlparse(value.strip())
    match = DOC_PATH.match(parsed.path)
    if parsed.scheme != "https" or parsed.hostname != "docs.google.com" or not match:
        raise ValueError("Paste a valid docs.google.com document link.")

    query = {"format": "html"}
    tab = urllib.parse.parse_qs(parsed.query).get("tab", [""])[0]
    if tab and TAB_ID.fullmatch(tab):
        query["tab"] = tab
    return f"https://docs.google.com/document/d/{match.group(1)}/export?{urllib.parse.urlencode(query)}"


def google_edit_url(value: str) -> str:
    parsed = urllib.parse.urlparse(value.strip())
    match = DOC_PATH.match(parsed.path)
    if parsed.scheme != "https" or parsed.hostname != "docs.google.com" or not match:
        raise ValueError("Paste a valid docs.google.com document link.")
    query = {}
    tab = urllib.parse.parse_qs(parsed.query).get("tab", [""])[0]
    if tab and TAB_ID.fullmatch(tab):
        query["tab"] = tab
    suffix = f"?{urllib.parse.urlencode(query)}" if query else ""
    return f"https://docs.google.com/document/d/{match.group(1)}/edit{suffix}"


def fetch_document_title(value: str) -> str:
    request = urllib.request.Request(
        google_edit_url(value),
        headers={
            "Accept": "text/html,application/xhtml+xml",
            "User-Agent": "Mozilla/5.0 ResiliencePacketPublisher/1.0",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read(MAX_METADATA_BYTES)
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
        return ""
    match = OG_TITLE.search(body)
    return html.unescape(match.group(1).decode("utf-8", errors="replace")).strip() if match else ""


class PublisherHandler(SimpleHTTPRequestHandler):
    server_version = "ResiliencePublisher/1.0"

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, status: int, payload: dict[str, str]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802 - stdlib handler API
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/api/google-doc":
            super().do_GET()
            return

        document_url = urllib.parse.parse_qs(parsed.query).get("url", [""])[0]
        try:
            export_url = google_export_url(document_url)
        except ValueError as error:
            self.send_json(400, {"error": str(error)})
            return

        document_title = fetch_document_title(document_url)
        if urllib.parse.parse_qs(parsed.query).get("metadata", [""])[0] == "1":
            self.send_json(200, {"title": document_title})
            return

        request = urllib.request.Request(
            export_url,
            headers={
                "Accept": "text/html,application/xhtml+xml",
                "User-Agent": "Mozilla/5.0 ResiliencePacketPublisher/1.0",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                final_host = urllib.parse.urlparse(response.geturl()).hostname
                if not final_host or (final_host != "docs.google.com" and not final_host.endswith(".googleusercontent.com")):
                    self.send_json(403, {"error": "Google redirected to sign-in. Share the document so anyone with the link can view it, then try again."})
                    return
                body = response.read(MAX_DOCUMENT_BYTES + 1)
        except urllib.error.HTTPError as error:
            if error.code in {401, 403, 404}:
                message = "The document is private or unavailable. Share it so anyone with the link can view it, then try again."
            else:
                message = f"Google Docs returned an error ({error.code}). Try again."
            self.send_json(error.code if error.code < 600 else 502, {"error": message})
            return
        except (urllib.error.URLError, TimeoutError):
            self.send_json(502, {"error": "The local server could not reach Google Docs. Check the connection and try again."})
            return

        if len(body) > MAX_DOCUMENT_BYTES:
            self.send_json(413, {"error": "This Google Doc is too large for the prototype importer."})
            return
        if b"accounts.google.com" in body[:20000] or b"ServiceLogin" in body[:20000]:
            self.send_json(403, {"error": "Google requested sign-in. Share the document so anyone with the link can view it, then try again."})
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        if document_title:
            self.send_header("X-Google-Doc-Title", urllib.parse.quote(document_title, safe=""))
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("port", nargs="?", type=int, default=8765)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    handler = lambda *handler_args, **kwargs: PublisherHandler(  # noqa: E731
        *handler_args, directory=str(root), **kwargs
    )
    server = ThreadingHTTPServer(("localhost", args.port), handler)
    print(f"Resilience Packet Publisher: http://localhost:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
