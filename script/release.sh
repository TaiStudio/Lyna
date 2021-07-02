git clone "https://AnimeBack-Bot:$GH_TOKEN@github.com/TaiStudio/Lyna" lyna
cd lyna
npm install

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
git push origin main
