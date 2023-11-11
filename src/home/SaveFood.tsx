import React, { useState } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { useForm } from "react-hook-form";
import { Modal, ModalActions, InputFormGroup } from "../components";
import { MdAdd } from "react-icons/md";
import { saveFood } from "../store/appSlice";
import { foodInterface } from "../models";

type SaveFoodProps = {
  className?: string;
};

const SaveFood: React.FC<SaveFoodProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<foodInterface>({
    defaultValues: {
      type: "simple",
      name: "",
      description: "",
      weight: 0,
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
    },
    shouldUnregister:true,
  });
  const onSubmit = (data: foodInterface): void => {
    dispatch(saveFood(data));
    setIsOpen(false)
  };
  return (
    <li className={`${className} list-none items-center`}>
      <button type="button" className="flex items-center save-food-button h-full" onClick={() => setIsOpen((old) => !old)}>
        <span>сохранить новый продукт</span>
        <MdAdd className="add-icon" />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} key="AddFood">
        <fieldset>
          {isOpen && <form onSubmit={handleSubmit(onSubmit)}>
            <InputFormGroup
              register={register}
              validation={{ required: "Пожалуйста, введите название продукта" }}
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
            <InputFormGroup
              register={register}
              validation={{
                required: "Пожалуйста, введите массу",
              }}
              errors={errors}
              label="Масса(грамм):"
              name="weight"
              id="weight"
              type="number"
            />
            <InputFormGroup
              register={register}
              validation={{
                required: "Пожалуйста, введите калорийность",
                min: {
                  value: 0,
                  message: "значение не может быть отрицательным",
                },
              }}
              errors={errors}
              label="Калорийность(ккал/100г):"
              name="calories"
              id="calories"
              type="number"
            />
            <InputFormGroup
              register={register}
              validation={{
                required: "Пожалуйста, введите белки",
                min: {
                  value: 0,
                  message: "значение не может быть отрицательным",
                },
              }}
              errors={errors}
              label="Белки:"
              name="protein"
              id="protein"
              type="number"
            />
            <InputFormGroup
              register={register}
              validation={{
                required: "Пожалуйста, введите углеводы",
                min: {
                  value: 0,
                  message: "значение не может быть отрицательным",
                },
              }}
              errors={errors}
              label="Углеводы:"
              name="carbohydrate"
              id="carbohydrate"
              type="number"
            />
            <InputFormGroup
              register={register}
              validation={{
                required: "Пожалуйста, введите жирность",
                min: {
                  value: 0,
                  message: "значение не может быть отрицательным",
                },
              }}
              errors={errors}
              label="Жиры:"
              name="fat"
              id="fat"
              type="number"
            />
            <ModalActions>
              <button type="submit" className="button-primary">
                Сохранить
              </button>
              &nbsp;&nbsp;
              <button onClick={() => setIsOpen(false)}>Отмена</button>
            </ModalActions>
          </form>}
        </fieldset>
      </Modal>
    </li>
  );
};

export default SaveFood;
