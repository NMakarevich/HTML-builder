const fsp = require('fs/promises');
const fs = require('fs')
const path = require('path');

const source = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist', 'bundle.css');
let writeStream = fs.createWriteStream(dist);

fsp.readdir(source, {withFileTypes: true})
  .then(array => array.filter(item => item.isFile() && path.extname(path.join(source, item.name)) === '.css'))
  .then(files => files.forEach(file => {
    let readStream = fs.createReadStream(path.join(source, file.name), 'utf-8');
    readStream.pipe(writeStream)
  }))