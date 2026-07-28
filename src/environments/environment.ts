export const environment = {
  production: false,
  firebaseConfig: {apiKey: 'AIzaSyAEGMzSz8Itz5js4GAhO5Uzood9AeMEppg',authDomain: 'sigsa-eeebc.firebaseapp.com',projectId: 'sigsa-eeebc',storageBucket: 'sigsa-eeebc.firebasestorage.app',messagingSenderId: '665878700401',appId: '1:665878700401:web:b6918349a7e75f151316d0',measurementId: 'G-PDMWFWFRGM'},
  // apiUrl: 'http://192.168.0.38:3000/api',      // iPhone en red local
  // apiUrl: 'http://192.168.0.138:3000/api',   // windows config
  // apiUrl: 'http://10.0.2.2:3000/api',            // emulador Android
  apiUrl: 'http://localhost:3000/api',        // browser local
};

// Levantar el emulador:
// ~/Library/Android/sdk/emulator/emulator -avd Pixel_4_API_34
//
// Actualizar cambios y correr en el emulador:
// ionic build && npx cap sync android && npx cap run android --target emulator-5554
// con npx cap run android levanta directamente sin AndroidStudio
