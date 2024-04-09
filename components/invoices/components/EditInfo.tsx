import MainButton from "@/components/button/MainButton";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/inputfield/InputField";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import {
  getProfile,
  updateInvoice,
  updateProfile,
  updateUserType,
} from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import { COUNTRY, EnumTypeProfile } from "@/public/utils/constants";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";

type Props = {
  setShowEditInfo: (show: boolean) => void;
  profile: any;
  edit?: boolean;

  invoiceInfo?: any;
  setInvoiceInfo?: (value: any) => void;
  isOwner?: boolean;
};

// const schema = z.object({
//   company_name: z.string().trim().min(0, { message: "Enter company name" }),
//   first_name: z.string().trim().min(1, { message: "Enter first name" }),
//   last_name: z.string().trim().min(1, { message: "Enter last name" }),
//   country: z.string().trim().min(0, { message: "Choose country" }),
//   region: z.string(),
//   city: z.string().trim().min(0, { message: "Enter city" }),
//   postal_code: z.string().trim().min(0, { message: "Enter postal code" }),
//   address_line_1: z.string().trim().min(0, { message: "Enter address" }),
//   address_line_2: z.string().trim().min(0, { message: "Enter address" }),
//   tax_number: z.string(),
//   type: z.enum([EnumTypeProfile.Business, EnumTypeProfile.Freelancer]),
//   user_id: z.string(),
//   email: z.string().email().trim(),
// });

const EditInfo = ({
  edit,
  invoiceInfo,
  profile,
  setShowEditInfo,
  setInvoiceInfo,
  isOwner,
}: Props) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const listProfileOwner: IProfileOwner[] = useAppSelector(selectListPartners);
  const { setIsOpen } = useInvoiceContext();
  const profileOwner = listProfileOwner.find(
    (element) => element.partner_id === dataInvoice.to_id,
  );

  const dataCountry: any = [];

  COUNTRY.forEach((country) => {
    dataCountry.push({ label: country.name, value: country.name });
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    control,
    formState: { errors },
    clearErrors,
  } = useForm<IProfileUpdate & IProfileUpdateType>({
    values: {
      first_name: isOwner
        ? profileOwner?.partner_first_name || ""
        : profile?.first_name,
      last_name: isOwner
        ? profileOwner?.partner_last_name || ""
        : profile?.last_name,
      company_name: isOwner
        ? profileOwner?.partner_company || ""
        : profile?.company_name,
      country: isOwner ? profileOwner?.partner_country || "" : profile?.country,
      region: isOwner ? profileOwner?.partner_region || "" : profile?.region,
      city: isOwner ? profileOwner?.partner_city || "" : profile?.city,
      postal_code: isOwner
        ? profileOwner?.partner_postal_code || ""
        : profile?.postal_code,
      address_line_1: isOwner
        ? profileOwner?.partner_address_line1 || ""
        : profile?.address_line_1,
      address_line_2: isOwner
        ? profileOwner?.partner_address_line2 || ""
        : profile?.address_line_2,
      public_address: isOwner
        ? profileOwner?.partner_email || ""
        : profile?.public_address,
      tax_number: isOwner
        ? profileOwner?.partner_tax_number || ""
        : String(Number(profile?.tax_number)) === "0"
          ? ""
          : String(Number(profile?.tax_number)),
      user_id: isOwner ? profileOwner?.user_id || "" : profile?.user_id,
      type: isOwner
        ? profileOwner?.type || EnumTypeProfile.Business
        : profile?.type || EnumTypeProfile.Business,
      email: isOwner
        ? profileOwner?.partner_email || ""
        : profile?.email_google || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  const [logo, setLogo] = useState<any>();

  const dispatch = useAppDispatch();
  const handleClose = () => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowEditInfo && setShowEditInfo(false);
    }, 1000);
    return () => clearTimeout(timer);
  };
  const onSubmit = async (data: IProfileUpdate & IProfileUpdateType) => {
    try {
      setIsLoading(true);

      if (data?.type !== profile?.type) {
        if (data?.type === EnumTypeProfile.Business) {
          localStorage.removeItem("isSubmit");
          localStorage.setItem("isSubmit", "0");
        }
        await dispatch(
          updateUserType({
            user_id: profile?.user_id,
            type: data?.type,
          }),
        );
      }

      await dispatch(
        updateProfile({
          ...profile,
          ...data,
          tax_number: Number(data.tax_number),
          logo: logo,
        }),
      ).then(async () => {
        await dispatch(getProfile({}));
      });

      if (edit) {
        await dispatch(
          updateInvoice({
            ...invoiceInfo,
            from_company: data.company_name,
            from_first_name: data.first_name,
            from_last_name: data.last_name,
            from_country: data.country,
            from_region: data.region,
            from_city: data.city,
            from_postal_code: data.postal_code,
            from_address_line_1: data.address_line_1,
            from_address_line_2: data.address_line_2,
            from_tax_number: data.tax_number,
            from_company_logo: logo,
          }),
        );
        await invoiceServices
          .getInvoiceDetail(invoiceInfo?.invoice_id)
          .then((value) => {
            setInvoiceInfo && setInvoiceInfo(value);
          });
      }
      handleClose();
    } catch (error) {
      toast.error("Failed to update user information", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
      handleClose();
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };
  const handleUploadLogo = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file.size > 1024 * 1024) {
      toast.error(
        "File is too large! Please select a file smaller than or equal to 1MB.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        },
      );
      return;
    }
    const fd = new FormData();
    if (fd) {
      fd.append("img_file", e.target.files[0]);
      const res = await invoiceServices.uploadLogo(fd);
      if (res) {
        setLogo(res?.data?.url);
        setInvoiceToLocalStorage({
          ...dataInvoice,
          from_company_logo: res?.data?.url,
        });
      }
    }
  };

  useEffect(() => {
    // const isAllFieldsFilledExceptRegion = (
    //   Object.keys(watchAllFields) as (keyof typeof watchAllFields)[]
    // )
    //   .filter((key) => key !== "region")
    //   .every((key) => watchAllFields[key] !== "");

    // setDisable(!isAllFieldsFilledExceptRegion);
    if (watch("type") === EnumTypeProfile.Business) {
      clearErrors("first_name");
      clearErrors("last_name");
      if (watch("company_name") !== "" && Object.keys(errors).length === 0) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else {
      if (watch("type") === EnumTypeProfile.Freelancer) {
        clearErrors("company_name");
        if (
          watch("first_name") !== "" &&
          watch("last_name") !== "" &&
          Object.keys(errors).length === 0
        ) {
          setDisable(false);
        } else {
          setDisable(true);
        }
      }
    }
  }, [
    watch("type"),
    watch("first_name"),
    watch("last_name"),
    watch("company_name"),
    Object.keys(errors).length,
  ]);

  useEffect(() => {
    if (profile) {
      setLogo(profile?.logo);
    }
  }, [profile]);

  return (
    <div className="flex h-fit w-[800px] flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10">
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        Edit your own information
      </h3>
      <div className="grid h-fit w-full grid-cols-2 items-center gap-[11px]">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <button
              onClick={() => field.onChange(EnumTypeProfile.Business)}
              style={{
                borderColor:
                  watch("type") === EnumTypeProfile.Business
                    ? "#2B4896"
                    : "#BDC6DE",
                backgroundColor:
                  watch("type") === EnumTypeProfile.Business
                    ? "#EAEDF5"
                    : undefined,
              }}
              className={`flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-6 py-4 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#DEDEDE]`}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="16"
                  viewBox="0 0 23 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4083 4.23285C15.4083 6.58254 13.5351 8.4666 11.199 8.4666C8.86292 8.4666 6.98974 6.58254 6.98974 4.23285C6.98974 1.88227 8.86292 0 11.199 0C13.5351 0 15.4083 1.88227 15.4083 4.23285ZM11.199 16C7.76785 16 4.83809 15.456 4.83809 13.2802C4.83809 11.1034 7.74904 10.5396 11.199 10.5396C14.6302 10.5396 17.56 11.0836 17.56 13.2604C17.56 15.4362 14.649 16 11.199 16ZM17.2071 4.30922C17.2071 5.50703 16.8498 6.62288 16.223 7.55051C16.1586 7.64597 16.2159 7.77476 16.3296 7.79457C16.4863 7.82159 16.6484 7.8369 16.8131 7.8414C18.4562 7.88463 19.9309 6.82102 20.3383 5.21974C20.9418 2.84123 19.1698 0.705896 16.9134 0.705896C16.6681 0.705896 16.4335 0.732013 16.2051 0.778845C16.1738 0.78605 16.1407 0.800459 16.1228 0.828378C16.1013 0.862601 16.1174 0.908532 16.1389 0.938252C16.8167 1.8938 17.2071 3.05918 17.2071 4.30922ZM19.9282 9.51257C21.0323 9.72962 21.7584 10.1727 22.0593 10.8166C22.3136 11.3453 22.3136 11.9586 22.0593 12.4864C21.599 13.4851 20.1154 13.8058 19.5387 13.8886C19.4196 13.9066 19.3238 13.8031 19.3364 13.6833C19.6309 10.9157 17.2877 9.60353 16.6815 9.30183C16.6555 9.28832 16.6502 9.2676 16.6528 9.255C16.6546 9.24599 16.6654 9.23158 16.6851 9.22888C17.9968 9.20456 19.4071 9.38468 19.9282 9.51257ZM5.68711 7.84131C5.85186 7.83681 6.01304 7.8224 6.17063 7.79448C6.28434 7.77467 6.34165 7.64588 6.27718 7.55042C5.6504 6.62279 5.29313 5.50694 5.29313 4.30913C5.29313 3.05909 5.68353 1.89371 6.36135 0.938162C6.38284 0.908442 6.39806 0.862511 6.37746 0.828288C6.35956 0.80127 6.32553 0.78596 6.29509 0.778755C6.06586 0.731923 5.83127 0.705806 5.58593 0.705806C3.32951 0.705806 1.55751 2.84114 2.16191 5.21965C2.56932 6.82093 4.04405 7.88454 5.68711 7.84131ZM5.84694 9.25446C5.84962 9.26796 5.84425 9.28778 5.81918 9.30219C5.2121 9.60389 2.86883 10.9161 3.16342 13.6827C3.17595 13.8034 3.08104 13.9061 2.96195 13.889C2.38531 13.8061 0.901629 13.4855 0.441392 12.4867C0.186203 11.9581 0.186203 11.3457 0.441392 10.817C0.742248 10.1731 1.46752 9.72998 2.57156 9.51203C3.09358 9.38504 4.50294 9.20492 5.8156 9.22924C5.8353 9.23194 5.84515 9.24635 5.84694 9.25446Z"
                    fill="#202124"
                  />
                </svg>
              </div>
              <p>Organization</p>
            </button>
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <button
              disabled={profile?.type === EnumTypeProfile.Business}
              onClick={() => field.onChange(EnumTypeProfile.Freelancer)}
              style={{
                borderColor:
                  watch("type") === EnumTypeProfile.Freelancer
                    ? "#2B4896"
                    : "#BDC6DE",
                backgroundColor:
                  watch("type") === EnumTypeProfile.Freelancer
                    ? "#EAEDF5"
                    : undefined,
              }}
              className={`flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-6 py-4 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#DEDEDE] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2126 5.52684C13.2126 8.31705 11.0046 10.5537 8.25 10.5537C5.49543 10.5537 3.28737 8.31705 3.28737 5.52684C3.28737 2.73663 5.49543 0.5 8.25 0.5C11.0046 0.5 13.2126 2.73663 13.2126 5.52684ZM0.75 16.2464C0.75 13.6621 4.20422 13.0152 8.25 13.0152C12.3168 13.0152 15.75 13.6844 15.75 16.2687C15.75 18.8531 12.2948 19.5 8.25 19.5C4.1832 19.5 0.75 18.8298 0.75 16.2464Z"
                    fill="#202124"
                  />
                </svg>
              </div>
              <p>Individual</p>
            </button>
          )}
        />
      </div>
      <form className="flex w-full flex-col items-start gap-6">
        {watch("type") === EnumTypeProfile.Business && (
          <div className="w-full">
            <div className="flex gap-6">
              <InputField
                name={"company_name"}
                widthFull
                label="Company Name *"
                required
                handleChange={(e) => {
                  if (e.target.value.length > 0) {
                    if (e.target.value.trim() !== "") {
                      setValue("company_name", e.target.value);
                      clearErrors("company_name");
                    } else {
                      setError("company_name", {
                        message: "Invalid Company Name",
                      });
                    }
                  } else {
                    setError("company_name", {
                      message: "Company name is required",
                    });
                  }
                }}
                register={register}
                errors={errors}
                watch={watch}
                // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
                setError={setError}
                setValue={setValue}
                className=""
                placeholder="Company Name *"
                type="text"
                maxLength={100}
              />
            </div>
          </div>
        )}
        {watch("type") === EnumTypeProfile.Freelancer && (
          <div className="grid w-full grid-cols-2 gap-8">
            <div className="flex flex-col items-start">
              <InputField
                name={"first_name"}
                label="First name *"
                register={register}
                errors={errors}
                watch={watch}
                handleChange={(e) => {
                  // const rex = new RegExp(/^[a-zA-Z\s]*$/);
                  if (
                    // !rex.test(e.target.value) ||
                    e.target.value.trim() === ""
                  ) {
                    setError("first_name", {
                      message: "Invalid First Name",
                    });
                    setValue(
                      "first_name",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
                  } else {
                    const rex = new RegExp(/\s/);
                    if (rex.test(e.target.value)) {
                      setError("first_name", {
                        message: "Invalid First Name",
                      });
                    } else {
                      setValue("first_name", e.target.value);
                      clearErrors("first_name");
                    }
                  }
                }}
                // pattern={/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
                setError={setError}
                clearErrors={clearErrors}
                setValue={setValue}
                className=""
                placeholder="First name *"
                required
                type="text"
                widthFull={true}
                maxLength={50}
              />
            </div>
            <div className="flex flex-col items-start">
              <InputField
                name={"last_name"}
                label="Last name *"
                register={register}
                errors={errors}
                watch={watch}
                handleChange={(e) => {
                  // const rex = new RegExp(/^[a-zA-Z\s]*$/);
                  if (
                    // !rex.test(e.target.value) ||
                    e.target.value.trim() === ""
                  ) {
                    setError("last_name", {
                      message: "Invalid Last Name",
                    });
                    setValue(
                      "last_name",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
                  } else {
                    setValue("last_name", e.target.value);
                    clearErrors("last_name");
                  }
                }}
                // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
                setError={setError}
                clearErrors={clearErrors}
                setValue={setValue}
                className=""
                placeholder="Last name *"
                required
                type="text"
                widthFull={true}
                maxLength={50}
              />
            </div>
          </div>
        )}

        <div className="grid w-full grid-cols-3 gap-6">
          {/* <Controller
              control={control}
              name="country"
              render={({ field }) => {
                return (
                  <FormControl fullWidth style={{ border: "none" }}>
                    <InputLabel htmlFor="field.name">Country</InputLabel>
                    <Select
                      label="Country"
                      value={field.value}
                      onChange={field.onChange}
                      id={field.name}
                      style={{ border: "none", outline: "none" }}
                    >
                      {COUNTRY.map((element, index) => {
                        return (
                          <MenuItem
                            style={{
                              fontSize: "14px",
                            }}
                            key={index}
                            value={element.name}
                          >
                            {element.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                );
              }}
            /> */}
          <SelectField
            data={dataCountry}
            visibleIcon
            placeholder="Country"
            formField="country"
            searchPlaceholder="Search"
            errors={errors}
            control={control}
            setValue={setValue}
          />

          <div className="flex flex-col items-start">
            <InputField
              name={"region"}
              widthFull
              label="Region / State"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue("region", e.target.value.replace(/^\s+|\s+$/gm, ""));
                } else {
                  setValue("region", e.target.value);
                  clearErrors("region");
                }
              }}
              register={register}
              errors={errors}
              watch={watch}
              // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Region / State"
              type="text"
              maxLength={50}
            />
          </div>
          <div className="flex flex-col items-start">
            <InputField
              name={"city"}
              widthFull
              label="City"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue("city", e.target.value.replace(/^\s+|\s+$/gm, ""));
                  clearErrors("city");
                } else {
                  const rex = new RegExp(/^[a-zA-Z\s]*$/);
                  if (!rex.test(e.target.value)) {
                    setError("city", {
                      message: "Invalid City",
                    });
                    setValue(
                      "city",
                      e.target.value.replace(
                        /^\s+|\s+$[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                        "",
                      ),
                    );
                  } else {
                    setValue("city", e.target.value);
                    clearErrors("city");
                  }
                }
              }}
              register={register}
              errors={errors}
              watch={watch}
              pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="City"
              type="text"
              maxLength={50}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-6">
          <div className="flex flex-col items-start">
            <InputField
              name={"postal_code"}
              widthFull
              label="Postal Code"
              required={false}
              handleChange={(e) => setValue("postal_code", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Postal Code"
              type="text"
              maxLength={15}
            />
          </div>
          <div className="flex flex-col items-start">
            <InputField
              name={"address_line_1"}
              widthFull
              label="Address Line 1"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "address_line_1",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("address_line_1", e.target.value);
                  clearErrors("address_line_1");
                }
              }}
              register={register}
              errors={errors}
              watch={watch}
              // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Address Line 1"
              type="text"
              maxLength={100}
            />
          </div>
          <div className="flex flex-col items-start">
            <InputField
              name={"address_line_2"}
              widthFull
              label="Address Line 2"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "address_line_2",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("address_line_2", e.target.value);
                  clearErrors("address_line_2");
                }
              }}
              register={register}
              errors={errors}
              watch={watch}
              // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Address Line 2"
              type="text"
              maxLength={100}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-start">
          <InputField
            name={"tax_number"}
            widthFull
            label="Tax Number"
            required={false}
            handleChange={(e) => {
              if (e.target.value.trim() === "") {
                setValue(
                  "tax_number",
                  e.target.value.replace(/^\s+|\s+$/gm, ""),
                );
                clearErrors("tax_number");
              } else {
                const rex = new RegExp(/^\d{10,15}$/);
                if (!rex.test(e.target.value)) {
                  setError("tax_number", {
                    message: "Invalid Tax",
                  });
                  setValue(
                    "tax_number",
                    e.target.value.replace(
                      /^[[a-zA-Z]^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                      "",
                    ),
                  );
                } else if (e.target.value.length < 10) {
                  setError("tax_number", {
                    message: "Tax number must be 10 digits long",
                  });
                  setValue(
                    "tax_number",
                    JSON.stringify(parseInt(e.target.value)),
                  );
                } else {
                  setValue(
                    "tax_number",
                    JSON.stringify(parseInt(e.target.value)),
                  );
                  clearErrors("tax_number");
                }
              }
            }}
            register={register}
            errors={errors}
            watch={watch}
            // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
            setError={setError}
            clearErrors={clearErrors}
            setValue={setValue}
            className=""
            placeholder="Tax Number"
            type="text"
            maxLength={15}
            minLength={10}
          />
        </div>
        <div
          className={`relative flex ${
            logo ? "h-[90px]" : "h-[40px] px-3 py-2"
          } relative w-fit items-center justify-center overflow-hidden rounded-lg border border-[#DEDEDE] bg-white`}
        >
          <label
            className="flex h-full w-full cursor-pointer items-center justify-center gap-2"
            htmlFor="file-upload"
          >
            <input
              id="file-upload"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              type="file"
              onChange={(e) => handleUploadLogo(e)}
              accept=".png, .jpg, .jpeg"
            />
            {logo ? (
              <Image
                loader={({ src }) => src}
                className="h-full w-full rounded-lg object-contain"
                width={90}
                height={90}
                src={logo ? logo : ""}
                alt={""}
              />
            ) : (
              <>
                <Image
                  width={24}
                  height={24}
                  src="/images/invoices/upload.svg"
                  alt={""}
                />
                <p className="text-xs font-medium leading-[18px] text-[#202124]">
                  Upload Logo{" "}
                </p>
              </>
            )}
          </label>
        </div>
        {logo && (
          <button
            onClick={() => {
              setLogo("");
              setInvoiceToLocalStorage({
                ...dataInvoice,
                from_company_logo: "",
              });
            }}
            className="text-sm font-medium leading-[21px] text-[#D93F21]"
          >
            Remove logo
          </button>
        )}
        <div className="flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              reset();
              setShowEditInfo && setShowEditInfo(false);
              setIsOpen(false);
            }}
            className="w-fit rounded-lg border border-[#BDC6DE] bg-[#fff] px-6 py-3 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          {isLoading ? (
            <button
              disabled={isLoading}
              className={`flex w-fit flex-row items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white disabled:cursor-not-allowed`}
            >
              <CircularProgress
                style={{
                  color: "#ffffff",
                }}
                size={16}
              />
              <p>Saving...</p>
            </button>
          ) : (
            <MainButton
              title={
                isOwner && !isOwner
                  ? "Save client details"
                  : "Save company details"
              }
              onClick={handleSubmit(onSubmit)}
              disabled={disable}
              bold
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default EditInfo;
