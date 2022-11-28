export const PROFILE_OPTIONS = [
  {
    profileIcon: 'home/personal-profile.svg',
    title: 'Correo electronico',
  },
  {
    icon: 'accessibility-outline',
    title: 'Mis Profesionales',
    action: {
      type: 'navigate',
      payload: '/doctors',
    },
  },
  {
    icon: 'time-outline',
    title: 'Mis Turnos',
    action: {
      type: 'navigate',
      payload: '/tabs/appointments',
    },
  },
  {
    icon: 'help-circle-outline',
    title: 'Ayuda',
    content: [
      {
        title: 'Preguntas frecuentes',
      },
      {
        title: 'Hablar con soporte',
      },
    ],
  },
  {
    icon: 'lock-closed-outline',
    title: 'Seguridad',
    content: [
      {
        title: 'Cambiar contraseña',
      },
    ],
  },
  {
    icon: 'settings-outline',
    title: 'Preferencias',
    content: [
      {
        title: 'Notificaciones push',
      },
    ],
  },
];
