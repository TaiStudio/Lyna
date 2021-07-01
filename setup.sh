#!/usr/bin/env bash

set -v            # print commands before execution, but don't expand env vars in output
set -o errexit    # always exit on error
set -o pipefail   # honor exit codes when piping
set -o nounset    # fail on unset variables

git clone "https://AnimeBack-Bot:$GH_TOKEN@github.com/TaiStudio/Lyna" extension
cd extension
npm ci

npm run setup

# bail if nothing changed
if [ "$(git status --porcelain)" = "" ]; then
  echo "no new content found; goodbye!"
  exit
fi

git config user.email animebot.tai.studio@outlook.fr
git config user.name AnimeBack-Bot
git add .
git commit -am "🤖✔️ setup" --author "AnimeBack-Bot <animebot.tai.studio@outlook.fr>"
git pull --rebase
git push origin master
