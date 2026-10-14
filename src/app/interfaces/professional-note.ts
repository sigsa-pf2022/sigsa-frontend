/** Indicación que un profesional le deja a un paciente. */
export interface ProfessionalNote {
  id: number;
  content: string;
  createdAt: string;
  patientId: number;
  patientType: 'user' | 'dependent';
  professional: {
    id: number;
    firstName: string;
    lastName: string;
    licenseNumber: number;
  } | null;
}
