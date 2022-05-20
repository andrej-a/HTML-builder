const fs = require('fs')
const {stdout} = process;
const path = require('path');
(async () => {
    await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {
            withFileTypes: true
        })
        .then(async files => {
            for await (let file of files) {
                if (file.isFile()) {
                    await fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
                        if (err) {
                            stdout.write(err)
                        }
                        stdout.write(`${path.parse(file.name).name}-${path.parse(file.name).ext.slice(1)}-${Math.floor(stats.size)}b\n`);
                    })
                }
            }
        })

})()