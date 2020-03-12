cd App
npm run prod
cd ..
cp App/dist/bundle.js ionic/public/bundle.js
echo "Copied bundle"
cp -a App/assets/. ionic/public/assets
echo "Copied assets"
cp -a App/libs/. ionic/public/lib
echo "Copied libs"
echo "Completed"
