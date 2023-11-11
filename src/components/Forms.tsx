import { useFormContext, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Visible from "./Visible";

export const useMyFormContext = () => {
  const context = useFormContext();
  return context || { formState: { errors: [] } };
};

export const InputFormGroup = ({
  register,
  validation,
  errors,
  className = "",
  label,
  name,
  id,
  type = "text",
  ...props
}: {
  register: UseFormRegister<any>;
  validation?: object;
  errors: object;
  className?: string;
  label: string;
  name: string;
  id: string;
  type?: string;
  autoComplete?: string;
}) => {
  return (
    <div  className={`form-group ${className}`}>
      <Visible when={label}>
        <label htmlFor={name || id}>{label}</label>
      </Visible>
      <div className="input-wrapper">
        <input type={type} {...register(name, validation)} {...props}/>
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <span className="error-form-message">{message}</span>
        )}
      />
    </div>
  );
};
