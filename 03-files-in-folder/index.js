const { Stats } = require('fs');
const fs = require('fs/promises');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then(files => files.filter(file => file.isFile()))
  .then(files => files.forEach(file => {
    const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
    const fileExt = path.extname(file.name.toString()).slice(1)
    fs.stat(path.join(__dirname, 'secret-folder', file.name))
      .then(Stats => console.log(`${fileName} - ${fileExt} - ${(Stats.size)}bytes`) )
  }))
