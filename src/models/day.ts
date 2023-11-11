import { foodInterface } from "./food";

const accumulateDetails = (meals: Array<foodInterface>) => {
  let calories = 0,
    protein = 0,
    fat = 0,
    carbohydrate = 0;
  meals.forEach((m) => {
    calories += +m.calories * (m.weight / 100);
    protein += +m.protein * (m.weight / 100);
    fat += +m.fat * (m.weight / 100);
    carbohydrate += +m.carbohydrate * (m.weight / 100);
  });
  calories = +calories.toFixed(2);
  protein = +protein.toFixed(2);
  fat = +fat.toFixed(2);
  carbohydrate = +carbohydrate.toFixed(2);
  return [calories, protein, fat, carbohydrate];
};

export interface dayInterface {
  ID?: string;
  date: Date;
  breakfast: Array<foodInterface>;
  brunch: Array<foodInterface>;
  lunch: Array<foodInterface>;
  dinner: Array<foodInterface>;
  breakfastDetails?: Array<number>;
  brunchDetails?: Array<number>;
  lunchDetails?: Array<number>;
  dinnerDetails?: Array<number>;
}

export class DayModel {
  ID!: string;
  date!: Date;
  breakfast!: Array<foodInterface>;
  brunch!: Array<foodInterface>;
  lunch!: Array<foodInterface>;
  dinner!: Array<foodInterface>;

  constructor(data: dayInterface) {
    Object.assign(this, data);
    this.breakfast = data.breakfast || [];
    this.brunch = data.brunch || [];
    this.lunch = data.lunch || [];
    this.dinner = data.dinner || [];
  }

  set data(data: dayInterface) {
    Object.assign(this, data);
  }

  get breakfastDetails() {
    return accumulateDetails(this.breakfast);
  }
  get brunchDetails() {
    return accumulateDetails(this.brunch);
  }
  get lunchDetails() {
    return accumulateDetails(this.lunch);
  }
  get dinnerDetails() {
    return accumulateDetails(this.dinner);
  }

  get AllCalories() {
    const all = 0;
    this.breakfast.reduce(
      (acc, current) => acc + +current.calories * (current.weight / 100),
      all
    );
    this.brunch.reduce(
      (acc, current) => acc + +current.calories * (current.weight / 100),
      all
    );
    this.lunch.reduce(
      (acc, current) => acc + +current.calories * (current.weight / 100),
      all
    );
    this.dinner.reduce(
      (acc, current) => acc + +current.calories * (current.weight / 100),
      all
    );
    return +all.toFixed(2);
  }

  toJson() {
    return {
      id: this.ID,
      date: this.date,
      breakfast: this.breakfast,
      brunch: this.brunch,
      lunch: this.lunch,
      dinner: this.dinner,
    };
  }
}
