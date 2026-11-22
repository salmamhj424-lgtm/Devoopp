const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'src'), { recursive: true });
for (const name of ['index.html', 'src/styles.css', 'src/app.js', 'src/quiz-core.js']) {
  const target = path.join(dist, name);
  fs.copyFileSync(path.join(root, name), target);
}
fs.writeFileSync(path.join(dist, 'build-info.json'), JSON.stringify({app:'QuizFlow', version:require('../package.json').version}, null, 2));
console.log('BUILD PASSED — dist/ generated');
