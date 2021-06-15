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

    $('body').append(`
        <meta name="title" content="Lyna | ${config.name}">
        <meta name="description" content="Create a page for provide your social links and other.">
        <meta name="keywords" content="open-source, links, lien, liens, provider, promote, share, free, social, taistudio, lyna">
        <meta name="robots" content="index, follow">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="language" content="French">
        <meta name="author" content="Tai Studio">

        <meta property="og:title" content="Lyna | ${config.name}"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://lyna.ga/"/>
        <meta property="og:image" content="https://lyna.ga/${config.logo}"/>
        <meta property="og:description" content="Create a page for provide your social links and other."/>

        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="https://lyna.ga/">
        <meta name="twitter:title" content="Lyna | ${config.name}">
        <meta name="twitter:description" content="Create a page for provide your social links and other.">
        <meta name="twitter:creator" content="Tai Studio">

        <meta name="twitter:image" content="https://lyna.ga/${config.logo}">

        <title>Lyna | Home</title>
    `);

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
        var icon;
        if(config.links[i].icon != null){
            icon = config.links[i].icon;
        }
        else{
            icon = `./img/services/${config.links[i].service}.png`;
        }
        $('.bottom').append(`
            <div class="link" data-link="${config.links[i].link}">
                <div class="left">
                    <div class="logo">
                        <img src="${icon}" alt="${config.links[i].service}">
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