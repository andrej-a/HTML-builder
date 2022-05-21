const fs = require('fs');
const path = require('path');
let writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

 (async function createBundle() {
    await fs.promises.readdir(path.join(__dirname, 'styles'), {
            withFileTypes: true
        })
        .then(async files => {
            for await (let file of files) {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
                    readStream.on('data', chunk => {
                        writeStream.write(`${chunk}\n`);
                    });
                    readStream.on('end', () => {
                        console.log(`File ${file.name} added to bundle!`);
                    })
                }
            }
        })
})()