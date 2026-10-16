import { Specialization } from './Specialization.interface';

export interface Professional {
  id?: number;
  firstName: string;
  lastName: string;
  specialization?: Specialization[];
  licenseNumber?: number;
  /** Ya atiende al paciente (vínculo aceptado). Sólo viene en la búsqueda. */
  linked?: boolean;
}

export interface ProfessionalsPage {
  data: Professional[];
  total: number;
}

export interface ProfessionalsQuery {
  search?: string;
  specializationId?: number;
  dependentId?: number;
  page?: number;
  take?: number;
}
