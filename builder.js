/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const fs = require('fs');
const cheerio = require('cheerio');
const rimraf = require('rimraf');

if(!fs.existsSync('dist')){
    fs.mkdirSync('dist');
}
else{
    fs.rmdirSync('dist', { recursive: true });
    fs.mkdirSync('dist');
}
if(fs.existsSync('pages/demo')){
    rimraf('pages/demo', (err) => {
        if(err)console.log(err);
    });
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = `${yyyy}-${mm}-${dd}`;
//SITEMAP
const sitemap = cheerio.load(fs.readFileSync('PatternSitemap.xml'), {
    xmlMode: true
});
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        //PAGES
        var config = require(`./pages/${files[i]}/${files[i]}.json`);
        const $ = cheerio.load(fs.readFileSync('index.html'));
        
        //TITLES
        $('title').text(`Lyna | ${config.name}`);
        $('meta[name="title"]').attr('content', `Lyna | ${config.name}`);
        $('meta[name="twitter:title"]').attr('content', `Lyna | ${config.name}`);
        $('meta[property="og:title"]').attr('content', `Lyna | ${config.name}`);
        
        //IMAGES
        $('meta[name="twitter:image"]').attr('content', `https://lyna.ga/${config.logo}`);
        $('meta[property="og:image"]').attr('content', `https://lyna.ga/${config.logo}`);

        //DESCRIPTION
        if(config.description == null){config.description = "Create a page for provide your social links and other."}
        $('meta[name="description"]').attr('content', `${config.description}`);
        $('meta[property="og:description"]').attr('content', `${config.description}`);
        $('meta[name="twitter:description"]').attr('content', `${config.description}`);

        // MUSIC
        if(config.music != null){
            $('body').append(`<audio loop autoplay src="../${config.music}"/>`)
        }
        
        fs.writeFileSync(`dist/${files[i]}.html`, $.html());

        sitemap("urlset").append(`
            <url>
                <loc>https://lyna.ga/${files[i]}</loc>
                <lastmod>${today}</lastmod>
                <changefreq>hourly</changefreq>
            </url>
        `);

        fs.writeFileSync(`./dist/sitemap.xml`, sitemap.html());
        fs.writeFileSync(`sitemap.xml`, sitemap.html());
        fs.writeFileSync(`sitemap2021.xml`, sitemap.html());
    }
    return files_;
}
getFiles('pages');