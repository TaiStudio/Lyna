/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const animations = require('./js/animations.json');
var default_anim = "translate(-50%, 0%)",
    active_anim = "translate(-50%, 0%)";

const LYNAWEBSITE = 'https://lyna.taistudio.fr/';

//SITEMAP
const sitemap = cheerio.load(fs.readFileSync('PatternSitemap.xml'), {
    xmlMode: true,
    decodeEntities: true
});

// Fonction pour supprimer un répertoire récursivement
const deleteDirectory = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Si c'est un répertoire, récursion pour supprimer son contenu
                deleteDirectory(currentPath);
            } else {
                // Si c'est un fichier, le supprimer
                fs.unlinkSync(currentPath);
            }
        });
        // Supprimer le répertoire lui-même
        fs.rmdirSync(dirPath);
        console.log(`Le répertoire ${dirPath} a été supprimé avec succès.`);
    }
};

if(!fs.existsSync('dist')){
    fs.mkdirSync('dist');
    getFiles('pages');
}
else{
    fs.rm('dist', {recursive: true}, ()=>{
        console.log('Clean !');
        fs.mkdirSync('dist');
        getFiles('pages');
    });
}
if(fs.existsSync('pages/demo')){
    deleteDirectory(path.join(__dirname, 'pages', 'demo'));
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
    today = `${yyyy}-${mm}-${dd}`;
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        if(fs.existsSync(`./pages/${files[i]}/${files[i]}.json`)){
            creator(files[i]);

            if(i == files.length-1){
                console.log('DONE!');
            }
        }
    }
}

function creator(data){
    if(fs.existsSync(`./pages/${data}/${data}.json`)){
        //PAGES
        var config = require(`./pages/${data}/${data}.json`);
        const $ = cheerio.load(fs.readFileSync('indexgen.html'));
        console.log(data);
        
        //TITLES
        $('title').text(`Lyna | ${config.name}`);
        $('meta[name="title"]').attr('content', `Lyna | ${config.name}`);
        $('meta[name="twitter:title"]').attr('content', `Lyna | ${config.name}`);
        $('meta[property="og:title"]').attr('content', `Lyna | ${config.name}`);
        
        //IMAGES
        $('meta[name="twitter:image"]').attr('content', `${LYNAWEBSITE}${config.logo}`);
        $('meta[property="og:image"]').attr('content', `${LYNAWEBSITE}${config.logo}`);
        $('#favicon').attr('href', `${LYNAWEBSITE}${config.logo}`);
        $('head').append(`<link rel="shortcut icon" href="${LYNAWEBSITE}${config.logo}" type="image/x-icon">`);

        //DESCRIPTION
        if(config.description == null){config.description = "Create a page for provide your social links and other."}
        $('meta[name="description"]').attr('content', `${config.description}`);
        $('meta[property="og:description"]').attr('content', `${config.description}`);
        $('meta[name="twitter:description"]').attr('content', `${config.description}`);
        
        if(config.background != null){$('body').prepend(`<img class="background" src="${config.background}"/>`);}
        if(config.backgroundV != null){
            if(config.backgroundV != ""){
                $('body').prepend(`
                    <video loop autoplay class="background" src="${config.backgroundV}"></video>
                    <script>
                        setTimeout(() => {
                            $('video').trigger('play');
                        }, 5000);
                    </script>
                `);
            }
        }
        
        if(config.music != null){
            $('body').append(`
                <audio loop autoplay src="${config.music}"/>
                <script>
                    setTimeout(() => {
                        $('audio').trigger('play');
                    }, 5000);
                </script>
            `);
        }
        $('.top .logo img').attr('src', config.logo);
        $('.top .name').text(config.name);

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
        if(config.links != null){
            for(i=0;i<config.links.length;i++){
                var icon,
                    twitchButton = "",
                    display = "",
                    trustIDB = null;
                if(config.links[i].icon != null){
                    icon = config.links[i].icon;
                }
                else{
                    icon = `./img/services/${config.links[i].service}.png`;
                }
                if(config.links[i].link.includes('twitch.tv/')){
                    var twitchName = config.links[i].link.substr(0,config.links[i].link.lastIndexOf('/'));
                        twitchName = config.links[i].link.replace(`${twitchName}/`, '');
                    twitchButton = "twitchButton";
                    $('body').append(`<script>twitchGetID("${twitchName}");</script>`);
                }
                if(config.icon != null){
                    $('head').append(`<link rel="shortcut icon" href="${config.icon}" type="image/x-icon">`);
                }
                else{
                    $('head').append(`<link rel="shortcut icon" href="${config.logo}" type="image/x-icon">`);
                }
                if(config.links[i].display == false){
                    display = "hide";
                }
                if(config.links[i].trustpilot != null){
                    trustIDB = 'trust1';
                    $('body').append(`trustpilot("${config.links[i].trustpilot}", "${trustIDB}");`);
                }
                $('.bottom').append(`
                    <div class="link ${twitchButton} ${display} ${trustIDB}" data-link="${config.links[i].link}" data-target="${config.links[i].target || null}">
                        <div class="left">
                            <div class="logo">
                                <img src="${icon}" alt="${config.links[i].service}" onerror="imgError(this);" />
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
        }
        $('body').append(`
            <script>
                setTimeout(() => {
                    $('.content').addClass('active');
                    $('audio').trigger('play');
                    $('.link').addClass('active');
                }, 1000);
            </script>
        `);

        if(config.redirect != null){
            $('body').append(`
                <script>
                    window.location.replace("${config.redirect}");
                </script>
            `);
        }
        
        // if(config.animations != null){
        //     for(a=0;a<config.animations.length;a++){
        //         default_anim = `${default_anim} ${animations[config.animations[a]]["default"]}`;
        //         active_anim = `${active_anim} ${animations[config.animations[a]]["active"]}`;
        //         if(config.animations[a] == "fix"){
        //             $('body .content').addClass('fix');
        //         }
        //     }
            
        //     $('body .content').attr('style', `transform: ${default_anim}`);
            
        //     $('body').append(`
        //         <script>
        //             setTimeout(() => {
        //                 $('body .content').attr('style', 'transform: ${active_anim}');
        //             }, 1000);
        //         </script>
        //     `);
        // }
        
        fs.writeFileSync(`dist/${data.toLowerCase()}.html`, $.html());
        if(data == "home"){
            fs.writeFileSync(`index.html`, $.html());
        }

        sitemap("urlset").append(`
            <url>
                <loc>${LYNAWEBSITE}${data}</loc>
                <lastmod>${today}</lastmod>
                <changefreq>hourly</changefreq>
            </url>
        `);

        fs.writeFileSync(`./dist/sitemap.xml`, sitemap.html());
        fs.writeFileSync(`sitemap.xml`, sitemap.html());
    }
}