#!/usr/bin/env bash
# scripts/lint-overflow.sh
#
# Checks every slide in a running Slidev deck for:
# - Content overflow (vertical and horizontal) at every v-click state
# - Title wrapping (independent exit condition)
# - Minimum readable font size below 10px (independent exit condition)
#
# Uses terminal-browser action CLI to drive the already-open browser.
# Accepts DECK and PORT from environment (passed by Makefile).
#
# Usage:
#   make dev                    # start the deck
#   make lint                   # run this script
#   DECK=hello-world PORT=3031 make lint

set -euo pipefail

DECK="${DECK:-rekindle-transport-veilid}"
PORT="${PORT:-3030}"

# Detect which browser to target
BROWSER_KEY=""
if ! terminal-browser action -- snapshot > /dev/null 2>&1; then
  BROWSER_KEY=$(terminal-browser ls --json 2>/dev/null | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    const browsers = data.browsers || (Array.isArray(data) ? data : []);
    const b = browsers.find(b => b.key);
    if (b) process.stdout.write(b.key);
  " 2>/dev/null || true)
  if [ -z "$BROWSER_KEY" ]; then
    echo "ERROR: no terminal-browser found. Run 'make dev' in a terminal-browser pane first."
    exit 1
  fi
  echo "using browser: $BROWSER_KEY"
fi

tb() {
  local raw
  if [ -n "$BROWSER_KEY" ]; then
    raw=$(terminal-browser action --browser "$BROWSER_KEY" -- "$@" 2> >(grep -v nixVulkanIntel >&2))
  else
    raw=$(terminal-browser action -- "$@" 2> >(grep -v nixVulkanIntel >&2))
  fi
  echo "${raw%\"}" | sed 's/^"//'
}

TOTAL=$(tb eval '
  (() => {
    for (const el of document.querySelectorAll("nav span, nav div")) {
      const m = el.textContent.match(/(\d+) \/ (\d+)/);
      if (m) return m[2];
    }
    return "0";
  })()
')

if [ "$TOTAL" = "0" ] || [ -z "$TOTAL" ]; then
  echo "ERROR: could not detect slide count. Is deck '$DECK' running on port $PORT?"
  exit 1
fi

echo "deck: $DECK ($TOTAL slides) on port $PORT"
echo ""

# Navigate to slide 1
tb eval "window.location.pathname = '/1'" > /dev/null
sleep 3

OVERFLOWS=0
FONTWARNS=0
TITLEWRAPS=0
CURRENT=""
VISITED_LAST=false
STATES_MEASURED=0

for _ in $(seq 1 $((TOTAL * 20))); do
  SLIDE=$(tb eval '
    (() => {
      for (const el of document.querySelectorAll("nav span, nav div")) {
        const m = el.textContent.match(/(\d+) \/ (\d+)/);
        if (m) return m[1];
      }
      return "?";
    })()
  ')

  if [ "$SLIDE" != "$CURRENT" ]; then
    CURRENT="$SLIDE"
    sleep 0.3
  fi

  # Measure overflow, title wrap, and font sizes at this click state
  RESULT=$(tb eval '
    (() => {
      const active = document.querySelector(".slidev-page-current [class*=\"aurora-\"][class*=\"-scheme\"]")
        || document.querySelector("[class*=\"aurora-\"][class*=\"-scheme\"]");
      if (!active || active.scrollHeight <= 0 || active.clientHeight <= 0)
        return "0|0|0|none|0|0|";

      const s = active.scrollHeight;
      const c = active.clientHeight;
      const hOverflow = active.scrollWidth > active.clientWidth ? active.scrollWidth - active.clientWidth : 0;

      const h1 = active.querySelector("h1");
      let titleWrap = "none";
      let titleH = 0;
      if (h1) {
        const lh = getComputedStyle(h1).lineHeight;
        const lhPx = lh === "normal" ? parseFloat(getComputedStyle(h1).fontSize) * 1.2 : parseFloat(lh);
        titleWrap = h1.scrollHeight > lhPx * 1.5 ? "WRAP" : "ok";
        titleH = h1.scrollHeight;
      }

      let minFont = 999;
      const all = active.querySelectorAll("*");
      for (const el of all) {
        if (el.children.length > 0 || !el.textContent.trim()) continue;
        // Check effective visibility: walk ancestors for hidden v-click
        let hidden = false;
        let node = el;
        while (node && node !== active) {
          if (node.classList && node.classList.contains("slidev-vclick-hidden")) {
            const op = parseFloat(getComputedStyle(node).opacity);
            if (op === 0) { hidden = true; break; }
          }
          node = node.parentElement;
        }
        if (hidden) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < minFont) minFont = fs;
      }

      const h = h1 || active.querySelector("h2") || active.querySelector("h3");
      const t = h?.textContent?.trim() || active.textContent?.trim().substring(0, 40) || "";

      return s + "|" + c + "|" + hOverflow + "|" + titleWrap + "|" + titleH + "|" + (minFont === 999 ? 0 : Math.round(minFont)) + "|" + t;
    })()
  ')

  SCROLL=$(echo "$RESULT" | cut -d'|' -f1)
  CLIENT=$(echo "$RESULT" | cut -d'|' -f2)
  HOVERFLOW=$(echo "$RESULT" | cut -d'|' -f3)
  TITLEWRAP=$(echo "$RESULT" | cut -d'|' -f4)
  TITLEH=$(echo "$RESULT" | cut -d'|' -f5)
  MINFONT=$(echo "$RESULT" | cut -d'|' -f6)
  TITLE=$(echo "$RESULT" | cut -d'|' -f7-)

  STATES_MEASURED=$((STATES_MEASURED + 1))

  if [ "$SCROLL" -gt 0 ] && [ "$CLIENT" -gt 0 ]; then
    VDIFF=$((SCROLL - CLIENT))
    FINDINGS=""

    if [ "$VDIFF" -gt 4 ]; then
      FINDINGS="$FINDINGS overflow:+${VDIFF}px"
      OVERFLOWS=$((OVERFLOWS + 1))
    fi

    if [ "$HOVERFLOW" -gt 0 ]; then
      FINDINGS="$FINDINGS h-overflow:+${HOVERFLOW}px"
      OVERFLOWS=$((OVERFLOWS + 1))
    fi

    if [ "$TITLEWRAP" = "WRAP" ]; then
      FINDINGS="$FINDINGS title-wraps:${TITLEH}px"
      TITLEWRAPS=$((TITLEWRAPS + 1))
    fi

    if [ "$MINFONT" -gt 0 ] && [ "$MINFONT" -lt 10 ]; then
      FINDINGS="$FINDINGS min-font:${MINFONT}px"
      FONTWARNS=$((FONTWARNS + 1))
    fi

    if [ -n "$FINDINGS" ]; then
      echo "  ✗ slide $SLIDE: \"$TITLE\" [$FINDINGS ]"
    fi
  fi

  # Advance — continue through last slide's click states
  PREV_SLIDE="$SLIDE"
  tb key ArrowRight
  sleep 0.15

  # Check if we moved past the last slide
  NEXT_SLIDE=$(tb eval '
    (() => {
      for (const el of document.querySelectorAll("nav span, nav div")) {
        const m = el.textContent.match(/(\d+) \/ (\d+)/);
        if (m) return m[1];
      }
      return "?";
    })()
  ')

  # If we were on the last slide and ArrowRight didn't change the slide number,
  # we've exhausted all click states on the last slide
  if [ "$PREV_SLIDE" = "$TOTAL" ] && [ "$NEXT_SLIDE" = "$TOTAL" ] && [ "$PREV_SLIDE" = "$NEXT_SLIDE" ]; then
    # One more press to confirm we're truly at the end
    tb key ArrowRight
    sleep 0.15
    CONFIRM=$(tb eval '
      (() => {
        for (const el of document.querySelectorAll("nav span, nav div")) {
          const m = el.textContent.match(/(\d+) \/ (\d+)/);
          if (m) return m[1];
        }
        return "?";
      })()
    ')
    if [ "$CONFIRM" = "$TOTAL" ]; then
      VISITED_LAST=true
      break
    fi
  fi
done

echo ""

# Postcondition: verify we reached the last slide
if [ "$VISITED_LAST" != "true" ]; then
  echo "ERROR: navigation budget exhausted before reaching slide $TOTAL"
  echo "  measured $STATES_MEASURED states, last slide seen: $CURRENT"
  exit 1
fi

# Report all defects found — no slide-level dedup, every state counts
echo "measured $STATES_MEASURED click states across $TOTAL slides"

ISSUES=$((OVERFLOWS + FONTWARNS + TITLEWRAPS))
if [ "$ISSUES" -gt 0 ]; then
  echo "$OVERFLOWS overflow(s), $TITLEWRAPS title wrap(s), $FONTWARNS font warning(s)"
  exit 1
else
  echo "all slides pass"
  exit 0
fi
