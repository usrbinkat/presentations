#!/usr/bin/env bash
# scripts/lint-overflow.sh
#
# Checks every slide in a running Slidev deck for:
# - Content overflow (vertical and horizontal) at every v-click state
# - Title wrapping (independent exit condition)
# - Minimum readable font size below 10px (independent exit condition)
# - Unmeasurable slides (selector miss — no aurora scheme container found)
# - Raw frontmatter rendering (broken --- separators)
#
# Uses terminal-browser action CLI to drive the already-open browser.
# Accepts DECK and PORT from environment (passed by Makefile).
#
# Usage:
#   make dev                    # start the deck
#   make lint-slides            # run this script
#   DECK=hello-world PORT=3031 make lint-slides

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

# Silent variant for commands whose stdout we discard (key presses)
tb_silent() {
  tb "$@" > /dev/null
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
SKIPPED=0
FRONTMATTER_BREAKS=0
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

  # Measure overflow, title wrap, font sizes, and detect raw frontmatter
  RESULT=$(tb eval '
    (() => {
      // Find the visible slide page — Slidev uses .slidev-page-N, not .slidev-page-current
      let activePage = document.querySelector(".slidev-page-current");
      if (!activePage || activePage.getBoundingClientRect().width === 0) {
        for (const p of document.querySelectorAll("[class*=\"slidev-page-\"]")) {
          const r = p.getBoundingClientRect();
          if (r.width > 100 && r.height > 100) { activePage = p; break; }
        }
      }
      const active = activePage?.querySelector("[class*=\"aurora-\"][class*=\"-scheme\"]")
        || document.querySelector("[class*=\"aurora-\"][class*=\"-scheme\"]");
      if (!active || active.scrollHeight <= 0 || active.clientHeight <= 0)
        return "SKIP|||||||||";

      const s = active.scrollHeight;
      const c = active.clientHeight;

      // Method 1: scrollHeight vs clientHeight (works when overflow is visible/auto/scroll)
      const scrollVOverflow = Math.max(0, s - c);
      const scrollHOverflow = Math.max(0, active.scrollWidth - active.clientWidth);

      // Method 2: child bounding rects vs container rect (works under overflow:hidden)
      const containerRect = active.getBoundingClientRect();
      let childVOverflow = 0;
      let childHOverflow = 0;
      let childNearBottom = 0;
      const MARGIN_PX = 4;
      for (const child of active.querySelectorAll("*")) {
        if (!child.textContent?.trim() && !child.querySelector("img,svg,canvas")) continue;
        // Skip v-click hidden elements
        let vhidden = false;
        let n = child;
        while (n && n !== active) {
          if (n.classList?.contains("slidev-vclick-hidden")) {
            if (parseFloat(getComputedStyle(n).opacity) === 0) { vhidden = true; break; }
          }
          n = n.parentElement;
        }
        if (vhidden) continue;
        const cr = child.getBoundingClientRect();
        if (cr.width === 0 && cr.height === 0) continue;
        const vExceed = Math.round(cr.bottom - containerRect.bottom);
        const hExceed = Math.round(cr.right - containerRect.right);
        const nearBottom = Math.round(containerRect.bottom - cr.bottom);
        if (vExceed > childVOverflow) childVOverflow = vExceed;
        if (hExceed > childHOverflow) childHOverflow = hExceed;
        if (nearBottom >= 0 && nearBottom < MARGIN_PX && cr.height > 0) {
          childNearBottom = Math.max(childNearBottom, MARGIN_PX - nearBottom);
        }
      }

      // Use the larger of the two methods for each axis
      const vOverflow = Math.max(scrollVOverflow, childVOverflow);
      const hOverflow = Math.max(scrollHOverflow, childHOverflow);

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
      for (const el of active.querySelectorAll("*")) {
        if (el.children.length > 0 || !el.textContent.trim()) continue;
        let hidden = false;
        let node = el;
        while (node && node !== active) {
          if (node.classList?.contains("slidev-vclick-hidden")) {
            if (parseFloat(getComputedStyle(node).opacity) === 0) { hidden = true; break; }
          }
          node = node.parentElement;
        }
        if (hidden) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < minFont) minFont = fs;
      }

      // Detect raw frontmatter: visible text starting with layout: or color: or class:
      const text = active.textContent || "";
      const rawFm = /^(layout|color|class|transition|routeAlias|src)\s*:/.test(text.trim()) ? "FRONTMATTER" : "ok";

      const h = h1 || active.querySelector("h2") || active.querySelector("h3");
      const t = h?.textContent?.trim() || active.textContent?.trim().substring(0, 60) || "";

      return s + "|" + c + "|" + vOverflow + "|" + hOverflow + "|" + titleWrap + "|" + titleH + "|" + (minFont === 999 ? 0 : Math.round(minFont)) + "|" + rawFm + "|" + childNearBottom + "|" + t;
    })()
  ')

  SCROLL=$(echo "$RESULT" | cut -d'|' -f1)
  CLIENT=$(echo "$RESULT" | cut -d'|' -f2)
  VOVERFLOW=$(echo "$RESULT" | cut -d'|' -f3)
  HOVERFLOW=$(echo "$RESULT" | cut -d'|' -f4)
  TITLEWRAP=$(echo "$RESULT" | cut -d'|' -f5)
  TITLEH=$(echo "$RESULT" | cut -d'|' -f6)
  MINFONT=$(echo "$RESULT" | cut -d'|' -f7)
  RAWFM=$(echo "$RESULT" | cut -d'|' -f8)
  NEARBOTTOM=$(echo "$RESULT" | cut -d'|' -f9)
  TITLE=$(echo "$RESULT" | cut -d'|' -f10-)

  STATES_MEASURED=$((STATES_MEASURED + 1))

  # Unmeasurable slide — selector missed
  if [ "$SCROLL" = "SKIP" ]; then
    echo "  ⚠ slide $SLIDE: SKIPPED (no aurora scheme container found)"
    SKIPPED=$((SKIPPED + 1))
  elif [ "$SCROLL" -gt 0 ] && [ "$CLIENT" -gt 0 ]; then
    FINDINGS=""

    if [ "$VOVERFLOW" -gt 0 ]; then
      FINDINGS="$FINDINGS v-overflow:+${VOVERFLOW}px"
      OVERFLOWS=$((OVERFLOWS + 1))
    fi

    if [ "$HOVERFLOW" -gt 0 ]; then
      FINDINGS="$FINDINGS h-overflow:+${HOVERFLOW}px"
      OVERFLOWS=$((OVERFLOWS + 1))
    fi

    if [ "$NEARBOTTOM" -gt 0 ]; then
      FINDINGS="$FINDINGS near-edge:${NEARBOTTOM}px"
    fi

    if [ "$TITLEWRAP" = "WRAP" ]; then
      FINDINGS="$FINDINGS title-wraps:${TITLEH}px"
      TITLEWRAPS=$((TITLEWRAPS + 1))
    fi

    if [ "$MINFONT" -gt 0 ] && [ "$MINFONT" -lt 10 ]; then
      FINDINGS="$FINDINGS min-font:${MINFONT}px"
      FONTWARNS=$((FONTWARNS + 1))
    fi

    if [ "$RAWFM" = "FRONTMATTER" ]; then
      FINDINGS="$FINDINGS raw-frontmatter"
      FRONTMATTER_BREAKS=$((FRONTMATTER_BREAKS + 1))
    fi

    if [ -n "$FINDINGS" ]; then
      echo "  ✗ slide $SLIDE: \"$TITLE\" [${SCROLL}x${CLIENT} $FINDINGS ]"
    else
      echo "  ✓ slide $SLIDE: \"$TITLE\" [${SCROLL}x${CLIENT} font:${MINFONT}px]"
    fi
  else
    echo "  ⚠ slide $SLIDE: SKIPPED (zero scroll/client: ${SCROLL}/${CLIENT})"
    SKIPPED=$((SKIPPED + 1))
  fi

  # Advance
  PREV_SLIDE="$SLIDE"
  tb_silent key ArrowRight
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

  if [ "$PREV_SLIDE" = "$TOTAL" ] && [ "$NEXT_SLIDE" = "$TOTAL" ] && [ "$PREV_SLIDE" = "$NEXT_SLIDE" ]; then
    tb_silent key ArrowRight
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

if [ "$VISITED_LAST" != "true" ]; then
  echo "ERROR: navigation budget exhausted before reaching slide $TOTAL"
  echo "  measured $STATES_MEASURED states, last slide seen: $CURRENT"
  exit 1
fi

echo "measured $STATES_MEASURED click states across $TOTAL slides"

ISSUES=$((OVERFLOWS + FONTWARNS + TITLEWRAPS + SKIPPED + FRONTMATTER_BREAKS))
if [ "$ISSUES" -gt 0 ]; then
  echo "$OVERFLOWS overflow(s), $TITLEWRAPS title wrap(s), $FONTWARNS font warning(s), $SKIPPED skipped, $FRONTMATTER_BREAKS frontmatter break(s)"
  exit 1
else
  echo "all slides pass"
  exit 0
fi
