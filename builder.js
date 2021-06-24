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

if(!fs.existsSync('dist')){
    fs.mkdirSync('dist');
}
else{
    fs.rmdirSync('dist', { recursive: true });
    fs.mkdirSync('dist');
}

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var config = require(`./pages/${files[i]}/${files[i]}.json`);
        const $ = cheerio.load(fs.readFileSync('index.html'));
        
        $('title').text(`Lyna | ${config.name}`);
        $('meta[name="title"]').attr('content', `Lyna | ${config.name}`);
        $('meta[name="twitter:title"]').attr('content', `Lyna | ${config.name}`);
        $('meta[property="og:title"]').attr('content', `Lyna | ${config.name}`);
        
        $('meta[name="twitter:image"]').attr('content', `https://lyna.ga/${config.logo}`);
        $('meta[property="og:image"]').attr('content', `https://lyna.ga/${config.logo}`);
        
        fs.writeFileSync(`dist/${files[i]}.html`, $.html());
    }
    return files_;
}
getFiles('pages');