export interface PatientLink {
  id: number;
  patientId: number;
  patientType: 'user' | 'dependent';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  firstName: string;
  lastName: string;
  createdAt: string;
  /** Sólo en los aceptados. */
  nextAppointmentDate?: string | null;
  activeTreatmentsCount?: number;
}
