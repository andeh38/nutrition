import { foodInterface, dayInterface } from "../models";

export const accumulateDetails = (meals: Array<foodInterface> | null) => {
  let calories = 0,
    protein = 0,
    fat = 0,
    carbohydrate = 0;
  meals?.forEach((m) => {
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

export const allCalories = (day: dayInterface) => {
  const all = 0;
  day.breakfast?.reduce(
    (acc, current) => acc + +current.calories * (current.weight / 100),
    all
  );
  day.brunch?.reduce(
    (acc, current) => acc + +current.calories * (current.weight / 100),
    all
  );
  day.lunch?.reduce(
    (acc, current) => acc + +current.calories * (current.weight / 100),
    all
  );
  day.dinner?.reduce(
    (acc, current) => acc + +current.calories * (current.weight / 100),
    all
  );
  return +all.toFixed(2);
}