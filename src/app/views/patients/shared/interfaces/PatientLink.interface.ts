export interface PatientLink {
  id: number;
  patientId: number;
  patientType: 'user' | 'dependent';
  firstName: string;
  lastName: string;
  createdAt: string;
}
