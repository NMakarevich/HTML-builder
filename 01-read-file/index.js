const fs = require('fs');
const path = require('path')

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'});
stream.on('data', partData => console.log(partData.slice(0, partData.lastIndexOf('\n'))));
