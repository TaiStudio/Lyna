/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/


const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const rimraf = require('rimraf');

const readme = cheerio.load(fs.readFileSync('README.md'));
readme('.services li').remove();
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
            readme('.services').append(`<img src="img/services/${files[i]}" width="5%" title="${files[i].replace('.png', '')}"></img>`);
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

// First Header | Second Header
// ------------ | -------------
// First Header | Second Header

console.log('DONE !');
