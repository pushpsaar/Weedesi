const ts = require('typescript');
const path = require('path');
const filePath = path.join(__dirname, '../src/lib/auth.ts');
const configPath = ts.findConfigFile(path.join(__dirname,'..'), ts.sys.fileExists, 'tsconfig.json');
if (!configPath) throw new Error('tsconfig not found');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
if (configFile.error) throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
const program = ts.createProgram([filePath], parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length === 0) {
  console.log('no diagnostics');
} else {
  diagnostics.forEach((d) => {
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    if (d.file) {
      const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
      console.log(`${d.file.fileName} (${line+1},${character+1}): ${message}`);
    } else {
      console.log(message);
    }
  });
}
