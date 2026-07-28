const ts = require('typescript');
const fs = require('fs');
const p = process.argv[2] || 'src/app/shop/page.tsx';
const sourceText = fs.readFileSync(p, 'utf8');
const sourceFile = ts.createSourceFile(p, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([p], { allowJs: true, jsx: ts.JsxEmit.Preserve, noEmit: true }));
if (diagnostics.length === 0) {
  console.log('No diagnostics from TypeScript program.');
} else {
  diagnostics.forEach(d => {
    const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    if (d.file) {
      const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
      console.log(`${d.file.fileName} (${line+1},${character+1}): ${msg}`);
    } else {
      console.log(msg);
    }
  });
}
// Also show parse diagnostics
const parseDiagnostics = sourceFile.parseDiagnostics;
if (parseDiagnostics && parseDiagnostics.length) {
  console.log('\nParse diagnostics:');
  parseDiagnostics.forEach(d => {
    const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(d.start);
    console.log(`${p} (${line+1},${character+1}): ${msg}`);
  });
}
