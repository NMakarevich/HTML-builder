const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const writing = fs.createWriteStream(path.join(__dirname, 'text.txt'))

const rl = readline.createInterface({ input, output });

output.write('Enter your message \n');
rl.on('line', (input) => {
  if (input == 'exit') rl.close();
  else {
    writing.write(`${input}\n`);
    output.write('Enter your next message \n');
  }
})
rl.on('close', () => output.write('See you soon'))