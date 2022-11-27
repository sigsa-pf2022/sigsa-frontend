import { Specialization } from './Specialization.interface';

export interface Professional {
  id?: number;
  firstName: string;
  lastName: string;
  specialization?: Specialization[];
  licenseNumber?: number;
}
