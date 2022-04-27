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
const listService = require('../lib/services.json');

var config = process.argv[2].replace('--body=', '');
config = config.split('\\r\\n');

var prod = {
    "name": "",
    "description": "",
    "background": "pages/orchidee/orchideeBG.png",
    "backgroundV": "",
    "music": "",
    "logo": "pages/orchidee/orchidee.png",
    "font": "ancient",
    "animations": [],
    "links": [],
    "colors": [],
    "theme": "",
    "power": true
};
//colors max 4

console.log(config);

function init(){
    setName();
    createDir(prod.name.toLowerCase());

    links();

    colors();

    savePage(prod.name.toLowerCase());
}
init();

function colors(){
    for(l=0;l<config.length;l++){
        if(config[l].startsWith('>') == true){
            let temp = config[l].split(',');

            temp[0] = temp[0].replace('> ', '');

            for(l2=0;l2<temp.length;l2++){
                temp[l2] = replaceAll(temp[l2], ' ', '');
            }
            setProd('colors', temp);
        }
    }
}
function getService(link){
    var url = new URL(link);
    var srv = url.host.split('.')[0];

    if(listService.all.includes(`${srv}.png`) == true){
        srv = srv;
    }
    else{
        srv = 'Internet';
    }
    return srv;
}
function links(){
    for(l=0;l<config.length;l++){
        if(config[l].startsWith('[') == true){
            let temp = config[l].split(']');

            var name = temp[0].replace('[', ''),
                link = replaceAll(replaceAll(temp[1], '(', ''), ')', ''),
                service = getService(link);

            addLink(name, link, service);
        }
    }
}
function addLink(name, link, service){
    var temp = {
        "name": name,
        "service": service,
        "link": link,
        "icon": "pages/hope88000/hope88000.png"
    };

    setProd('links', temp);
}

function setProd(key, value){
    console.log(prod);
    switch(key){
        case 'links':
            prod[key].push(value);
            break;
        default:
            prod[key] = value;
    }
    console.log(prod);
}

function setName(){
    if(config[0].startsWith('###')){
        setProd('name', replaceAll(config[0], '### ', ''));
    }
}

function createDir(dir){
    if(fs.existsSync(`pages/${dir}`) == false){
        fs.mkdirSync(`pages/${dir}`);
    }
    else{
        console.log('ERROR PAGE ALREADY EXIST !');
    }
}

function savePage(dir){
    if(fs.existsSync(`pages/${dir}`) == true){
        fs.writeFileSync(`pages/${dir}/${dir}.json`, JSON.stringify(prod));
    }
    else{
        console.log('ERROR SAVE PAGE !');
    }
}

function replaceAll(str, find, replace) {
	var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	return str.replace(new RegExp(escapedFind, 'g'), replace);
}