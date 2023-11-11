import { useState, ReactElement } from "react";
import { Modal, ModalActions, Visible } from "../components";
import { MdClose } from "react-icons/md";

type Props<TFood, TMeal> = {
  food: TFood;
  mealType: TMeal;
  onDelete: (food: TFood) => void;
};

const FoodTrash = <
  TFood extends { ID?: number; weight?: number; name?: string },
  TMeal extends string
>({
  food,
  mealType,
  onDelete,
}: Props<TFood, TMeal>): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const onSubmit = () => {
    onDelete(food);
    setIsOpen(false);
  };
  return (
    <>
      <button>
        <MdClose
          onClick={() => {
            setIsOpen(true);
          }}
          className="food-table-delete-icon"
        />
      </button>
      <Visible when={isOpen}>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} key="DeleteFood">
          <div>
            Вы действительно хотите удалить <b>{food.name}</b> из{" "}
            <b>{mealType}</b>?
          </div>
          <ModalActions>
            <button type="submit" className="button-primary" onClick={onSubmit}>
              Удалить
            </button>
            &nbsp;&nbsp;
            <button onClick={() => setIsOpen(false)}>Отмена</button>
          </ModalActions>
        </Modal>
      </Visible>
    </>
  );
};

export default FoodTrash;
