/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

var page = document.URL.substr(0,document.URL.lastIndexOf('/'));
    page = document.URL.replace(`${page}/`, '');

if(page == ""){
    page = "taistudio";
}

$(function(){
    $.getJSON(`../pages/${page}/${page}.json`, function(data) {
        load(data);
    })
    .fail(function(){
        $.getJSON(`../pages/taistudio/taistudio.json`, function(data) {
            load(data);
            $('body').append(`
                <div class="error">
                    <p>ERROR: PAGE NOT FOUND! CREATE THE <a href="https://github.com/TaiStudio/Lyna">OWN</a> !</p>
                    <img src="./img/assets/close.png" class="close" />
                </div>
            `);
        })
    })
    $('.bottom').on('click', '.link', function(){
        window.open($(this).attr('data-link'), "_blank");
    })
    $('body').on('click', '.close', function(){
        $('.error').remove();
    })
    var height = $(window).height() - $('.top').height();
        height = Math.ceil(height) - 19;
    $('body .bottom').attr('style', `height:${height}px`);
});
$(window).resize(function(){
    var height = $(window).height() - $('.top').height();
        height = Math.ceil(height) - 19;
    $('body .bottom').attr('style', `height:${height}px`);
});
function load(data){
    config = data;
    if(config.power == false){
        $('.power').remove();
    }
    if(config.background != null){
        $('body').prepend(`
            <img class="background" src="${config.background}"/>
        `);
    }
    $('.top .logo img').attr('src', config.logo);
    $('.top .name').text(config.name);
    $('title').text(`Lyna | ${config.name}`);
    if(config.colors != null){
        if(config.colors.length == 4){
            $('body').append(`
                <style>
                    body{
                        --pri: ${config.colors[0]};
                        --sec: ${config.colors[1]};
                        --tri: ${config.colors[2]};
                        --qua: ${config.colors[3]};
                    }
                </style>
            `);
        }
    }
    $('body').addClass(config.name);
    if(config.theme != null){
        $('body').addClass(config.theme);
    }
    for(i=0;i<config.links.length;i++){
        var icon,
            inlive = "";
        if(config.links[i].icon != null){
            icon = config.links[i].icon;
        }
        else{
            icon = `./img/services/${config.links[i].service}.png`;
        }
        if(config.links[i].link.includes('twitch.tv/')){
            var twitchName = config.links[i].link.substr(0,config.links[i].link.lastIndexOf('/'));
            twitchName = config.links[i].link.replace(`${twitchName}/`, '');
            var twitchID = twitchGetID(twitchName);
            console.log(twitchGetStream(twitchGetID(twitchName)));
            if(twitchGetStream(twitchID) == true){
                inlive = `<div class="live"></div>`;
            }
        }
        $('.bottom').append(`
            <div class="link" data-link="${config.links[i].link}">
                <div class="left">
                    <div class="logo">
                        <img src="${icon}" alt="${config.links[i].service}">
                        ${inlive}
                    </div>
                </div>
                <div class="center">
                    <div class="name">
                        ${config.links[i].name}
                    </div>
                </div>
                <div class="arrow">
                    <img src="./img/assets/arrow-circle-right-solid.svg" alt="ARROW">
                </div>
            </div>
        `);
    }
    setTimeout(() => {
        $('.content').addClass('active');
    }, 1000);
    $('.link').addClass('active');
}
function twitchGetID(name) {
    $.ajax({
        type: "GET",
        url: `https://api.twitch.tv/kraken/users?login=${name}`,
        beforeSend: function (xhr) { xhr.setRequestHeader('Client-ID', '4mojfuyk1x22s12dv0uyzs63rasstx');xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json'); },
        success: function (result) {
            if(result["users"] != null){
                return result["users"][0]["_id"];
            }
        },
        error: function (result) {
            return false;
        }
    });
}
function twitchGetStream(id) {
    $.ajax({
        type: "GET",
        url: `https://api.twitch.tv/kraken/streams/${id}`,
        beforeSend: function (xhr) { xhr.setRequestHeader('Client-ID', '4mojfuyk1x22s12dv0uyzs63rasstx');xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json'); },
        success: function (result) {
            if(result["stream"] != null){
                return true;
            }
            return false;
        },
        error: function (result) {
            return false;
        }
    });
}