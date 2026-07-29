interface Dependent {
  id?: number;
  birthday: Date;
  bloodType: string;
  dni: string;
  firstName: string;
  lastName: string;
}

export interface FamilyGroup {
  createdBy: any; // Replace to user
  dependent: Dependent;
  /** Foto del grupo como data URI. */
  photo?: string | null;
  members: object[];
  name: string;
  id?: string;
}
