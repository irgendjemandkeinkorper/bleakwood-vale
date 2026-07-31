"""Browser smoke test for the static Bleakwood Vale app.

Run with a Python environment that has Playwright and Chromium installed:

    python3 scripts/smoke.py
"""

from __future__ import annotations

import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    """Serve the repository without cluttering smoke-test output."""

    def log_message(self, _format: str, *_args: object) -> None:
        return

    def copyfile(self, source, outputfile) -> None:
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            # Chromium may cancel an image request after an onerror fallback.
            # That is normal for this asset-heavy static app, not a test error.
            return


def start_server() -> tuple[ThreadingHTTPServer, str]:
    server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
    server.RequestHandlerClass.directory = str(ROOT)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{server.server_port}/"


def assert_no_mobile_overflow(page) -> None:
    overflow = page.evaluate(
        "document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )
    assert overflow <= 0, f"mobile horizontal overflow: {overflow}px"


def run() -> None:
    server, base = start_server()
    errors: list[str] = []
    failed_local_requests: list[str] = []

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 1280, "height": 900})
            page = context.new_page()
            page.on("pageerror", lambda error: errors.append(f"pageerror: {error}"))
            page.on(
                "console",
                lambda message: errors.append(f"console error: {message.text}")
                if message.type == "error"
                and not message.text.startswith("Failed to load resource")
                else None,
            )
            page.on(
                "response",
                lambda response: failed_local_requests.append(
                    f"{response.status} {response.url}"
                )
                if response.status >= 400 and response.url.startswith(base)
                else None,
            )
            page.on(
                "requestfailed",
                lambda request: failed_local_requests.append(request.url)
                if request.url.startswith(base)
                else None,
            )

            response = page.goto(base, wait_until="domcontentloaded")
            assert response and response.status == 200
            page.wait_for_function("typeof window.showGallery === 'function'")
            assert page.locator("#scr-title.active").count() == 1

            # Solo setup through the first act hub.
            page.get_by_role(
                "button", name="Begin the Tale (this screen)", exact=True
            ).click()
            assert "STEP 1 OF 5" in page.locator("#setup-progress-hook").inner_text().upper()
            page.locator(".hookcard").first.get_by_role(
                "button", name="Choose this Incident", exact=True
            ).click()
            assert "STEP 2 OF 5" in page.locator("#setup-progress-players").inner_text().upper()
            page.select_option("#pl-count", "1")
            page.fill("#pl-name-0", "Smoke Tester")
            page.locator('input[name="art-style"][value="painterly"]').evaluate(
                "element => { element.checked = true; element.dispatchEvent(new Event('change', { bubbles: true })); }"
            )
            page.get_by_role("button", name="Light the Candles", exact=True).click()
            assert "STEP 3 OF 5" in page.locator("#setup-progress-intro").inner_text().upper()
            page.get_by_role("button", name="So It Begins", exact=True).click()
            assert "STEP 4 OF 5" in page.locator("#scr-archsetup .setup-progress").inner_text().upper()

            for index in range(6):
                page.fill("#arch-name", f"Smoke Archetype {index + 1}")
                page.fill("#arch-answer", f"Smoke fact {index + 1}")
                page.locator("#scr-archsetup button.primary").click()

            assert "STEP 5 OF 5" in page.locator("#scr-victim .setup-progress").inner_text().upper()
            page.fill("#victim-name", "The Smoke Test Victim")
            page.get_by_role("button", name="Deal the Cards", exact=True).click()
            page.wait_for_selector("#scr-hub.active")
            assert "ACT THE FIRST" in page.locator("#tb-act").inner_text().upper()

            # First-scene primer appears once, then yields to scene setup.
            page.get_by_role("button", name="Begin a scene", exact=True).click()
            page.wait_for_selector("#scr-scene.active")
            assert page.locator("#scr-scene .turn-diagram").count() == 1
            page.get_by_role("button", name="Got it — begin", exact=True).click()
            assert page.locator("#scr-scene #btn-begin").count() == 1
            first_scene_card = page.locator("#scr-scene [id^='scene-pick-']").first
            first_scene_card.focus()
            page.keyboard.press("Enter")
            assert first_scene_card.get_attribute("aria-pressed") == "true"
            page.get_by_role("button", name="Back to the Table", exact=True).click()
            page.wait_for_selector("#scr-hub.active")

            # Gallery: each archetype retains two distinct face quotes.
            page.locator(
                '#topbar button[title="Browse the card art while others plot"]'
            ).click()
            page.wait_for_selector("#overlay[style*='block']")
            tile = page.locator(".gcat-archetypes .gtile").first
            assert page.locator(".gcat-archetypes .gtile").count() == 16
            quote = tile.locator("[data-gallery-side-quote]")
            front_quote = quote.inner_text()
            tile.locator(".gallery-flip-control").click()
            assert quote.inner_text() == quote.get_attribute("data-back-quote")
            assert quote.inner_text() != front_quote
            assert tile.locator("[data-gallery-side-label]").inner_text() == "Side II — turned"

            tile.focus()
            page.keyboard.press("Enter")
            page.wait_for_selector(".gdetail")
            detail_quote = page.locator(".gdetail [data-gallery-side-quote]")
            detail_front = detail_quote.inner_text()
            page.locator(".gdetail .gallery-flip-control").click()
            assert detail_quote.inner_text() != detail_front
            page.locator("#overlay-content > button.ghost").click()

            # Online entry should remain reachable without creating a room.
            page.evaluate("window.showOnlineEntry()")
            page.wait_for_selector("#scr-online-entry.active")
            assert page.locator("#oe-join-code").count() == 1
            assert page.locator("#oe-host-name").count() == 1
            assert "STEP 1 OF 5" in page.locator("#scr-online-entry .setup-progress").inner_text().upper()

            # A same-action room snapshot must preserve an uncommitted buy-in
            # draft. This uses the public room renderer with a deterministic
            # fixture, so it never creates or joins a real Firebase room.
            fake_room = {
                "phase": "playing",
                "act": 1,
                "journal": [],
                "pendingSecret": None,
                "closeDone": False,
                "hook": {"title": "Smoke Incident"},
                "victim": {"name": "Smoke Victim"},
                "discardTones": [],
                "sceneDeck": [],
                "omenDeck": [],
                "omenRow": [{"title": "The Black Dog", "line": "A sign.", "glyph": "☽"}],
                "players": [{"name": "Smoke Player", "scenesLeft": 1, "handCount": 0, "omens": []}],
                "archetypes": [
                    {
                        "role": "The Disgraced Alienist",
                        "name": "The Disgraced Alienist",
                        "flipped": False,
                        "sides": [
                            {"cond": "If smoke gathers.", "tone": "Dread"},
                            {"cond": "If smoke clears.", "tone": "Guilt"},
                        ],
                    }
                ],
                "current": {
                    "type": "scene",
                    "starter": 0,
                    "archIdx": 0,
                    "card": {"title": "Smoke Scene", "prompt": "A test scene.", "tone": "Guilt"},
                    "contributions": [],
                    "opening": "",
                    "happened": "",
                },
            }
            page.evaluate("room => window.routeAndRender(room)", fake_room)
            page.wait_for_selector("#scr-scene.active")
            page.evaluate("window.onlineStartContrib()")
            assert page.get_by_role("button", name="Never mind", exact=True).count() == 1
            page.evaluate("room => window.routeAndRender(room)", fake_room)
            assert page.get_by_role("button", name="Never mind", exact=True).count() == 1

            # A fresh narrow viewport must not introduce page overflow.
            mobile_context = browser.new_context(viewport={"width": 390, "height": 844})
            mobile = mobile_context.new_page()
            mobile.goto(base, wait_until="domcontentloaded")
            mobile.wait_for_function("typeof window.showGallery === 'function'")
            assert_no_mobile_overflow(mobile)
            mobile.get_by_role(
                "button", name="The Gallery", exact=True
            ).last.click()
            mobile.wait_for_selector(".gcat-archetypes .gtile")
            assert_no_mobile_overflow(mobile)
            mobile.close()
            mobile_context.close()
            context.close()
            browser.close()

    finally:
        server.shutdown()
        server.server_close()

    assert not failed_local_requests, failed_local_requests
    assert not errors, "\n".join(errors)
    print(
        "Browser smoke test passed: solo setup, Act I hub, Gallery face quotes, "
        "online entry, and mobile overflow."
    )


if __name__ == "__main__":
    run()
