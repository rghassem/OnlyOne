rm -rf build
npm run prod
mkdir build
cp -r dist build/dist
rm build/dist/bundle.js.map
cp -r assets build/assets
cp -r libs build/libs
cp index.html build
