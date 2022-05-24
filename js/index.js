/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

if(window.location.origin != 'https://lyna.netlify.app'){
    $('body').append('<div class="alerte">CHANGEMENT DE DOMAINE LYNA.GA -> lyna.netlify.app</div>');
}

var page = document.URL.substr(0,document.URL.lastIndexOf('/'));
    page = document.URL.replace(`${page}/`, '');

var config = null;

if(typeof $ == "undefined"){
    var $ = require('jquery');
}

if(page == ""){
    page = "home";
}
if(page == "index.html"){
    page = "home";
}
$(document).ready(()=>{
    $('video').trigger('play');
})
$(document).on('ready', ()=>{
    $('video').trigger('play');
})
$(function(){
    $.getJSON(`../pages/${page}/${page}.json`, function(data) {
        load(data);
    })
    .fail(function(){
        $.getJSON(`../pages/home/home.json`, function(data) {
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
        console.log($(this).attr('data-target'));
        console.log(typeof $(this).attr('data-target'));
        if($(this).attr('data-target') == "null"){
            window.open($(this).attr('data-link'), "_blank");
        }
        else{
            window.open($(this).attr('data-link'), '_self');
        }
    })
    $('body').on('click', '.close', function(){
        $('.error').remove();
    })
    $("video").on("loadstart", function() {
        $('video').trigger('play');
    });
    $("audio").on("loadstart", function() {
        $('audio').trigger('play');
    });
    $('video').trigger('play');
    var height = $(window).height() - $('.top').height();
        height = Math.ceil(height) - 19;
    // $('body .bottom').attr('style', `height:${height}px`);
});
function imgError(image) {
    image.onerror = "";
    image.src = "./img/services/internet.png";
    return true;
}
// $(window).resize(function(){
//     var height = $(window).height() - $('.top').height();
//         height = Math.ceil(height) - 19;
//     $('body .bottom').attr('style', `height:${height}px`);
// });
function load(data){
    config = data;
    if(data.power == false){
        $('.power').remove();
    }
    if(data.background != null){
        if(data.background != ""){
            $('body').prepend(`
                <img class="background" src="${data.background}"/>
            `);
        }
    }
    if(data.backgroundV != null){
        if(data.backgroundV != ""){
            $('body').prepend(`
                <video loop autoplay class="background" src="${data.backgroundV}"></video>
            `);
            setTimeout(() => {
                $('video').trigger('play');
            }, 5000);
        }
    }
    if(data.music != null){
        $('body').append(`<audio loop autoplay src="${data.music}"/>`);
        setTimeout(() => {
            $('audio').trigger('play');
        }, 5000);
    }
    $('.top .logo img').attr('src', data.logo);
    $('.top .name').text(data.name);

    if(data.colors != null){
        if(data.colors.length == 4){
            $('body').append(`
                <style>
                    body{
                        --pri: ${data.colors[0]};
                        --sec: ${data.colors[1]};
                        --tri: ${data.colors[2]};
                        --qua: ${data.colors[3]};
                    }
                </style>
            `);
        }
    }
    $('body').addClass(data.name);
    if(data.theme != null){
        $('body').addClass(data.theme);
    }
    for(i=0;i<data.links.length;i++){
        var icon,
            twitchButton = "",
            display = "",
            trustIDB = null;
        if(data.links[i].icon != null){
            icon = data.links[i].icon;
        }
        else{
            icon = `./img/services/${data.links[i].service}.png`;
        }
        if(data.links[i].link.includes('twitch.tv/')){
            var twitchName = data.links[i].link.substr(0,data.links[i].link.lastIndexOf('/'));
            twitchName = data.links[i].link.replace(`${twitchName}/`, '');
            twitchButton = "twitchButton";
            twitchGetID(twitchName);
        }
        if(data.icon != null){
            $('head').append(`<link rel="shortcut icon" href="${data.icon}" type="image/x-icon">`);
        }
        else{
            $('head').append(`<link rel="shortcut icon" href="${data.logo}" type="image/x-icon">`);
        }
        if(data.links[i].display == false){
            display = "hide";
        }
        if(data.links[i].trustpilot != null){
            trustIDB = 'trust1';
            trustpilot(data.links[i].trustpilot, trustIDB);
        }
        $('.bottom').append(`
            <div class="link ${twitchButton} ${display} ${trustIDB}" data-link="${data.links[i].link}" data-target="${data.links[i].target || null}">
                <div class="left">
                    <div class="logo">
                        <img src="${icon}" alt="${data.links[i].service}" onerror="imgError(this);" />
                    </div>
                </div>
                <div class="center">
                    <div class="name">
                        ${data.links[i].name}
                    </div>
                </div>
                <div class="arrow">
                    <img src="./img/assets/arrow-circle-right-solid.svg" alt="ARROW">
                </div>
            </div>
        `);
    }
    animator();
    setTimeout(() => {
        $('.content').addClass('active');
        $('audio').trigger('play');
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
                twitchGetStream(result["users"][0]["_id"]);
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
                $('.link.twitchButton .left .logo').append(`<div class="live"></div>`);
            }
            return false;
        },
        error: function (result) {
            return false;
        }
    });
}
function trustpilot(name, trustIDB) {
    $.getJSON(`https://trustscrap.herokuapp.com/${name}`, function(data){ 
        $(`.${trustIDB} .left`).append(`<img class="trustpilot" src="${data[0]['stars']}"></img>`);
    });
}
var all_anim,
    default_anim = "translate(-50%, 0%)",
    active_anim = "translate(-50%, 0%)";
function animator(){
    if(config.animations != null){
        $.getJSON(`./js/animations.json`, function(data) {
            all_anim = data;
             
            for(a=0;a<config.animations.length;a++){
                default_anim = `${default_anim} ${all_anim[config.animations[a]]["default"]}`;
                active_anim = `${active_anim} ${all_anim[config.animations[a]]["active"]}`;
            }
             
            $('body .content').attr('style', `transform: ${default_anim}`);
             
            setTimeout(() => {
                $('body .content').attr('style', `transform: ${active_anim}`);
            }, 1000);
        });
    }
}