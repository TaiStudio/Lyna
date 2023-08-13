/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

if(typeof $ == "undefined"){
    var $ = require('jquery');
}

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
                    <p>ERROR: PAGE NOT FOUND! CREATE YOUR <a href="https://github.com/TaiStudio/Lyna">OWN</a> PAGE !</p>
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

                if(config.animations[a] == "fix"){
                    $('body .content').addClass('fix');
                }
            }
             
            $('body .content').attr('style', `transform: ${default_anim}`);
             
            setTimeout(() => {
                $('body .content').attr('style', `transform: ${active_anim}`);
            }, 1000);
        });
    }
}