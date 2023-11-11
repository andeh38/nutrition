import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { login, register } from "../store/appSlice";
import { InputFormGroup } from "../components";

type formData = {
  username: string;
  password: string;
};

const Authentication = () => {
  const { authError } = useAppSelector((state) => state.authError);
  const dispatch = useAppDispatch();
  const [view, setView] = useState<"login" | "register">("login");
  const {
    register: formRegister,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    } as formData,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (authError) {
      setError("username", { type: "server", message: authError });
    }
  }, [authError])

  const changeView = () => {
    setView((prev) => (prev === "login" ? "register" : "login"));
  }
  const onSubmit = (data: formData) => {
    if (view === "login") {
      dispatch(login(data));
    } else {
      dispatch(register(data));
    }    
  }
  return (
    <div className="auth-block">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="auth-header">Добро пожаловать!</h1>
        <InputFormGroup
          label="Имя:"
          id="username"
          errors={errors}
          name="username"
          register={formRegister}
          validation={{
            required: "Пожалуйста, введите имя",
          }}
          autoComplete="username"
        />
        <InputFormGroup
          label="Пароль:"
          id="password"
          errors={errors}
          name="password"
          register={formRegister}
          validation={{
            required: "Пожалуйста, введите пароль",
          }}
          type="password"
          autoComplete="current-password"
        />
        <button type="submit">
          {view === "login" ? "Вход" : "Регистрация"}
        </button>
        &nbsp;
        <button type="button" onClick={changeView}>
          {view === "login" ? "Создать аккаунт" : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default Authentication;
