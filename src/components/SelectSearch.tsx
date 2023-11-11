// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Select, { Option } from "react-select";
import AsyncSelect from "react-select/async";
import { Controller, FieldErrors, Control } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Visible from "./Visible";

const selectStyle = {
  menu: (provided: object) => ({
    ...provided,
    zIndex: "9",
  }),
  singleValue: (
    provided: object,
    state: { selectProps: { menuIsOpen: boolean } }
  ) => ({
    ...provided,
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
};

interface LabelProps {
  className: string;
  src?: string;
  iconSize?: number;
  isDisabled?: boolean;
  label: string;
  description?: string;
  after?: JSX.Element;
}

export const SelectWithSearchOptionLabel = (props: LabelProps) => {
  return (
    <div className={`${props.className}`}>
      <div
        className="g-row g-nowrap g-align-center"
        style={props.isDisabled ? { opacity: "0.5" } : {}}
      >
        <Visible when={props?.src}>
          <img
            className="icon rounded"
            src={props?.src}
            width={props?.iconSize || 16}
            height={props?.iconSize || 16}
            style={{ flexShrink: 0, marginRight: "5px" }}
          />
        </Visible>
        <span className="g-col" style={{ pointerEvents: "none" }}>
          <span className="ellipsis">{props.label}</span>
          <Visible when={props?.description}>
            <small
              className="m-0.5 opacity-80"
              style={{ marginTop: "5px", opacity: 0.8 }}
            >
              {props?.description}
            </small>
          </Visible>
        </span>
      </div>
      <Visible when={props.after}>{props.after!}</Visible>
    </div>
  );
};

type SelectWithSearchProps = {
  id?: string;
  name: string;
  control?: any;
  errors?: FieldErrors;
  after?: JSX.Element;
  label?: string;
  helper?: string;
  options?: Option[];
  defaultValue?: Option;
  value?: Option;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: any, tag?: string) => void;
  filterOptions?: any;
  getOptions?: any;
  noOptionsMessage?: () => string;
  disabled?: boolean;
  search?: boolean;
  closable?: boolean;
  multiple?: boolean;
  alwaysOn?: boolean;
  required?: boolean;
};

export const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  id,
  name,
  control,
  errors,
  after,
  //callbackRef,
  label,
  helper,
  options,
  defaultValue,
  value,
  placeholder = "Поиск еды",
  className,
  style,
  onChange,
  filterOptions,
  getOptions,
  noOptionsMessage = () => <span>"ничего не найдено"</span>,
  disabled,
  search,
  closable,
  multiple = false,
  alwaysOn = false,
  required = false,
  ...props
}) => {
  return (
    <div className={`form-group ${className}`} style={style}>
      <Visible when={label}>
        <label htmlFor={name || id}>{label}</label>
      </Visible>
      {control ? (
        <Controller
          render={({ field }) => {
            return (
              <>
                <Select
                  {...field}
                  defaultMenuIsOpen={true}
                  onChange={(value: Option | null) => {
                    if (Array.isArray(value)) {
                      const _value = value.map((tag) => tag.value);
                      field.onChange && field.onChange(_value);
                      onChange && onChange(_value);
                    } else if (value!.value) {
                      field.onChange && field.onChange(value.value);
                      onChange && onChange(value.value, value);
                    }
                  }}
                  formatOptionLabel={SelectWithSearchOptionLabel}
                  options={options}
                  placeholder={placeholder || (search ? "Поиск..." : undefined)}
                  className={
                    alwaysOn
                      ? "select-search select-search--multiple"
                      : "select-search"
                  }
                  noOptionsMessage={noOptionsMessage}
                  isDisabled={disabled}
                  isMulti={multiple}
                  isSearchable={search}
                  styles={selectStyle}
                  defaultValue={defaultValue}
                  value={value}
                />
                <Visible when={after}>{after!}</Visible>
              </>
            );
          }}
          name={name}
          control={control}
          rules={
            control &&
            required && {
              required: true,
            }
          }
        />
      ) : (
        <Select
          name={name}
          formatOptionLabel={SelectWithSearchOptionLabel}
          options={options}
          onChange={(value) => {
            //onChange && onChange(value.value, value);
          }}
          defaultValue={defaultValue}
          value={value}
          styles={selectStyle}
          placeholder={placeholder || (search ? "Поиск..." : undefined)}
          className={
            alwaysOn ? "select-search select-search--multiple" : "select-search"
          }
          noOptionsMessage={noOptionsMessage}
          isDisabled={disabled}
          isMulti={multiple}
          isSearchable={search}
        />
      )}
      {control && <ErrorMessage name={name} errors={errors} />}
      <Visible when={Boolean(helper)}>
        <span className="form-message">{helper}</span>
      </Visible>
    </div>
  );
};

type AsyncSelectProps = SelectWithSearchProps & {
  loadOptions?: (inputValue: string) => void;
};

export const SelectWithSearchAsync: React.FC<AsyncSelectProps> = ({
  id,
  name,
  control,
  errors,
  loadOptions,
  after,
  label,
  helper,
  options,
  defaultValue,
  value,
  placeholder = "Поиск еды",
  className,
  style,
  onChange,
  filterOptions,
  getOptions,
  noOptionsMessage = () => <span>"ничего не найдено"</span>,
  disabled,
  search,
  closable = true,
  multiple = false,
  alwaysOn = false,
  required = false,
  ...props
}) => {
  return (
    <div className={`form-group ${className} ${after ? "select-has-after" : ""}`} style={style}>
      <Visible when={label}>
        <label htmlFor={name || id}>{label}</label>
      </Visible>
      {control ? (
        <Controller
          render={({ field }) => {
            return (
              <>
                <AsyncSelect
                  {...field}
                  // defaultMenuIsOpen={true}
                  onChange={(value: Option | null) => {
                    if (Array.isArray(value)) {
                      const _value = value.map((tag) => tag.value);
                      field.onChange && field.onChange(_value);
                      onChange && onChange(_value);
                    } else if (value!.value) {
                      field.onChange && field.onChange(value);
                      onChange && onChange(value.value, value);
                    }
                  }}
                  loadOptions={loadOptions}
                  formatOptionLabel={SelectWithSearchOptionLabel}
                  options={options}
                  placeholder={placeholder || (search ? "Поиск..." : undefined)}
                  className={
                    alwaysOn
                      ? "select-search select-search--multiple"
                      : "select-search"
                  }
                  noOptionsMessage={noOptionsMessage}
                  isDisabled={disabled}
                  isMulti={multiple}
                  isSearchable={search}
                  styles={selectStyle}
                  defaultValue={defaultValue}
                  value={value}
                />
                <Visible when={after}>{after!}</Visible>
              </>
            );
          }}
          name={name}
          control={control}
          rules={
            control &&
            required && {
              required: true,
            }
          }
        />
      ) : (
        <AsyncSelect
          name={name}
          formatOptionLabel={SelectWithSearchOptionLabel}
          options={options}
          onChange={(value: Option | null) => {
            onChange && onChange(value.value, value);
          }}
          loadOptions={loadOptions}
          defaultValue={defaultValue}
          value={value}
          styles={selectStyle}
          placeholder={placeholder || (search ? "Поиск..." : undefined)}
          className={
            alwaysOn ? "select-search select-search--multiple" : "select-search"
          }
          noOptionsMessage={noOptionsMessage}
          isDisabled={disabled}
          isMulti={multiple}
          isSearchable={search}
        />
      )}
      {control && <ErrorMessage name={name} errors={errors} />}
      <Visible when={Boolean(helper)}>
        <span className="form-message">{helper}</span>
      </Visible>
    </div>
  );
};
