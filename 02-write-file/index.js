const {
    stdin: input,
    stdout: output
} = process;

const readline = require('readline');
const path = require('path');
const fs = require('fs');

const rl = readline.createInterface({
    input,
    output
});
let outputStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

output.write('Input first line: ')

rl.on('line', (value) => {
    
    if (value === 'exit') {
        rl.close();
    } else {
        output.write('Input next line: ')
        let string = value.toString();
        outputStream.write(`${string}\n`);
    }
});

process.on('exit', function() {
    output.write('\n Programm is closed! \n');
});
