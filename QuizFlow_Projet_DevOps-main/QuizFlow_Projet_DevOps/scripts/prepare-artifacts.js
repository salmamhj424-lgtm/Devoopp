const fs = require('node:fs'); const path = require('node:path');
const root=path.join(__dirname,'..'); const dest=path.join(root,'artifacts');
fs.mkdirSync(dest,{recursive:true});
const fs2=path.join(root,'dist');
fs.writeFileSync(path.join(dest,'build-summary.txt'),`QuizFlow build artifact\nVersion: ${require('../package.json').version}\nBuild exists: ${fs.existsSync(fs2)}\n`);
console.log('Artefacts prepared');
