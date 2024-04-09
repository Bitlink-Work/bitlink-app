import { Fade, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";

import arrowDown from "@/images/fields/arrowDown.svg";
import search from "@/images/fields/search.svg";

interface ISelect {
  data: any[];
  listTitle?: any[];
  formField: string;
  placeholder?: string;

  hideSearch?: boolean;
  visibleIcon?: boolean;
  searchPlaceholder?: string;
  control?: any;
  className?: any;
  required?: boolean;
  errorText?: string;
  errors?: any;
  setValue?: any;
  bgPlaceholderTransparent?: boolean;
  large?: boolean;
  readOnly?: boolean;
  widthFit?: boolean;
  initialValue?: boolean;
}

const SelectField = ({
  data,
  listTitle = [],
  formField,
  placeholder,
  hideSearch = false,
  searchPlaceholder = "Search placeholder",
  control,
  visibleIcon = false,
  className,
  required,
  errorText,
  errors,
  setValue,
  large = false,
  readOnly = false,
  widthFit = false,
  initialValue = false,

  bgPlaceholderTransparent = false,
}: ISelect) => {
  const ref = useRef<any>();
  const [multiArr, setMultiArr] = useState(false);
  const [showDropdown, setShowDropdown] = useState<null | HTMLElement>(null);
  const open = Boolean(showDropdown);
  const value = useWatch({ control, name: formField });

  const [label, setLabel] = useState<any>();
  const [subTitle, setSubTitle] = useState<any>();
  const [icon, setIcon] = useState<any>();
  const [searchTerm, setSearchTemp] = useState<string | any>("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (value && value !== "" && data && data.length > 0) {
      setLabel(data.find((item: any) => item.value == value)?.label);
      setSubTitle(data.find((item: any) => item.value == value)?.subTitle);
      setIcon(data.find((item: any) => item.value == value)?.icon);
      if (data.length > 0 && typeof data[0] == "object" && data[0].length >= 0)
        setMultiArr(true);
    } else if (
      (value === undefined || value === null || value === "") &&
      data &&
      data.length > 0
    ) {
      if (initialValue) {
        setLabel(data[0].value);
        setIcon(data[0].icon);
        setSubTitle(data[0].subTitle);
        setValue(formField, data[0].value);
      } else {
        setLabel("");
        setIcon("");
        setSubTitle("");
        setValue(formField, "");
      }
    }
  }, [value]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchTemp(e.target.value);
    // Kiểm tra xem kết quả tìm kiếm có rỗng hay không
    const filteredData = data.filter((item: any) =>
      item.label.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setNotFound(filteredData.length === 0); // Nếu kết quả tìm kiếm rỗng, đặt state "not found" thành true
  };

  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     if (value === undefined || value === null || value === "") {
  //       setLabel(data[0].value);
  //       setIcon(data[0].icon);
  //       setSubTitle(data[0].subTitle);
  //       setValue(formField, data[0].value);
  //     } else {
  //       setLabel(data.find((item: any) => item.value == value)?.label);
  //       setIcon(data.find((item: any) => item.value == value)?.icon);
  //       setSubTitle(data.find((item: any) => item.value == value)?.subTitle);
  //     }
  //   }
  // }, [data]);

  return (
    <Controller
      name={formField}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="max-h-[56px]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              !readOnly && setShowDropdown(e.currentTarget);
            }}
            ref={ref}
            className={`relative flex ${large ? "h-fit" : "h-14"} ${
              widthFit ? "w-[250px]" : ""
            }  cursor-pointer items-center justify-between rounded border p-4 ${
              errors && errors[formField] && !value
                ? "border-red-500"
                : "border-[#DEDEDE]"
            } ${className} bg-white`}
          >
            <div
              className={`absolute ${value ? "z-[2]" : "z-[1]"} ${
                errors && errors[formField] && !value
                  ? "text-red-500"
                  : "text-text-secondary"
              } transition-all 
                          ${
                            showDropdown || label
                              ? `left-2 top-0 translate-y-[-50%] px-2 text-xs ${
                                  bgPlaceholderTransparent
                                    ? "via-white] bg-gradient-to-b from-transparent to-white"
                                    : "bg-white"
                                }`
                              : "left-4 top-4 text-sm"
                          }`}
            >
              <div
                className={`relative
                          font-normal 
                        `}
              >
                <p className="relative z-[1]">{placeholder}</p>
                <div
                  className={`${
                    showDropdown || value ? "block" : "hidden"
                  } absolute top-[calc(50%-0.5px)] z-0 h-[1px] w-full -translate-y-[calc(50%-0.5px)] bg-white`}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {visibleIcon && icon && (
                <div
                  className={`flex ${
                    large === true ? "h-12 w-12" : "h-6 w-6"
                  }  items-center justify-center`}
                >
                  <Image
                    src={icon}
                    alt="icon"
                    objectFit="cover"
                    width={48}
                    height={48}
                    className={`${large === true ? "h-12" : "h-6"} w-auto`}
                  />
                </div>
              )}
              <div>
                {" "}
                <div
                  className={`h-6 font-poppins ${
                    large === true ? "font-semibold" : "font-normal"
                  } text-sm  leading-6 text-text-primary`}
                >
                  {label}
                </div>
                <div className="text-[14px] font-normal leading-[21px] text-[#202124]">
                  {subTitle}
                </div>
              </div>
            </div>

            <Image
              src={arrowDown}
              alt="arrowDown"
              objectFit="cover"
              sizes="24"
              className={`${
                showDropdown && "rotate-180"
              } transition-all duration-200`}
            />
          </div>
          {errors && errors[formField] && !value && (
            <p className="m-0 text-xs font-normal text-red-500">{errorText}</p>
          )}
          <Menu
            id="fade-menu"
            className="mt-1 max-h-[400px] p-0"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={showDropdown}
            onClose={() => setShowDropdown(null)}
            open={open}
            TransitionComponent={Fade}
          >
            {!hideSearch && (
              <div style={{ width: ref.current?.clientWidth, padding: 12 }}>
                <div className="flex w-full items-center gap-[10px] rounded bg-[#E9E9E9] p-3">
                  <Image
                    src={search}
                    alt="search"
                    objectFit="cover"
                    sizes="24"
                  />
                  <input
                    onChange={handleSearch}
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent focus:outline-none"
                    // readOnly={readOnly}
                    value={searchTerm}
                  />
                </div>
              </div>
            )}
            {notFound &&
              searchTerm && ( // Hiển thị thông báo "not found" nếu không có kết quả tìm kiếm
                <MenuItem className="px-3 py-2 text-sm font-normal text-text-primary">
                  Not found
                </MenuItem>
              )}
            {multiArr
              ? data.map((subArr: any, index: number) => (
                  <div key={index}>
                    <p className="px-3 py-2 text-sm font-medium text-text-primary">
                      {listTitle[index]}
                    </p>
                    {subArr
                      .filter((raw: any) =>
                        String(raw.label)
                          .toLowerCase()
                          .includes(searchTerm?.toLowerCase()),
                      )
                      .map((item: any, subIndex: number) => (
                        <MenuItem
                          key={subIndex}
                          className="flex items-center gap-3 p-3 text-sm font-normal text-text-primary"
                          style={{ width: ref.current?.clientWidth }}
                          onClick={() => {
                            setValue(formField, item.value);
                            setLabel(item.label);
                            setShowDropdown(null);
                            setNotFound(false);
                          }}
                        >
                          {item.icon && (
                            <div className="flex h-6 w-6 items-center justify-center">
                              <Image
                                src={item?.icon}
                                alt="icon"
                                objectFit="contain"
                                width={24}
                                height={24}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          {item.label}
                        </MenuItem>
                      ))}
                  </div>
                ))
              : data
                  ?.filter((raw: any) =>
                    String(raw.label)
                      .toLowerCase()
                      .includes(String(searchTerm)?.toLowerCase()),
                  )
                  ?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 text-sm font-normal text-text-primary"
                      style={{ width: ref.current?.clientWidth }}
                      onClick={() => {
                        setValue(formField, item.value);
                        setLabel(item.label);
                        setShowDropdown(null);
                        setNotFound(false);
                      }}
                    >
                      {item.icon && (
                        <div className="flex h-6 w-6 items-center justify-center">
                          <Image
                            src={item?.icon}
                            alt="icon"
                            objectFit="contain"
                            sizes="24"
                            width={24}
                            height={24}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                      {item.label}
                    </div>
                  ))}
          </Menu>
        </div>
      )}
    />
  );
};

export default SelectField;
