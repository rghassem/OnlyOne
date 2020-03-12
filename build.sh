cd App
npm run prod
cd ..
cp App/dist/bundle.js ionic/public/bundle.js
cp -a App/assets/. ionic/public/assets
cp -a App/libs/. ionic/public/lib
