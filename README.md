![Batmobile Interface](design-assets/BATMOBILE%20INTERFACE.svg)

ever wanted to feel what it's like to get behind the wheel of batman's iconic bat-mobile? well, look no further! this multi-platform application gives you a glimpse into the life of the world's most famous detective. with top-secret technology created by the genius minds of wayne tech enterprises, users will be delighted with a simulated hud experience, complete with vehicle controls, bat-signal alerts, and real-time mapping software to keep you immersed.

**features:** real-time gotham city map tracking, simulated batmobile controls including steering, gear shifts, throttle/braking mechanics, and themed dashboard interface courtesy of wayne enterprises.  

# custom elements: crime escalation system

batman doesn't respond to petty crime around the city. commissioner gordon knows the bat-signal should be reserved for emergent situations that go beyond the gotham police department's capabilities. batman's batmobile is fitted with a unique crime severity system that will immediately flag his attention when dangerous, high-level crime is being committed around the city.

**core functionality:** expansion of pre-existing traffic alert structure. tracks high-level/critical crime events across the city that requires intervention from batman. these crimes include: organized crime, terror threats, armed activity, infrastructure/cyber attacks, and arkham-related occurrences like riots and prisoner escapes. 

# custom elements: bat-signal

no batmobile would be complete without an intricate alert system to tell batman when and where he's needed across gotham city.

**core functionality:** built from the pre-existing traffic alert structure, the bat-signal works off of alert severity. when severity hits critical levels, the bat-signal alert fires across the dashboard.

**important notice for demo purposes:** a randomized bat-signal is set to fire within **thirty seconds** of web dashboard start-up.

## architecture overview

```bash
| mobile-controls
  ➝ functions as the steering, braking, lights & gear systems.

| tablet-cluster
  ➝ functions as a vehicle dashboard hud with speedometer, rpm gauges with real-time syncing with mobile controls.

| web-map
  ➝ functions a visual dashboard connected with gotham police department servers, gps system, & intricate crime severity alerts whenever the bat-signal is activiated by commissioner gordon.
```

each platform works together to create a rounded, immersive simulated experience with real-time syncing across all three. when you steer the bat-mobile in the mobile-control interface, you will see it change directions within the web-powered dashboard. when you turn on your lights or blinkers within the mobile-controls, the tablet-cluster interface will reflect these choices in real-time.

## installation guide

installing and running the bat-mobile interface suite is easy if you follow this simple, step by step guide. you'll be patrolling the streets of gotham like the dark knight himself.

**step one:** initial download
- download the .zip file from this repository
    - unzip it in your desired location

**step two:** server configuration
- open the project in the code editor of your choice, then navigate to the **server** folder, by entering the following command in your terminal:

```bash
cd server
```
- verify you are working inside the server folder, then proceed to install all needed dependencies with the following command:

```bash
npm install
```

**step three:** mobile configuration
- return to the root folder of your project by entering:

```bash
cd ..
```
- then navigate to the mobile-controls folder, with the following command:

```bash
cd mobile-controls
```
- verify you are working inside the mobile-controls folder, then proceed to install all needed dependencies with the following command:

```bash
npm install
```

**step four:** tablet configuration
- return to the root folder of your project by entering:

```bash
cd ..
```
- then navigate to the tablet-cluster folder, with the following command:

```bash
cd tablet-cluster
```
- verify you are working inside the tablet-cluster folder, then proceed to install all needed dependencies with the following command:

```bash
npm install
```

**step five:** web configuration
- return to the root folder of your project by entering:

```bash
cd ..
```
- then navigate to the web-map folder, with the following command:

```bash
cd web-map
```
- verify you are working inside the tablet-cluster folder, then proceed to install all needed dependencies with the following command:

```bash
npm install
```

### you have now successfully installed all dependencies and initialized your project.

to start each platform for the complete experience, proceed with the following steps. 

**important: use separate terminal windows for each platform.**

**step one:** server start up
- navigate to your server folder with
```bash
cd server
```
- then fire it up with this command:
```bash
npm run dev
```

**step two:** mobile start up
- navigate to your mobile-controls folder with
```bash
cd mobile-controls
```
- then fire it up with this command:
```bash
npx expo start
```

**step three:** tablet start up
- navigate to your tablet-cluster folder with
```bash
cd tablet-cluster
```
- then fire it up with this command:
```bash
npx expo start
```

**step four:** web start up
- navigate to your web-map folder with
```bash
cd web-map
```
- then fire it up with this command:
```bash
npm run dev
```

you are now running the bat-mobile interface suite! have fun!

---

### integral frameworks:

![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white) ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![CSS](https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black) ![Apple](https://img.shields.io/badge/Apple-%23000000.svg?style=for-the-badge&logo=apple&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


## technical credits
- [using SVGs with expo](https://docs.expo.dev/guides/using-svg/)
- [svg declarations in typescript](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [react native metro bundler](https://facebook.github.io/metro/docs/configuration)
- [svg coordinate systems](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [trig in computer graphics](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#angles)
- [gauge layouts & displays](https://developers.google.com/chart/interactive/docs/gallery/gauge)
- [needle motion & animation effects](https://reactnative.dev/docs/animated)
- [svg rendering & transforms w/ react-native-svg](https://github.com/software-mansion/react-native-svg)
- [animated svg limitations with react-native](https://reactnative.dev/docs/animated#limitations)
- [automotive hmi gauge layout principles](https://developer.apple.com/design/human-interface-guidelines/automotive/overview/)
