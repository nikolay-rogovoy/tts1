const fs = require('fs');
const mkdirp = require('mkdirp');

(function main() {
    // Копируем необходимые файлы
    // fs.createReadStream('ecosystem.config.js').pipe(fs.createWriteStream('dist/ecosystem.config.js'));
    // package.json
    let tempFile = fs.createReadStream('package.json').pipe(fs.createWriteStream('dist/package.json'));
    tempFile.on('close', () => {
        // Удалить лишнее из package.json
        const packageJson = JSON.parse(fs.readFileSync('./dist/package.json').toString());
        delete packageJson.devDependencies;
        delete packageJson.scripts;
        fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
    });


    // Создаем логи
    mkdirp('dist/logs', function (err) {
        if (err) {
            console.log(err);
        }
        // Создаем необходимые файлы
        for (let fileName of ['debug', 'error', 'info', 'warn']) {
            fs.writeFile(`dist/logs/${fileName}.log`, "", function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(`dist/logs/${fileName}.log - OK`);
                }
            });
        }
    });
})();
