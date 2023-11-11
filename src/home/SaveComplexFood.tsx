import React, { useState, useCallback } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { saveFood } from "../store/appSlice";
import { FoodService } from "../services";
import { foodInterface } from "../models/";
import {
  Modal,
  ModalActions,
  InputFormGroup,
  SelectWithSearchAsync,
} from "../components";
import { MdAdd } from "react-icons/md";

interface Ingredient {
  data: foodInterface;
  description?: string;
  label?: string;
  value?: string;
}

interface ComplexFoodProps {
  type?: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  mass: string[];
}

const ComplexFood = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState<number[]>([0]);
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<ComplexFoodProps>({
    defaultValues: {
      type: "complex",
      name: "",
      description: "",
      ingredients: [],
      mass: [],
    },
    shouldUnregister: true,
  });
  const checkKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.code === "Enter") e.preventDefault();
    },
    []
  );
  const findFood = (): ((inputValue: string) => Promise<
    Array<{
      data: foodInterface;
      description: string;
      label: string;
      value: number;
    }>
  >) => {
    let debounceTimer: NodeJS.Timeout;
    return async (inputValue: string) => {
      const data: Array<foodInterface> = await new Promise((resolve) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          resolve(
            FoodService.search(inputValue).then((food) => {
              return food.food;
            })
          );
        }, 600);
      });
      return data.map((f) => ({
        label: f.name,
        value: f.ID!,
        description: `К: ${f.calories}ккал, Б: ${f.protein}г, Ж: ${f.carbohydrate}г, У: ${f.fat}г, ${f.description}`,
        data: f,
      }));
    };
  };

  const onSubmit = (data: ComplexFoodProps) => {
    data.type = "complex";
    const ingredients: Array<foodInterface> = [];
    const _ingredients = data.ingredients;
    _ingredients.forEach((ingredient: Ingredient, index: number) => {
      if (ingredient.data) {
        ingredient.data.weight = +data.mass[index];
        ingredients.push(ingredient.data);
      }
    });
    const mass = data.mass.reduce((a, b) => +a + +b, 0);
    let calories =
      (ingredients.reduce((a, b) => a + b.calories * (b.weight / 100), 0) /
        mass) *
      100;
    let protein =
      (ingredients.reduce((a, b) => a + b.protein * (b.weight / 100), 0) /
        mass) *
      100;
    let fat =
      (ingredients.reduce((a, b) => a + b.fat * (b.weight / 100), 0) / mass) *
      100;
    let carbohydrate =
      (ingredients.reduce((a, b) => a + b.carbohydrate * (b.weight / 100), 0) /
        mass) *
      100;
    calories = +calories.toFixed(2);
    protein = +protein.toFixed(2);
    fat = +fat.toFixed(2);
    carbohydrate = +carbohydrate.toFixed(2);
    const result = {
      description: data.description,
      name: data.name,
      ingredients,
      type: data.type,
      weight: mass,
      calories,
      protein,
      fat,
      carbohydrate,
    };
    dispatch(saveFood(result));
    setIsOpen(false);
  };
  return (
    <li className="list-none items-center">
      <button
        className="flex items-center h-full"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        сохранить новое блюдо
        <MdAdd className="add-icon" />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} key="AddFood">
        {ingredients && (
          <fieldset>
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => checkKeyDown(e)}
            >
              <InputFormGroup
                register={register}
                validation={{
                  required: "Пожалуйста, введите название продукта",
                }}
                errors={errors}
                label="Название:"
                name="name"
                id="name"
              />
              <InputFormGroup
                register={register}
                errors={errors}
                label="Описание:"
                name="description"
                id="description"
              />
              {ingredients.map((_, i) => (
                <SelectWithSearchAsync
                  name={`ingredients.${i.toString()}`}
                  search
                  control={control}
                  errors={errors}
                  loadOptions={findFood()}
                  after={
                    <>
                      <input
                        className="input-after"
                        type="number"
                        placeholder="масса"
                        {...register(`mass.${i}`, {
                          required: "Введите вес",
                          min: 1,
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name={`ingredients.${i.toString()}-mass`}
                        render={({ message }) => (
                          <span className="error-form-message">{message}</span>
                        )}
                      />
                    </>
                  }
                />
              ))}
              <button
                type="button"
                className="button-secondary"
                onClick={() =>
                  setIngredients((prev) => {
                    prev.push(prev[length - 1]);
                    return [...prev];
                  })
                }
              >
                Добавить продукт
              </button>
              <ModalActions>
                <button type="submit" className="button-primary">
                  Сохранить
                </button>
                &nbsp;&nbsp;
                <button onClick={() => setIsOpen(false)}>Отмена</button>
              </ModalActions>
            </form>
          </fieldset>
        )}
      </Modal>
    </li>
  );
};

export default ComplexFood;
