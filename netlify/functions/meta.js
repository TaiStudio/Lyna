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
    page = "home";
}

$(function(){
    $.getJSON(`../../pages/${page}/${page}.json`, function(data) {
        load(data);
    })
    .fail(function(){
        $.getJSON(`../../pages/home/home.json`, function(data) {
            load(data);
        })
    });
});
function load(data){
    //SEO
    $('title').text(`Lyna | ${data.name}`);
    $('meta[name="title"]').attr('content', `Lyna | ${data.name}`);
    $('meta[name="twitter:title"]').attr('content', `Lyna | ${data.name}`);
    $('meta[property="og:title"]').attr('content', `Lyna | ${data.name}`);
}