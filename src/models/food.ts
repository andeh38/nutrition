export interface foodInterface {
  ID?: number;
  type: string;
  name: string;
  description?: string;
  ingredients?: foodInterface[];
  weight: number;
  calories: number;
  protein: number;
  carbohydrate: number;
  fat: number;
}
export class FoodModel {
  id!: string;
  type!: string;
  name!: string;
  description?: string;
  ingredients?: foodInterface[];
  weight!: number;
  calories!: number;
  protein!: number;
  carbohydrate!: number;
  fat!: number;
  constructor(data: foodInterface) {
    Object.assign(this, data);
  }
  set data(data: foodInterface) {
    Object.assign(this, data);
  }
}
