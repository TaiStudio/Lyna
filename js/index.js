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
    $.getJSON(`../config/${page}/${page}.json`, function(data) {
        config = data;
        $('.top .logo img').attr('src', config.logo);
        $('.top .name').text(config.name);
        $('title').text(`Lyna | ${config.name}`);
        for(i=0;i<config.links.length;i++){
            $('.bottom').append(`
                <div class="link" data-link="${config.links[i].link}">
                    <div class="logo">
                        <img src="./img/services/${config.links[i].service}.png" alt="${config.links[i].service}">
                    </div>
                    <div class="name">
                        ${config.links[i].name}
                    </div>
                    <div class="arrow">
                        <img src="./img/assets/arrow-circle-right-solid.svg" alt="ARROW">
                    </div>
                </div>
            `);
            setTimeout(() => {
                $('.link').addClass('active');
            }, 1000);
        }
        $('.content').addClass('active');
        $('.link').addClass('active');
    });
    $('.bottom').on('click', '.link', function(){
        window.open($(this).attr('data-link'), "_blank");
    })
});