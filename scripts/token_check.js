const fs = require('fs');
const path = process.argv[2] || 'src/app/shop/page.tsx';
const p = path.startsWith('/') || path[1]===':' ? path : require('path').join(process.cwd(), path);
const s = fs.readFileSync(p,'utf8');
const counts = { '(':0, ')':0, '{':0, '}':0, '<':0, '>':0, '`':0 };
for (const ch of s) if (counts.hasOwnProperty(ch)) counts[ch]++;
console.log('Token counts for', p);
console.log(counts);
console.log('Paren balance:', counts['(']-counts[')']);
console.log('Curly balance:', counts['{']-counts['}']);
console.log('Angle balance:', counts['<']-counts['>']);

// Show lines around possible problem areas: find first occurrence of unmatched }
let openCurly = 0;
const lines = s.split(/\r?\n/);
for (let i=0;i<lines.length;i++){
  const line = lines[i];
  for (const ch of line){
    if (ch==='{') openCurly++;
    else if (ch==='}') openCurly--;
    if (openCurly<0){
      console.log('Early closing curly at line', i+1);
      console.log(lines.slice(Math.max(0,i-3),i+3).join('\n'));
      process.exit(0);
    }
  }
}
console.log('No early closing curly found.');
// print lines 1..200 with numbers for inspection
console.log('\nFile with line numbers:');
for (let i=0;i<lines.length;i++){
  console.log(String(i+1).padStart(3,' ')+': '+lines[i]);
}
