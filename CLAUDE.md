# talpín

Website that helps high school students in Kazakhstan find scholarships abroad, follow short guides and track deadlines.

## Layout

- `talpin/index.html`: the whole site in one file (HTML, CSS and JavaScript, no build step). Hash routing: `#home`, `#scholarships`, `#scholarship.<id>`, `#deadlines`, `#guides`, `#guide.<id>`, `#signup`, `#confirm`, `#verify.<token>`, `#login`, `#dashboard`, `#profile`.
- `talpin/garden-snake.html`: a separate little game, not part of the site.
- Published copy (private artifact): https://claude.ai/artifact/C91zWgja63WGRoNuAFFDQr. Republish there after every change, never to a new URL.
- Figma: "talpín — website" (key `tW2E890uXJLOYOoU2XPF0T`) holds the design system and 8 desktop screens. The user wants future Figma work done in their own file "Adilet" (key `pMZyUOx9dadzgIT9SwWEGQ`). The team is on Figma's free Starter plan: 3 pages per file, 1 variable mode, and a monthly cap on MCP calls, so batch Figma work into few large calls.

## How the site works

- No backend. Accounts, saved scholarships, document ticks, profile photos and "read" guides live in the visitor's own `localStorage` (keys start with `talpin.`). Every storage access goes through the `store` helper, which falls back to memory when storage is blocked.
- Sign-up is 4 steps (role, birthday wheels, name + nickname, email + password), then a demo email confirmation shown on the page. Real email needs a server; say so plainly rather than pretending.
- Profile photos are centre-cropped to 100 × 100 px JPEG data URLs (`toSquare100`).
- Scholarship deadlines are typical dates from past cycles (`MM-DD`), rolled forward to the next occurrence. The detail page shows a live countdown to 23:59 local time on the deadline day.

## Design rules

- Minimal, near-monochrome, **dark by default**; light theme only via the toggle (`data-theme="light"`).
- Colours only through the tokens at the top of the `<style>` block (`--bg`, `--surface`, `--raise`, `--fg`, `--muted`, `--faint`, `--line`, `--accent`, `--warn`, `--ok`, `--blue`). Define every new token in both the dark `:root` block and the light block.
- Fonts: Unbounded for display, Geist for body text, Geist Mono for dates, counts, labels and code.
- Hairline dividers between list rows rather than cards. Countdown chips: amber ≤ 21 days, accent ≤ 60 days, muted otherwise.
- The deadline countdown on scholarship pages is a solid black-and-white block that inverts with the theme. The "Official website" button is solid blue (`.btn-blue`).
- Copy: plain, friendly, sentence case, written for teenagers. Fix the user's spelling and grammar in anything shown on the site.
- Must work at phone width with a 16px side gutter and no sideways scroll.

## Checking changes

- This Mac has Apple's command line tools (so `git` and a real `python3`) but no Node. To run JavaScript outside the browser, use macOS's built-in engine: `osascript -l JavaScript`.
- The folder is a Git repository on `main`. Commit after each finished change with a short message that says what changed for visitors (for example "Add live deadline countdown").
- A project hook (`.claude/settings.json` → `.claude/hooks/check-html-js.sh`) syntax-checks the inline `<script>` of any `.html` file after each edit and reports parse errors back.
- To click through the site in the browser pane: open the file (it loads as a `data:` snapshot whose `#hash` can't change), then load the same HTML into a full-size `<iframe srcdoc>` and drive it by setting `contentWindow.location.hash`. Don't click `href="#…"` links inside that iframe; they escape to the parent URL. `localStorage` is blocked there, so state lasts only for that page.
