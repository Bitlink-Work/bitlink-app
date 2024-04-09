import calendarIcon from "@/images/kyb/Calendar.svg";
import { useAppSelector } from "@/public/hook/hooks";
import moment from "moment";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "react-datepicker2";

type InputFieldProps = {
  name: string;
  label?: string;
  register?: any;
  errors?: any;
  watch?: any;
  handleClick?: (value: any) => void;
  pattern?: any;
  setError?: any;
  setValue?: any;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  widthFull?: boolean;
  widthFit?: boolean;
  readOnly?: boolean;
  type?: string;
  icon?: any;
  handleIconClick?: (value: any) => void;
  handleChange?: (value: any) => void;
  bgColor?: string;
  maxLength?: number;
  minLength?: number;
  clearErrors?: any;
};

const InputField = ({
  readOnly = false,
  name,
  label,
  register,
  errors,
  watch,
  handleClick,
  pattern,
  setError,
  setValue,
  widthFull = false,
  widthFit = false,
  className,
  placeholder,
  required = false,
  disabled,
  type,
  icon,
  handleIconClick,
  handleChange,
  maxLength,
  minLength,
  clearErrors,
}: InputFieldProps) => {
  const pathname = usePathname();

  const { kycData } = useAppSelector((state) => state.kyc);
  const { kybData } = useAppSelector((state) => state.kyb);
  const formattedDate = moment(
    pathname === "/kyc" ? kycData.dob : kybData.dob,
    "MM/DD/YYYY",
  );

  const [selectedDate, setSelectedDate] = useState<any>(
    formattedDate.format("MM/DD/YYYY") === "Invalid date"
      ? null
      : formattedDate,
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<any>(null);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    setValue(name, date.format("MM/DD/YYYY"));
  };

  const handleClickOutside = (event: any) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={calendarRef}
      className={`relative h-[56px] ${
        widthFull ? "w-full " : widthFit ? "w-[250px]" : "w-[400px] "
      } rounded border-[1px] border-solid  ${
        errors && errors[`${name}`]?.message
          ? "border-red-500"
          : "border-[#DEDEDE]"
      } bg-white p-[16px]`}
    >
      <div
        className={`absolute ${watch(`${name}`) ? "z-20" : "z-10"}
          ${
            errors &&
            errors[`${name}`]?.message &&
            watch(`${name}`) &&
            watch(`${name}`).length > 0
              ? "text-red-500"
              : "text-text-secondary"
          }
                          ${
                            watch(`${name}`)
                              ? "left-2 top-0 translate-y-[-50%] px-2 text-xs"
                              : "left-4 top-[50%] translate-y-[-50%]  text-sm"
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
              watch(`${name}`) ? "block" : "hidden"
            } absolute top-[calc(50%)] z-0 h-[2px] w-full -translate-y-[calc(50%+0.5px)] bg-white`}
          ></div>
        </div>
      </div>
      {type === "date" ? (
        <div className="relative">
          <input
            {...register(`${name}`)}
            className="relative z-10 w-full border-none bg-transparent text-sm font-normal text-text-primary outline-none placeholder:text-[#6A6A6C]"
            type="text"
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={selectedDate ? selectedDate.format("MM/DD/YYYY") : ""}
            // onFocus={() => setShowCalendar(true)}
            onChange={(e) => handleChange && handleChange(e)}
            onBlur={(e) => {
              if (required === true && e.target.value === "") {
                setError(`${name}`, {
                  message: `${String(
                    label &&
                      label?.replace("*", "").charAt(0).toUpperCase() +
                        label?.replace("*", "").slice(1),
                  )} is required`,
                });
              } else {
                var currentDate = new Date();
                var dobDate = new Date(e.target.value);
                const rex = new RegExp(pattern);

                if (!rex.test(e.target.value) || dobDate > currentDate) {
                  setError(`${name}`, {
                    message: `Invalid ${label?.replace("*", "")} `,
                  });
                } else {
                  setValue(`${name}`, e.target.value);
                  clearErrors(`${name}`);
                }
              }
            }}
          />
          <div className=" ">
            <Image
              className="absolute right-0 top-0 z-20 cursor-pointer"
              onClick={() => {
                setShowCalendar(true);
              }}
              src={calendarIcon}
              alt="calendarIcon"
            />
          </div>
          {showCalendar && (
            <div className="absolute -left-4 z-20 ">
              <Calendar value={selectedDate} onChange={handleDateChange} />
            </div>
          )}
        </div>
      ) : (
        <input
          {...register(`${name}`)}
          type={type}
          className="relative z-10 w-full border-none bg-transparent  text-sm font-normal text-text-primary outline-none placeholder:text-[#6A6A6C]"
          // placeholder={placeholder}
          onClick={handleClick}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          readOnly={readOnly}
          onChange={(e) => {
            handleChange && handleChange(e);
          }}
          onBlur={(e) => {
            if (required === true && e.target.value === "") {
              setError(`${name}`, {
                message: `${String(
                  label &&
                    label?.replace("*", "").charAt(0).toUpperCase() +
                      label?.replace("*", "").slice(1),
                )} is required`,
              });
            } else {
              if (pattern) {
                const rex = new RegExp(pattern);
                if (!rex.test(e.target.value)) {
                  setError(`${name}`, {
                    message: `Invalid ${label?.replace("*", "")} `,
                  });
                } else {
                  setValue(`${name}`, e.target.value);
                  clearErrors(`${name}`);
                }
              }
            }
          }}
          disabled={disabled}
        />
      )}
      {icon && (
        <button
          type="button"
          onClick={(e) => handleIconClick && handleIconClick(e)}
          className="absolute right-[16px] top-[50%] z-10 h-6 w-6 -translate-y-1/2 transform bg-white"
        >
          <Image className="" src={icon} width={24} height={24} alt="" />
        </button>
      )}
      <p className="absolute left-0 top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
        {errors[`${name}`] && errors[`${name}`]?.message
          ? `${errors[`${name}`]?.message}`
          : ""}
      </p>
    </div>
  );
};

export default InputField;
