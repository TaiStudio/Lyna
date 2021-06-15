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

$('body').append(`
    <meta name="title" content="Lyna | Home">
    <meta name="description" content="Create a page for provide your social links and other.">
    <meta name="keywords" content="open-source, links, lien, liens, provider, promote, share, free, social, taistudio, lyna">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="language" content="French">
    <meta name="author" content="Tai Studio">

    <meta property="og:title" content="Lyna | Home"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://lyna.ga/"/>
    <meta property="og:image" content="https://lyna.ga/pages/taistudio/Tai%20Studio.png"/>
    <meta property="og:description" content="Create a page for provide your social links and other."/>

    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="https://lyna.ga/">
    <meta name="twitter:title" content="Lyna | Home">
    <meta name="twitter:description" content="Create a page for provide your social links and other.">
    <meta name="twitter:creator" content="Tai Studio">

    <meta name="twitter:image" content="https://lyna.ga/pages/taistudio/Tai%20Studio.png">

    <title>Lyna | Home</title>
    <link rel="stylesheet" href="./css/font.css">
    <link rel="stylesheet" href="./css/index.css" id="css">
    <link rel="stylesheet" href="./css/themes.css">
`);