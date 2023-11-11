import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { searchFood } from "../store/appSlice";
import {
  MdSearch,
  MdClose,
  MdCalendarToday,
  MdOutlineAnalytics,
} from "react-icons/md";
import { Visible } from "../components";
import SaveFood from "./SaveFood";
import SaveComplexFood from "./SaveComplexFood";
import AddFood from "./AddFood";

const viewTypes = {
  analytics: "День",
  day: "Аналитика",
};

const Navigator = () => {
  const location = useLocation();
  const { food } = useAppSelector((state) => state.analytics);
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  const view = useMemo(() => {
    return location.pathname.includes("analytics") ? "analytics" : "day";
  }, [location]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "/") {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keyup", listener);
    return () => {
      document.removeEventListener("keyup", listener);
    };
  }, [inputRef.current]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    dispatch(searchFood({ name: query, limit: 10, offset: 0 }));
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && fieldsetRef.current) {
      const removeClickListener = () => {
        document.removeEventListener("click", outsideClickListener);
      };
      const outsideClickListener = (event: MouseEvent) => {
        if (!fieldsetRef.current!.contains(event.target as Node)) {
          setQuery("");
          setIsOpen(false);
          removeClickListener();
        }
      };
      document.addEventListener("click", outsideClickListener);
    }
  }, [isOpen]);

  return (
    <nav className="navbar">
      <SaveComplexFood />
      <SaveFood />
      <fieldset className="relative" ref={fieldsetRef}>
        <form onSubmit={onSubmit} className="nav-form">
          <div className="flex items-center h-full">
            <MdSearch className="food-search-icon" />
            <input
              value={query}
              onChange={handleInputChange}
              ref={inputRef}
              className="food-search-input"
              placeholder="Поиск еды"
            />
            <MdClose
              className="food-search-clear-icon"
              onClick={() => setQuery("")}
            />
          </div>
        </form>
        <Visible when={isOpen}>
          <ul className="food-search-results">
            <SaveFood />
            <Visible
              when={food.length}
              placeholder={<span>Ничего не найдено</span>}
            >
              <>
                {food?.map((food) => (
                  <li className="food-search-li" key={food.ID}>
                    <span>{food.name}</span>
                    &nbsp;&nbsp;
                    <small>
                      <b className="abbreviations">К:</b>
                      {food.calories}ккал
                    </small>
                    &nbsp;
                    <small>
                      <b className="abbreviations">Б:</b>
                      {food.protein}г
                    </small>
                    &nbsp;
                    <small>
                      <b className="abbreviations">Ж:</b>
                      {food.fat}г
                    </small>
                    &nbsp;
                    <small>
                      <b className="abbreviations">У:</b>
                      {food.carbohydrate}г
                    </small>
                    <br />
                    <div className="flex items-center justify-between">
                      <Visible when={food.description}>
                        <small>{food.description}</small>
                      </Visible>
                      <AddFood food={food} />
                    </div>
                  </li>
                ))}
              </>
            </Visible>
          </ul>
        </Visible>
      </fieldset>
      <Link
        to={view === "day" ? "analytics" : "/"}
        className="flex items-center gap-2"
      >
        {viewTypes[view]}{" "}
        {view === "day" ? <MdOutlineAnalytics /> : <MdCalendarToday />}
      </Link>
    </nav>
  );
};

export default Navigator;
