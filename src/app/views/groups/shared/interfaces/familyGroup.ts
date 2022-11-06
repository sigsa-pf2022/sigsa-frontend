import { Dependent } from './Dependent';

export interface FamilyGroup {
  createdBy: any; // Replace to user
  dependent: Dependent;
  imgUrl: any;
  members: object[];
  name: string;
  id?: string;
}
