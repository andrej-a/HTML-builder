const fs = require('fs');
const path = require('path');
const {
    stdout
} = process;

function copyDir() {
async function deleteFilesFromDirectory(p) {
    await fs.promises.readdir(p, {withFileTypes: true})
    .then(async (files) => {
        for await (let file of files) {
                if (file.isDirectory()) {
                    await fs.promises.rmdir(path.resolve(p, file.name), {recursive: true, force: true}, (err) => {
                        if (err) throw err;
                    })        
                } else {
                    await fs.promises.unlink(path.resolve(p, file.name), (err) => {
                        if (err) throw err;
                    });
                }
        }
    })
.then( async () => {
       await createDirectory(path.resolve(__dirname, 'project-dist', 'assets'), path.resolve(__dirname, 'assets'))
    })
}

async function createDirectory(current_path, primary_path) {
    await fs.mkdir(current_path, {recursive: true}, (err) => {
        if (err) {
            console.log(err);
        }

        fs.promises.readdir(primary_path, {
                withFileTypes: true
            })
            .then(async files => {
                for await (let file of files) {
                    if (file.isDirectory()) {
                           await createDirectory(path.resolve(current_path, file.name), path.resolve(primary_path, file.name));
                    } else {
                      await fs.copyFile(path.resolve(primary_path, file.name), path.resolve(current_path, file.name), err => {
                            if (err) {
                                console.log(err);
                            }
                        });                        
                    }
                }
            })
            .then(createBundle())
    })
}

fs.stat(path.join(__dirname, 'project-dist'), (err) => {
    if (!err) {
        deleteFilesFromDirectory(path.resolve(__dirname, 'project-dist', 'assets'));
    } else {
        createDirectory(path.resolve(__dirname, 'project-dist', 'assets'), path.resolve(__dirname, 'assets'))
    }
})
}

async function createBundle() {
    let writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
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
                }
            }
        })
}

async function readHTMLFile() {
    let outputHTML = '';
    await fs.promises.readdir(path.join(__dirname), {
        withFileTypes: true
    })
    .then(async files => {
        for await (let file of files) {
            if (file.isFile() && file.name.trim() === 'template.html') {
                const readStream = await fs.createReadStream(path.join(__dirname, file.name), 'utf-8');
                readStream.on('data', async chunk => {
                    outputHTML += chunk;
                });
                readStream.on('end', () => {
                    outputHTML.match(/{{(.*?)}}/g).forEach(item => {
                        fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true})
                        .then(async components => {
                            for (let component of components) {
                                if (component.isFile() && path.extname(component.name) === '.html' && item.slice(2, -2) === component.name.slice(0, -5)) {
                                    let component_data = '';
                                    const readStream = await fs.createReadStream(path.join(__dirname, 'components', component.name), 'utf-8');
                                    readStream.on('data', async chunk => {
                                        component_data += await chunk;
                                    })
                                    readStream.on('end', async () => {
                                        outputHTML = await outputHTML.replace(item, component_data);
                                        let writeStream = await fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                                        writeStream.write(outputHTML)
                                    })
                                }
                            }
                        })
                    })
                })
            }
        }
    })
}
readHTMLFile()
copyDir()
