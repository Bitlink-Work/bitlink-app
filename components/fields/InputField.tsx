import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";

interface IIpField {
  formField: string;
  placeholder?: string;
  control: any;
  className?: any;
  required?: boolean;
  errorText?: string;
  errors?: any;
  disabled?: boolean;
  maxLength?: number;
}

const InputField = ({
  formField,
  placeholder,
  control,
  className,
  required,
  errorText,
  errors,
  disabled,
  maxLength,
}: IIpField) => {
  const [shrink, setShrink] = useState<boolean>(false);
  const value = useWatch({ control, name: formField });

  return (
    <Controller
      name={formField}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="space-y-1">
          <div
            className={`relative w-full border ${
              errors && errors[formField]
                ? "border-red-500"
                : "border-[#DEDEDE]"
            } rounded ${className}`}
          >
            <div
              className={`absolute ${value ? "z-20" : "z-10"} ${
                errors && errors[formField] && !value
                  ? "text-red-500"
                  : "text-text-secondary"
              } transition-all 
                          ${
                            shrink || value
                              ? "left-2 top-0 translate-y-[-50%] px-2 text-xs"
                              : "left-4 top-4 text-sm"
                          }`}
            >
              <div
                className={`relative
                          font-normal 
                        `}
              >
                <p className="relative z-20">{placeholder}</p>
                <div
                  className={`${
                    shrink || value ? "block" : "hidden"
                  } absolute top-[calc(50%-0.5px)] z-0 h-[1px] w-full -translate-y-[calc(50%-0.5px)] bg-white`}
                ></div>
              </div>
            </div>
            <input
              {...field}
              onFocus={() => setShrink(true)}
              onBlur={() => setShrink(false)}
              className={`w-full bg-transparent p-4 text-sm font-normal leading-6 text-text-primary ${
                !shrink && "relative"
              } z-10 focus:outline-none`}
              disabled={disabled}
              maxLength={maxLength}
            />
          </div>
          {errors && errors[formField] && (
            <p className="m-0 text-xs font-normal text-red-500">{errorText}</p>
          )}
        </div>
      )}
    />
  );
};

export default InputField;
