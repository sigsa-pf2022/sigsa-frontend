# SIGSA Frontend — Documentación para Claude

## Stack
- Ionic + Angular + Capacitor
- `@capacitor/push-notifications` para push notifications nativas
- `@capacitor/local-notifications` (instalado pero ya no se usa para turnos/medicamentos)

## Estructura clave

```
src/app/
├── services/
│   ├── authentication/      # AuthenticationService — login, logout, JWT en localStorage
│   ├── push-notifications/  # PushNotificationsService — registro FCM
│   └── local-notifications/ # LocalNotificationsService (legacy, ya no se llama para crear eventos)
├── views/
│   ├── appointments/create-appointment/  # Crear/editar turnos
│   ├── meds/create-med-event/           # Crear/editar recordatorios de medicamento
│   └── groups/                          # Grupos familiares
└── interceptors/
    └── token-interceptor.service.ts     # Agrega JWT a cada request HTTP
```

## Sistema de push notifications

### PushNotificationsService (`src/app/services/push-notifications/`)
- Se inicializa en `AppComponent` si hay JWT en localStorage (sesión activa)
- Se inicializa en `AuthenticationService.signIn()` después del login
- Se desregistra en `AuthenticationService.signOut()`
- Solo activo en Capacitor (no en browser web)

### Flujo
1. Al login → `PushNotifications.requestPermissions()` → `PushNotifications.register()`
2. Al obtener el token → `POST /api/notifications/devices` con `{ token, platform }`
3. El backend guarda el token asociado al userId
4. Al logout → `DELETE /api/notifications/devices/:token`

### Firebase
- Proyecto: `sigsa-eeebc`
- Config en `src/environments/environment.ts`
- Android requiere `android/app/google-services.json` (NO commitear, está en .gitignore)

## Configuración local

### Para iOS (Xcode)
```bash
npm run build
npx cap sync ios      # o ./node_modules/.bin/cap sync ios
npx cap open ios
```
Requiere cuenta Apple Developer paga para push notifications en iOS.

### Para Android (Android Studio / Emulador)
```bash
npm run build
./node_modules/.bin/cap sync android
./node_modules/.bin/cap open android
```
- El emulador usa `http://10.0.2.2:3000/api` para llegar al backend local
- Requiere `google-services.json` en `android/app/`
- El emulador debe tener Google Play Services (elegir Pixel con ícono ▶)

## TokenInterceptor
Está registrado en los módulos lazy-loaded (`tabs`, `home`, `appointments`, `groups`, etc.), no en `AppModule`. Agrega `Authorization: Bearer <jwt>` automáticamente a todos los requests HTTP dentro de esos módulos.

## Decisiones importantes
- Las notificaciones locales (`LocalNotificationsService`) fueron reemplazadas por push del backend. Ya no se llaman en `create-appointment` ni `create-med-event`.
- `android/` e `ios/` están en `.gitignore` — son carpetas generadas por Capacitor.
- La URL del backend para el emulador Android es `http://10.0.2.2:3000/api` (no `localhost`).
- Android necesita `network_security_config.xml` para permitir HTTP a `10.0.2.2` (desarrollo).
