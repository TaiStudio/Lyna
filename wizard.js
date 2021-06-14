/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const fonts = require("./lib/fonts");
const inquirer = require("inquirer");
const isUrl = require("is-url");
const path = require("path");
const fs = require("fs");
const slugify = require("slugg");
const mkdirp = require("mkdirp");
const cleanDeep = require("clean-deep");
const existingSlugs = fs.readdirSync(path.join(__dirname, "config"));
var createFile = require("create-file");

const questions = [
  {
    type: "input",
    name: "name",
    message: "What's your name (or pseudo) ?",
    validate: function (value) {
      if (!value) return "Please enter a name";
      const slug = slugify(value);
      if (existingSlugs.includes(slug))
        return `this name is already in use, if you own it please edit the json file.`;
      return true;
    },
  },
  {
    type: "list",
    name: "font",
    message: "Choose a font in list",
    choices: fonts,
    validate: function (value) {
      if (!value) return "Please select a fonts";
    },
  },
];

inquirer
  .prompt(questions)
  .then(function (answers) {
    const extension = cleanDeep(answers);
    const slug = slugify(extension.name);
    const basepath = path.join(__dirname, `config/${slug}`);
    const jsonPath = path.join(basepath, `${slug}.json`);
    mkdirp(basepath);
    createFile(
      jsonPath,
      `${JSON.stringify(extension)} \r\n`,
      function (err) {}
    );
    console.log();
    console.log(`Yay! Created ${path.relative(process.cwd(), jsonPath)}`);
    console.log(`Now you just need to add an icon named ${slug}.png\n`);
    console.log(
      `Once you're done, open your pull request!`
    );
    console.log();
  })
  .catch((error) => {
    console.error(error);
  });