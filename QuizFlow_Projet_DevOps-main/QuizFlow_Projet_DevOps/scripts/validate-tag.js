const tag=process.env.TAG_NAME || process.argv[2] || '';
if (!/^v\d+\.\d+\.\d+$/.test(tag)) {
 console.error('FAILED — tag attendu : vX.Y.Z ; reçu : '+JSON.stringify(tag));
 process.exit(1);
}
console.log('PASSED — tag valide : '+tag);
