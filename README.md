# Egendata app

![License](https://flat.badgen.net/github/license/egendata/app)
![Dependabot](https://flat.badgen.net/dependabot/egendata/app?icon=dependabot)
![Travis CI](https://badgen.net/travis/egendata/app?icon=travis)
![Github release](https://flat.badgen.net/github/release/egendata/app?icon=github)

An example app for managing consents and viewing data

## Prerequisites

### OS X

- Install Android Studio
- Install Watchman `brew install watchman`

### Linux and Android

* Install Android Studio https://developer.android.com/studio/install
  * In the project directory create the file `android/local.properties` with the content `sdk.dir = /home/USERNAME/Android/Sdk`
  * Approve the licenses of the SDK packages by running ` /home/USERNAME/Android/Sdk/tools/bin/sdkmanager --licenses`
  * If you get `Could not find tools.jar` then you need to point gradle to the JDK installation.
    * You can find it with `2>/dev/null find / -name tools.jar -path "*jdk*"`
    * If you don't have JDK installed then install it
    * Create the file `~/.gradle/gradle.properties` with the line `org.gradle.java.home = /PATH/TO/JDK`
  * Set up the device which will run the app (API Level 26, Android 8.0) https://facebook.github.io/react-native/docs/getting-started.html#preparing-the-android-device
* (Optionally, if you want it to automatically reload on code change) Install Watchman https://facebook.github.io/watchman/docs/install.html#installing-from-source

## Config

- Create a `.env` in project root with:

```bash
DROPBOX_KEY=tsw50ay5z1j0k0k
OPERATOR_URL=http://192.168.110.130:3000
```
or whatever is the adress of the operator you want to use. Note that *OPERATOR_URL must be reachable from the emulator or physical device that will run the app*. The iOS emulator shares networking with the computer so if you are running it locally "localhost" should work for it; the Android emulator does not share networking like that, so "localhost" will not work there. The external IP of your computer should always work.

## Run

### __Android__

- Start the device that will run the app from Android Studio. Virtual devices are under Tools->AVD Manager (if you do not see `AVD Manager`, go to `Help` and use `Find action`)
- Run

  ```bash
  npm start
  npm run android
  ```

  - `npm run android` is only needed the first time or when adding dependencies (it runs Jetifier to migrate libraries to AndroidX; after that you can run it from Android Studio if you prefer)

  - if you want to run it on an actual device you need to run adb reverse tcp:8081 tcp:8081 so that the phone can reach the Metro bundler

### __iOS__

- Update Cocoapods if version < 1.7.5 (check with `pod --version`)

  ```bash
  sudo gem install cocoapods
  ```

- Install pods (if native dependencies have changed)

  ```bash
  cd ios && pod install && cd ..
  ```

- Run

  ```bash
  npm start
  npm run ios
  ```

- If build fails

  ```bash
  rm -rf ios/build
  rm -rf ios/Pods
  cd ios && pod install && cd ..
  npm run ios
  ```

- If build fails with some version of `Failed to find a suitable device for the type SimDeviceType`

  ```bash
  sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
  npm run ios
  ```

### Common

If the app doesn't open automatically go into apps and find Egendata

React debug menu available on ios with ⌘d and on android with ⌘m / ctrl+m

### Debugging
  If the app complains about not getting the right methods exported from `react-native-jose`, try clearing all your react-native cache:

  ```bash
  watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && npm cache verify && npm install && npm start -- --reset-cache

  watchman watch-del-all && rm -rf $TMPDIR/react-native-packager-cache-* && rm -rf $TMPDIR/metro-bundler-cache-* && rm -rf node_modules/ && npm cache clean --force && npm install && npm start -- --reset-cache
  ```

## Releasing Betas

**At the time of writing, both iOS and Android builds are integrated in the continuous delivery pipeline. Paired with a semantic release plugin, [Fastlane](https://github.com/fastlane/fastlane) builds and deploys both Android and iOS (not differentiated atm) from changes to the master branch that are relevant to the [semantic release commit message format](https://github.com/semantic-release/semantic-release#commit-message-format).**

### Manual releases

*Install fastlane*

```
# Using RubyGems
sudo gem install fastlane -NV
```
or

```
# Alternatively using Homebrew
brew cask install fastlane
```

### iOS (Testflight)

We use [Fastlane match](https://docs.fastlane.tools/actions/match/) for building and deploying this app.

Fastlane match uses a private Github repository (encrypted) to store iOS signing certificates and the provisioning profile needed to build and ship the application. When you run a [lane](https://docs.fastlane.tools/advanced/lanes/) with the match command in it, fastlane pulls the said files from this repository and uses them for signing in the xcode build process.

All the relevant files for how this is currently set up can be found in `ios/fastlane`.

*Prerequisites:*

1. Install the latest Xcode command line tools:

`xcode-select --install`

2. Access to the private repository holding the certificates and the provisioning profile.

3. Edit the `git_url(...)` in `ios/fastlane/Matchfile` to the ssh version of the git url.

4. Username and password for the apple user who is performing this operation. This user needs to be a part of the appstore connect team.

*NOTE: Remember to change `.env`-file (correct OPERATOR_URL etc.) before doing the steps below*

```
cd ios
fastlane manual_alpha_release
```

*NOTE: Fastlane command might error with `error: Multiple commands produce ...`, if so, run again.*
*NOTE: Fastlane command might error with ` error: The sandbox is not in sync with the Podfile.lock`, if so, see the `If build fails` section .*

### Android (Google Play)

*NOTE: Remember to change `.env`-file (correct OPERATOR_URL etc.) before doing the steps below*

1. Download the Google Play, the release.keystore and the gradle.properties (it's in LastPass)
  - Place the `.json`-file somewhere, you'll need to point to it from `android/fastlane/Appfile`
    `json_key_file("/path/to/egendata_google_play.json")`
  - Place the `release.keystore` in `android/app`
  - Create `gradle.properties` in `android` and paste from lastpass.

2.
```
cd android
fastlane alpha
```

