/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/


const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const rimraf = require('rimraf');

const readme = cheerio.load(fs.readFileSync('README.md'));
readme('.services img').remove();
var list = [],
    file = {};
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            list.push(files[i]);
            readme('.services').append(`<img src="img/services/${files[i]}" width="5%" style="margin: 1%;" title="${files[i].replace('.png', '')}"></img>`);
        }
    }
    return files_;
}
getFiles('img/services');

file.all = list;
fs.writeFileSync(`lib/services.json`, `${JSON.stringify(file)}`);
fs.writeFileSync(`README.md`, readme.html());
rimraf(path.join(__dirname, 'pages', 'demo'), (err) => {
    if(err)console.log(err);
});

console.log('DONE !');
