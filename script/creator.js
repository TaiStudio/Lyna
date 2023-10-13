/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

const fs = require('fs');
const axios = require('axios');
const listService = require('../lib/services.json');

const download = (uri, filename, callback) => {
    axios.head(uri)
        .then(response => {
            console.log('content-type:', response.headers['content-type']);
            console.log('content-length:', response.headers['content-length']);

            axios({
                method: 'get',
                url: uri,
                responseType: 'stream', // This ensures the response is treated as a stream
            })
                .then(response => {
                    response.data.pipe(fs.createWriteStream(filename)).on('close', callback);
                })
                .catch(error => {
                    console.error('Error downloading the file:', error);
                    callback(error);
                });
        })
        .catch(error => {
            console.error('Error getting headers:', error);
            callback(error);
        });
};

var config = process.argv[2].replace('--body=', '');
config = config.split('\\r\\n');
var mode = process.argv[3].replace('--mode=', '');

var prod = {
    "name": "",
    "description": "",
    "background": "",
    "backgroundV": "",
    "music": "",
    "logo": "",
    "font": "ancient",
    "animations": [],
    "links": [],
    "colors": [],
    "theme": "",
    "power": true
};
//colors max 4

console.log(config);

function init() {
    console.log(mode);
    if (mode == "edit") {
        if (config[0].startsWith('###') == true) {
            let name = replaceAll(config[0], '### ', '');
            name = name.toLowerCase();
            prod = JSON.parse(fs.readFileSync(`pages/${name}/${name}.json`).toString());
        }
    }

    filter();

    savePage(prod.name.toLowerCase());
}
init();

function filter() {
    for (f = 0; f < config.length; f++) {
        if (config[f].startsWith('###') == true) {
            setName(config[f]);
            createDir(prod.name.toLowerCase());
        }
        if (config[f].startsWith('## ') == true) {
            setDescription(config[f]);
        }
        if (config[f].startsWith('>') == true) {
            colors(config[f]);
        }
        if (config[f].startsWith('[') == true) {
            links(config[f]);
        }
        if (config[f].startsWith('Logo:') == true) {
            logo(config[f]);
        }
        if (config[f].startsWith('Background:') == true) {
            background(config[f]);
        }
    }
}

function logo(arg) {
    if (arg.startsWith('Logo:') == true) {
        let temp = arg.split(']');

        var link = replaceAll(replaceAll(temp[1], '(', ''), ')', '');

        download(link, `pages/${prod.name.toLowerCase()}/logo.png`, function () {
            console.log('done');
        });
        setProd('logo', `pages/${prod.name.toLowerCase()}/logo.png`);
    }
}
function background(arg) {
    if (arg.startsWith('Background:') == true) {
        let temp = arg.split(']');

        var link = replaceAll(replaceAll(temp[1], '(', ''), ')', '');

        var url = link.substring(link.lastIndexOf('/') + 1);

        download(link, `pages/${prod.name.toLowerCase()}/${url}`, function () {
            console.log('done');
        });
        setProd('background', `pages/${prod.name.toLowerCase()}/${url}`);
    }
}
function colors(arg) {
    if (arg.startsWith('>') == true) {
        let temp = arg.split(',');
        temp[0] = temp[0].replace('> ', '');
        for (l2 = 0; l2 < temp.length; l2++) {
            temp[l2] = replaceAll(temp[l2], ' ', '');
        }
        setProd('colors', temp);
    }
}
function getService(link) {
    var url = new URL(link);
    var srv = url.host.split('.')[0];

    if (listService.all.includes(`${srv}.png`) == true) {
        srv = srv;
    }
    else {
        srv = 'Internet';
    }
    return srv;
}
function links(arg) {
    if (arg.startsWith('[') == true) {
        let temp = arg.split(']');

        var name = temp[0].replace('\[', ''),
            link = replaceAll(replaceAll(temp[1], '(', ''), ')', ''),
            service = getService(link);

        addLink(name, link, service);
    }
}
function addLink(name, link, service) {
    var temp = {
        "name": name,
        "service": service,
        "link": link,
        "icon": ""
    };

    setProd('links', temp);
}

function setProd(key, value) {
    switch (key) {
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

function setName(arg) {
    if (arg.startsWith('###')) {
        setProd('name', replaceAll(arg, '### ', ''));
    }
}

function setDescription(arg) {
    if (arg.startsWith('##')) {
        setProd('description', replaceAll(arg, '## ', ''));
    }
}

function createDir(dir) {
    if (fs.existsSync(`pages/${dir}`) == false) {
        fs.mkdirSync(`pages/${dir}`);
    }
    else {
        console.log('ERROR PAGE ALREADY EXIST !');
    }
}

function savePage(dir) {
    if (fs.existsSync(`pages/${dir}`) == true) {
        fs.writeFileSync(`pages/${dir}/${dir}.json`, JSON.stringify(prod, null, 2));
    }
    else {
        console.log('ERROR SAVE PAGE !');
    }
}

function replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
