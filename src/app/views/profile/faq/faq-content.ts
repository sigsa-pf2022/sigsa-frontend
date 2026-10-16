/**
 * Preguntas frecuentes. Las respuestas describen cómo se comporta la app hoy:
 * si cambia una regla (quién puede aceptar una solicitud, qué pasa al cancelar),
 * hay que actualizarla acá también.
 */
export type FaqItem = { question: string; answer: string };
export type FaqSection = { title: string; icon: string; items: FaqItem[] };

export const FAQ_SECTIONS: FaqSection[] = [
  {
    title: 'Estados',
    icon: 'pricetag-outline',
    items: [
      {
        question: '¿Qué significa cada estado?',
        answer:
          'PROGRAMADO: está cargado y todavía no llegó la hora.\n' +
          'CONFIRMADO: lo confirmaste vos o alguien del grupo se hizo cargo.\n' +
          'CANCELADO: se dio de baja; sigue visible y muestra quién lo canceló y cuándo.\n' +
          'VENCIDO: pasó la hora y nadie lo confirmó ni se hizo cargo.',
      },
      {
        question: '¿Puedo modificar un turno o una toma que ya pasó?',
        answer:
          'No. Lo vencido o cancelado ya no se edita, no se confirma ni se cancela: queda como registro. ' +
          'Lo único que podés hacer es borrarlo si no querés verlo más.',
      },
      {
        question: '¿Qué diferencia hay entre cancelar y borrar?',
        answer:
          'Cancelar es para un turno o una toma que existió y se suspendió: queda en la lista como CANCELADO ' +
          'y, si es de un grupo, en el historial. Borrar es para lo que cargaste por error: desaparece ' +
          'como si nunca lo hubieras cargado y no se puede deshacer.',
      },
    ],
  },
  {
    title: 'Turnos',
    icon: 'time-outline',
    items: [
      {
        question: '¿Cómo cargo un turno?',
        answer:
          'Desde Mis turnos, con el botón +. Elegís el profesional, la fecha, la hora y, si querés, una descripción. ' +
          'El profesional tiene que estar en Mis profesionales.',
      },
      {
        question: '¿Cuándo me avisa la app?',
        answer:
          'Antes del horario del turno te llega una notificación que dice con qué profesional es.',
      },
      {
        question: '¿Puedo confirmar o cancelar desde la notificación?',
        answer:
          'Sí, en tus turnos personales. Si la notificación llega con la app abierta, trae los botones ' +
          'Confirmar y Cancelar. Cancelar abre el turno y te pide que lo confirmes, para que un toque sin querer ' +
          'no lo dé de baja. Si la app está cerrada, tocar la notificación abre el turno.',
      },
    ],
  },
  {
    title: 'Medicamentos',
    icon: 'medkit-outline',
    items: [
      {
        question: '¿Cómo programo un recordatorio?',
        answer:
          'Desde Recordatorios (Mis medicamentos), con el botón +. Elegís el medicamento, la fecha, la hora y la frecuencia: ' +
          'una sola vez, o cada 6, 8, 12 o 24 horas.',
      },
      {
        question: '¿Qué es un tratamiento?',
        answer:
          'Cuando elegís una frecuencia que no es "Una vez", indicás cuántos días dura (hasta 60) y la app arma ' +
          'todas las tomas de una vez. Cada toma tiene su propio recordatorio y su propio estado.',
      },
      {
        question: '¿Qué pasa si cancelo un tratamiento?',
        answer:
          'Se cancelan las tomas que faltan. Las que ya pasaron quedan como estaban.',
      },
    ],
  },
  {
    title: 'Grupo familiar',
    icon: 'people-outline',
    items: [
      {
        question: '¿Para qué sirve un grupo?',
        answer:
          'Para cuidar entre varios a una persona a cargo. Los turnos y medicamentos de esa persona ' +
          'les avisan a todos los integrantes del grupo.',
      },
      {
        question: '¿Qué hacen "Me hago cargo" y "No puedo"?',
        answer:
          '"Me hago cargo" confirma el turno o la toma y les avisa al resto que te ocupás vos. El primero que lo ' +
          'toma se lo queda: si alguien se te adelantó, la app te dice quién. "No puedo" les avisa a los demás ' +
          'que no vas a poder; el evento sigue abierto para que lo tome otro. Se puede decir una sola vez por evento.',
      },
      {
        question: '¿Quién puede sumar integrantes?',
        answer:
          'Cualquier integrante del grupo, buscando a la persona por su DNI. Tiene que tener cuenta en la app.',
      },
      {
        question: '¿Qué pasa si salgo del grupo?',
        answer:
          'Dejás de recibir sus avisos. Si eras quien administraba el grupo, la administración pasa a otro ' +
          'integrante. Si no queda nadie, el grupo se elimina.',
      },
      {
        question: '¿Qué muestra el historial?',
        answer:
          'Quién cargó cada turno o medicamento, quién se hizo cargo, quién avisó que no podía, quién canceló ' +
          'y quién salió del grupo, con fecha y hora.',
      },
      {
        question: '¿Puedo borrar un evento del que alguien se hizo cargo?',
        answer:
          'No. El grupo ya se organizó sobre eso, así que se puede cancelar pero no borrar.',
      },
    ],
  },
  {
    title: 'Profesionales y documentos',
    icon: 'accessibility-outline',
    items: [
      {
        question: '¿Qué es Mis profesionales?',
        answer:
          'Tu agenda de médicos y especialistas. Los cargás una vez y después los elegís al crear un turno.',
      },
      {
        question: '¿Qué pasa si un profesional me agrega como paciente?',
        answer:
          'Quedás vinculado en el momento y te llega un aviso. Desde ahí el profesional puede ver tus documentos.',
      },
      {
        question: '¿Y si quiere vincularse con la persona a cargo de un grupo?',
        answer:
          'Les llega una solicitud a los integrantes, pero solo quien administra el grupo puede aceptarla o ' +
          'rechazarla. Hasta que la acepte, el profesional no tiene acceso.',
      },
      {
        question: '¿Dónde queda un documento que descargo?',
        answer: 'En la carpeta Documentos del teléfono, con el mismo nombre del archivo.',
      },
    ],
  },
  {
    title: 'Notificaciones y cuenta',
    icon: 'notifications-outline',
    items: [
      {
        question: 'No me llegan las notificaciones, ¿qué reviso?',
        answer:
          'Que la app tenga permiso de notificaciones en la configuración del teléfono, que tengas la sesión ' +
          'iniciada y que el teléfono tenga conexión a internet. Al cerrar sesión, ese teléfono deja de recibir avisos.',
      },
      {
        question: '¿Puedo usar la app en más de un teléfono?',
        answer: 'Sí. Cada teléfono donde tengas la sesión iniciada recibe las notificaciones.',
      },
      {
        question: '¿Cómo cambio mis datos o mi contraseña?',
        answer:
          'En Mi perfil, tocá tu nombre para entrar a Mis datos. Ahí podés editar tus datos y tu foto, y cambiar ' +
          'la contraseña: te mandamos un código al correo para elegir una nueva.',
      },
    ],
  },
];
