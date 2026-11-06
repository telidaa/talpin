// Syntax-checks every inline <script> in an HTML file with macOS's built-in
// JavaScript engine. Usage: osascript -l JavaScript check-html-js.js <file.html>
// Exits non-zero with a readable message when any script fails to parse.
ObjC.import('Foundation');

function run(argv) {
  const path = argv[0];
  const raw = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, null);
  if (!raw || raw.isNil()) return;
  const html = raw.js;
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const problems = [];
  let m, n = 0;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\bsrc\s*=/i.test(attrs)) continue;
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
    // Skip JSON, templates and ES modules (import/export can't be checked this way).
    if (type && !/^(text|application)\/(javascript|ecmascript)$/i.test(type)) continue;
    n++;
    const startLine = html.slice(0, m.index).split('\n').length;
    try {
      new Function(m[2]);
    } catch (e) {
      // new Function() adds two wrapper lines; the script body starts on the <script> line.
      const where = e.line ? `, near line ${startLine + e.line - 3}` : '';
      problems.push(`script #${n} (opens on line ${startLine}${where}): ${e.name}: ${e.message}`);
    }
  }
  if (problems.length) {
    throw new Error(`Inline JavaScript in ${path} does not parse:\n` + problems.join('\n'));
  }
}
