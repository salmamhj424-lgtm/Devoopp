const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const dir = path.join(__dirname,'..','dist');
for (const name of ['index.html','src/app.js','src/quiz-core.js','src/styles.css']) {
  assert.ok(fs.existsSync(path.join(dir,name)), `Artefact manquant: ${name}`);
}
assert.match(fs.readFileSync(path.join(dir,'index.html'),'utf8'), /QuizFlow/);
assert.match(fs.readFileSync(path.join(dir,'src/app.js'),'utf8'), /renderQuestion/);
console.log('SMOKE PASSED — build and core app assets available');
