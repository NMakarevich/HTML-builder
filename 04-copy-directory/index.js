const { constants } = require('buffer');
const fs = require('fs/promises');
const path = require('path');

fs.readdir(path.join(__dirname, 'files'))
  .then(files => {
    if (files.length !== 0) {
      fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
      files.forEach(file => {
        fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), constants.COPYFILE_EXCL)
      })
    }
  })
