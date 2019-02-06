#!/bin/bash

echo "------Building release for ANDROID--------"

# . ./.env.production && cd android && echo $API_HOST && echo "Done!"

cp firebase-prod/google-services.json android/app/google-services.json

cd android && ENVFILE=.env.production ./gradlew assembleRelease
cd ..
echo "---------DONE-----------"
echo "Copying back the dev firebase file"
cp firebase-dev/google-services.json android/app/google-services.json
echo "----------Copy Done---------"