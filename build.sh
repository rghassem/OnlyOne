rm -rf build
npm run prod
mkdir build
cp dist -r build/dist
rm build/dist/bundle.js.map
cp assets -r build/assets
cp libs -r build/libs
cp index.html build
