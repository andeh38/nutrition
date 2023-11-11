import { useEffect, Fragment } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import Calendar from "react-calendar";
import { Visible } from "../components";
import { dayInterface, foodInterface } from "../models";
import FoodTrash from "./FoodTrash";
import { searchDay, updateDay } from "../store/appSlice";

const mealType = {
  breakfast: "Завтрак",
  brunch: "Второй завтрак",
  lunch: "Обед",
  dinner: "Ужин",
};
const detailsType = {
  breakfast: "breakfastDetails",
  brunch: "brunchDetails",
  lunch: "lunchDetails",
  dinner: "dinnerDetails",
};
interface dayDetailsInterface {
  breakfastDetails: Array<number>;
  brunchDetails: Array<number>;
  lunchDetails: Array<number>;
  dinnerDetails: Array<number>;
}
const abbreviations = ["К:", "Б:", "Ж:", "У:"];

const Table = ({
  type,
  day,
}: {
  type: keyof typeof mealType;
  day: dayInterface;
}) => {
  const dispatch = useAppDispatch();
  const _detailsType = detailsType[type] as keyof dayDetailsInterface;
  const onDelete = (food: foodInterface) => {
    const _day = { ...day! };
    const meal = [..._day[type]];
    const foodIndex = meal.findIndex(
      (f) => f.ID === food.ID && f.weight === food.weight
    );
    meal.splice(foodIndex, 1);
    _day[type] = meal;
    dispatch(updateDay(_day!));
  };
  return (
    <table className="food-table">
      <thead>
        <tr>
          <th className="flex justify-between food-table-title">
            {mealType[type]}
            <span>
              {day[_detailsType]?.map((number, i) => (
                <Fragment key={i}>
                  <small>
                    {abbreviations[i]}
                    {number}
                  </small>
                  &nbsp;
                </Fragment>
              ))}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {day[type]?.map((food, i) => (
          <tr className="food-table-tr" key={i}>
            <td
              className="flex justify-between items-center"
              style={{ margin: "0px 0.5em" }}
            >
              <div>
                <span>
                  {food.name}
                  &nbsp;
                  <small>
                    {food.description} {food.weight}г.
                  </small>
                </span>
                <br />
                <span>
                  <small>
                    <b className="abbreviations">К:</b>
                    {+(food.calories * (food.weight / 100)).toFixed(2)} ккал
                  </small>
                  &nbsp;
                  <small>
                    <b className="abbreviations">Б:</b>
                    {+(food.protein * (food.weight / 100)).toFixed(2)} г
                  </small>
                  &nbsp;
                  <small>
                    <b className="abbreviations">Ж:</b>
                    {+(food.fat * (food.weight / 100)).toFixed(2)} г
                  </small>
                  &nbsp;
                  <small>
                    <b className="abbreviations">У:</b>
                    {+(food.carbohydrate * (food.weight / 100)).toFixed(2)} г
                  </small>
                </span>
              </div>
              <FoodTrash
                food={food}
                mealType={mealType[type]}
                onDelete={onDelete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Day = () => {
  const { day } = useAppSelector((state) => state.day);
  const dispatch = useAppDispatch();
  useEffect(() => {
    !day && dispatch(searchDay(new Date()));
  }, []);
  const onChange = (value: Value) => {
    let _value;
    if (Array.isArray(value)) {
      _value = value[0];
    } else _value = value;
    dispatch(searchDay(_value!));
  };
  return (
    <div>
      <Calendar
        onChange={onChange}
        maxDate={new Date()}
        minDetail={"year"}
        defaultValue={day?.date || new Date()}
      />
      <div>
        <Visible when={day}>
          <>
            <Table type="breakfast" day={day!} />
            <Table type="brunch" day={day!} />
            <Table type="lunch" day={day!} />
            <Table type="dinner" day={day!} />
          </>
        </Visible>
      </div>
    </div>
  );
};

export default Day;
