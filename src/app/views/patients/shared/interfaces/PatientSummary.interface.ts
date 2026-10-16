import { ProfessionalNote } from 'src/app/interfaces/professional-note';

export interface Adherence {
  taken: number;
  omitted: number;
  pending: number;
  /** Porcentaje entero 0-100; null si todavía no hay tomas para medir. */
  pct: number | null;
}

export interface PatientTreatment {
  seriesId: string | null;
  med: { id: number; name: string } | null;
  intervalHours: number | null;
  totalDoses: number;
  startsAt: string;
  endsAt: string;
  confirmedDoses: number;
  nextDose: { id: number; date: string } | null;
  adherence: Adherence;
  inProgress: boolean;
}

export interface PatientSummary {
  patient: {
    id: number;
    type: 'user' | 'dependent';
    firstName: string;
    lastName: string;
    dni?: string;
    birthday?: string;
    bloodType?: string;
    gender?: string;
  };
  linkedSince: string;
  overallAdherence: Adherence;
  activeTreatments: PatientTreatment[];
  nextAppointment: {
    id: number;
    date: string;
    description: string;
    status: string;
    professional: { id: number; firstName: string; lastName: string } | null;
    withMe: boolean;
  } | null;
  lastNotes: ProfessionalNote[];
}

export interface AgendaAppointment {
  id: number;
  date: string;
  description: string;
  status: string;
  patientId: number;
  patientType: 'user' | 'dependent';
  patientName: string;
  isDependent: boolean;
}
