/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

var configPage = fs.readFileSync(path.join(__dirname, '..', 'pages', 'home', 'home.json')),
    preview = null;

if(!fs.existsSync(path.join(__dirname, '..', 'pages', 'demo'))){
    fs.mkdirSync(path.join(__dirname, '..', 'pages', 'demo'));
}
if(!fs.existsSync(path.join(__dirname, '..', 'pages', 'demo', 'demo.json'))){
    fs.writeFileSync(path.join(__dirname, '..', 'pages', 'demo', 'demo.json'), configPage);
}

app.allowRendererProcessReuse = true;
app.whenReady().then(() => {
    preview = createWindow('index.html', true, 1100, 619);
    var config = createWindow('app/gui.html', false, 800, 600);

    config.webContents.executeJavaScript(`data = ${configPage};`);

    reloadPrev();

    config.focus();

    ipcMain.on('change', (event, arg) => {
        fs.writeFileSync(path.join(__dirname, '..', 'pages', 'demo', 'demo.json'), arg);
        reloadPrev();
    });
    ipcMain.on('save', (event, arg) => {
        let data = JSON.parse(arg);

        if(fs.existsSync(path.join(__dirname, '..', 'pages', 'demo', 'demo.json'))){
            fs.writeFileSync(path.join(__dirname, '..', 'pages', 'demo', 'demo.json'), arg);
        }
        else{
            fs.writeFileSync(path.join(__dirname, '..', 'pages', data.name, data.name + '.json'), arg);
        }

        fs.rename(path.join(__dirname, '..', 'pages', 'demo'), path.join(__dirname, '..', 'pages', data.name), () => {
            fs.rename(path.join(__dirname, '..', 'pages', data.name, 'demo.json'), path.join(__dirname, '..', 'pages', data.name, data.name + '.json'), () => {
                console.log('DONE!');
            });
        });
    });
});

function reloadPrev(){
    preview.reload();
    preview.webContents.executeJavaScript(`$('body').append('<script src="app/preview.js"></script>');`);
}

function createWindow (url, resize, w, h) {
    var win = new BrowserWindow({
        width: w,
        height: h,
        autoHideMenuBar: true,
        resizable: resize,
        icon: path.join(__dirname, '..', 'pages', 'home', 'lyna.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
  
    win.loadFile(url);

    return win;
}