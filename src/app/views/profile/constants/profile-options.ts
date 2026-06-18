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
    icon: 'document-text-outline',
    title: 'Mis Documentos',
    action: {
      type: 'navigate',
      payload: '/tabs/clipboard',
    },
  },
  {
    icon: 'medkit-outline',
    title: 'Mis Medicamentos',
    action: {
      type: 'navigate',
      payload: '/tabs/meds',
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
];
