import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { updateDay } from "../store/appSlice";
import { foodInterface } from "../models";
import { Modal, ModalActions, InputFormGroup } from "../components";
import { MdAdd } from "react-icons/md";

interface AddFoodProps {
  className?: string;
  food: foodInterface;
}
interface timeInterface {
  breakfast: Array<foodInterface>;
  brunch: Array<foodInterface>;
  lunch: Array<foodInterface>;
  dinner: Array<foodInterface>;
}
const AddFood = ({ className, food }: AddFoodProps) => {
  const { day } = useAppSelector((state) => state.day);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      time: "breakfast",
      weight: 0,
    } as {
      time: keyof timeInterface;
      weight: number;
    },
    shouldUnregister: true,
  });
  const onSubmit = (data: { time: keyof timeInterface; weight: number }) => {
    const _day = { ...day! };
    const _food = { ...food };
    _food.weight = +data.weight;
    const meal = [...(_day![data.time] || [])];
    meal.push(_food);
    _day![data.time] = meal;
    dispatch(updateDay(_day!));
    setIsOpen(false);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={className}
      >
        <MdAdd style={{ width: "20px", height: "20px" }} />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} key="AddFood">
        <fieldset>
          {isOpen && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <strong>Добавить {food.name}</strong>
              <div className="form-group">
                <label htmlFor="time">Время приема пищи:</label>
                <div className="flex">
                  <select {...register("time")}>
                    <option value="breakfast">Завтрак</option>
                    <option value="brunch">Второй завтрак</option>
                    <option value="lunch">Обед</option>
                    <option value="dinner">Ужин</option>
                  </select>
                </div>
              </div>
              <InputFormGroup
                register={register}
                validation={{
                  required: "Пожалуйста, введите массу",
                  min: {
                    value: 0,
                    message: "значение не может быть отрицательным",
                  },
                }}
                errors={errors}
                label="Масса:"
                name="weight"
                id="weight"
                type="number"
              />
              <ModalActions>
                <button type="submit" className="button-primary">
                  Сохранить
                </button>
                &nbsp;&nbsp;
                <button onClick={() => setIsOpen(false)}>Отмена</button>
              </ModalActions>
            </form>
          )}
        </fieldset>
      </Modal>
    </>
  );
};

export default AddFood;
