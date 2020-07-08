const walkSync = require('walk-sync');

const fs = require('fs');
const path = require('path');

const transform = require('./transform');

function writeComments(inputDir, opts) {
  const { pods, json } = opts;
  const startTime = process.hrtime();

  const paths = walkSync(inputDir, { globs: ['**/*.js'], directories: false });
  console.log(`Processing ${paths.length} files...`);

  paths.forEach((f) => {
    const docJson = { props: {} };
    let componentName = '';
    if (pods) {
      componentName = path.dirname(f).toUpperCase();
    } else {
      const capitalize = (n) =>
        n
          .split('-')
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join('');
      componentName = capitalize(path.basename(f, '.js'));
    }
    docJson.name = componentName;
    docJson.description = 'A description about the component';

    const outFile = `${inputDir}/${f}`;
    const code = fs.readFileSync(`${inputDir}/${f}`, 'utf-8');

    const output = transform(code, componentName, docJson);
    fs.writeFile(outFile, output, (err) => {
      if (err) throw err;
    });

    if (json) {
      const jsonFile = `${inputDir}/${path.basename(f, '.js')}.json`;
      fs.writeFile(jsonFile, JSON.stringify(docJson), (err) => {
        if (err) throw err;
      });
    }
  });

  console.log('All done.');
  const endTime = process.hrtime(startTime);
  const timeElapsed = (endTime[0] + endTime[1] / 1e9).toFixed(3);
  console.log(`Time elapsed: ${timeElapsed} seconds`);
}

module.exports = writeComments;
