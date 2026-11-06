#!/bin/bash
# PostToolUse hook: after an Edit/Write to an .html file, syntax-check its inline
# <script> blocks. Exit 2 sends the error back to Claude so it fixes it right away.
f=$(jq -r '.tool_response.filePath // .tool_input.file_path // empty')
case "$f" in *.html|*.htm) ;; *) exit 0 ;; esac
[ -f "$f" ] || exit 0
if ! out=$(osascript -l JavaScript "$(dirname "$0")/check-html-js.js" "$f" 2>&1); then
  printf '%s\n' "$out" | sed -e 's/^.*execution error: //' -e 's/^Error: //' -e 's/ (-[0-9]*)$//' >&2
  exit 2
fi
exit 0
