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

    filter();

    savePage(prod.name.toLowerCase());
}
init();

function filter(){
    for(f=0;f<config.length;f++){
        if(config[f].startsWith('###') == true){
            setName(config[f]);
            createDir(prod.name.toLowerCase());
        }
        if(config[f].startsWith('## ') == true){
            setDescription(config[f]);
        }
        if(config[f].startsWith('>') == true){
            colors(config[f]);
        }
        if(config[f].startsWith('[') == true){
            links(config[f]);
        }

        // switch(config[f].slice(0, 4)){
        //     case '### ':
        //         setName(config[f]);
        //         createDir(prod.name.toLowerCase());
        //         break;
        //     case '##':
        //         setDescription(config[f]);
        //         break;
        //     case '>':
        //         colors(config[f]);
        //         break;
        //     case '[':
        //         links(config[f]);
        //         break;
        //     default:
        //         console.log(config[f]);
        // }
    }
}

function colors(arg){
    if(arg.startsWith('>') == true){
        let temp = arg.split(',');
        temp[0] = temp[0].replace('> ', '');
        for(l2=0;l2<temp.length;l2++){
            temp[l2] = replaceAll(temp[l2], ' ', '');
        }
        setProd('colors', temp);
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
function links(arg){
    if(arg.startsWith('[') == true){
        let temp = arg.split(']');

        var name = temp[0].replace('\[', ''),
            link = replaceAll(replaceAll(temp[1], '(', ''), ')', ''),
            service = getService(link);

        addLink(name, link, service);
    }
}
function addLink(name, link, service){
    var temp = {
        "name": name,
        "service": service,
        "link": link,
        "icon": ""
    };

    setProd('links', temp);
}

function setProd(key, value){
    switch(key){
        case 'name':
            prod[key] = value.charAt(0).toUpperCase() + value.slice(1);
            break;
        case 'links':
            prod[key].push(value);
            break;
        default:
            prod[key] = value;
    }
    console.log(prod);
}

function setName(arg){
    if(arg.startsWith('###')){
        setProd('name', replaceAll(arg, '### ', ''));
    }
}

function setDescription(arg){
    if(arg.startsWith('##')){
        setProd('description', replaceAll(arg, '## ', ''));
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