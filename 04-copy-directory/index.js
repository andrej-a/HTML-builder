const fs = require('fs');
const path = require('path');
const {
    stdout
} = process;

(function copyDir() {
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
        .then( () => {
             createDirectory(path.resolve(__dirname, 'files-copy'), path.resolve(__dirname, 'files'))
        })
    }
    
    function createDirectory(current_path, primary_path) {
        fs.mkdir(current_path, {recursive: true}, (err) => {
            if (err) {
                console.log(err);
            }
            stdout.write(`Directory ${current_path} was created! \n`)
    
            fs.promises.readdir(primary_path, {
                    withFileTypes: true
                })
                .then(files => {
                    for  (let file of files) {
                        if (file.isDirectory()) {
                             createDirectory(path.resolve(current_path, file.name), path.resolve(primary_path, file.name));
                        } else {
                            fs.copyFile(path.resolve(primary_path, file.name), path.resolve(current_path, file.name), err => {
                                if (err) {
                                    console.log(err);
                                }
                            });                        
                        }
                    }
                })
        })
    
    }
        fs.stat(path.join(__dirname, 'files-copy'), (err) => {
            if (!err) {
                deleteFilesFromDirectory(path.resolve(__dirname, 'files-copy'));
            } else {
                createDirectory(path.resolve(__dirname, 'files-copy'), path.resolve(__dirname, 'files'))
            }
        })
})()
