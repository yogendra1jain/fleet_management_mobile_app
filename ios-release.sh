#!/bin/bash

echo "------Building release for IOS--------"
touch ios/MyFMSApp/Info.plist
cp firebase-prod/GoogleService-Info.plist ios/GoogleService-Info.plist

ENVFILE=.env.production xcodebuild \
    -workspace ./ios/MyFMSApp.xcworkspace \
    -scheme MyFMSApp \
    -sdk iphoneos \
    -configuration AppStoreDistribution archive \
    -archivePath ./iOS/release/MyFMSApp.xcarchive

echo "---------DONE-----------"
echo "Copying back the dev firebase file"
cp firebase-dev/GoogleService-Info.plist ios/GoogleService-Info.plist
echo "--------Copy Done--------"