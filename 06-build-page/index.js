const fs = require('fs')
const fsP = require('fs/promises');
const path = require('path');

const projectFolder = 'project-dist'

function copyAssets(source, dist) {
  fsP.readdir(source, {withFileTypes: true})
    .then(list => {
      fsP.mkdir(dist, {recursive: true});
      list.forEach(item => {
        if (item.isDirectory()) {
          copyAssets(path.join(source, item.name), path.join(dist, item.name));
        }
        else {
          fsP.copyFile(path.join(source, item.name), path.join(dist, item.name));
        }
      })
      fsP.readdir(dist, {withFileTypes: true})
        .then(copiedList => copiedList.forEach(copiedFile => {
            if (!list.map(item => item.name).includes(copiedFile.name)) {    
              fs.rm(path.join(dist, copiedFile.name));
            }
          })
        )
    })
}

function mergeStyles(source, dist) {
  let writeStream = fs.createWriteStream(dist);

  fsP.readdir(source, {withFileTypes: true})
    .then(array => array.filter(item => item.isFile() && path.extname(path.join(source, item.name)) === '.css'))
    .then(files => files.forEach(file => {
      let readStream = fs.createReadStream(path.join(source, file.name), 'utf-8');
      readStream.pipe(writeStream)
    }))
}

function injectComponents() {
  const writeStream = fs.createWriteStream(path.join(__dirname, projectFolder, 'index.html'));
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  
  readStream.on('data', (data) => {
    let result = data;

    fsP.readdir(path.join(__dirname, 'components'), {withFileTypes: true})
      .then(files => files.filter(file => path.extname(path.join(__dirname, 'components', file.name)) == '.html'))
      .then(files => files.forEach((file, index) => {
        const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
        const readComponentStream = fs.createReadStream(path.join(__dirname, 'components', file.name), 'utf-8');
        readComponentStream.on('data', (html) => {
          result = result.toString().replace(`{{${fileName}}}`, html);
          if(index === files.length - 1) {
            writeStream.write(result)
          }
        })
      }))
  })
}

fsP.mkdir(path.join(__dirname, projectFolder), {recursive: true});
copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, projectFolder, 'assets'));
mergeStyles(path.join(__dirname, 'styles'), path.join(__dirname, projectFolder, 'style.css'));
injectComponents();