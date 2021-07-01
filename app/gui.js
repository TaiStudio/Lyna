/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const { ipcRenderer } = require("electron");

if(typeof $ == "undefined"){
    var $ = require('jquery');
}

var data = null;
$('input').on('change', () => {
    data.name = $('#namePage').val();
    data.description = $('#descriptionPage').val();
    // data.logo = $('#logoPage').val();
    // data.background = $('#backgroundPage').val();
    // data.font = $('#fontPage').val();
    // data.power = $('#powerPage').val();
    // data.icon = $('#iconPage').val();

    // data.links = $('#iconPage').val();

    ipcRenderer.send('change', JSON.stringify(data));
});
$('.save').on('click', () => {
    ipcRenderer.sendSync('save', JSON.stringify(data));
})