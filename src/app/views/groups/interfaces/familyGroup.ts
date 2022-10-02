import { Dependent } from './Dependent';

export interface FamilyGroup {
  createdBy: any; // Replace to user
  dependent: Dependent; // Replace to dependent
  imgUrl: any;
  members: object[];
  name: string;
  id?: string;
}
