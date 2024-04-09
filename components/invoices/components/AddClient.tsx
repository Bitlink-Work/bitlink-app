import MainButton from "@/components/button/MainButton";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/inputfield/InputField";
import { createPartner, getPartner, updatePartner } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import { COUNTRY, EnumTypeProfile } from "@/public/utils/constants";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";

type Props = {
  receiver: any;
  setShowAddClient: (show: boolean) => void;
  type: string;
  profile: any;
  edit?: boolean;
  invoiceInfo?: any;
  setReceiver?: (receiver: any) => void;
};

// const schema = z.object({
//   partner_email: z.string().email().trim(),
//   partner_company: z.string().trim(),
//   partner_first_name: z.string().trim(),
//   partner_last_name: z.string().trim(),
//   partner_country: z
//     .string()
//     .trim()
//     .min(0, { message: "Choose partner_country" }),
//   partner_region: z.string().trim().min(0),
//   partner_city: z.string().trim().min(0, { message: "Enter partner_city" }),
//   partner_postal_code: z
//     .string()
//     .trim()
//     .min(0, { message: "Enter postal code" }),
//   partner_address_line1: z.string().trim().min(0, { message: "Enter address" }),
//   partner_address_line2: z.string().trim().min(0, { message: "Enter address" }),
//   partner_tax_number: z
//     .string()
//     .trim()
//     .min(0, { message: "Enter partner_tax_number number" }),
// });

const AddClient = ({
  receiver,
  setShowAddClient,
  type,
  profile,
  invoiceInfo,
  setReceiver,
}: Props) => {
  const [clientType, setClientType] = useState(EnumTypeProfile.Business);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    unregister,
    formState: { errors, isValid },
    clearErrors,
    control,
  } = useForm({
    mode: "all",
    defaultValues: {
      partner_email: "",
      partner_company: "",
      partner_first_name: "",
      partner_last_name: "",
      partner_country: "",
      partner_region: "",
      partner_city: "",
      partner_postal_code: "",
      partner_address_line1: "",
      partner_address_line2: "",
      partner_tax_number: "",
    },
    // resolver: zodResolver(schema),
  });

  const listPartners = useAppSelector(selectListPartners);
  const [disable, setDisable] = useState(true);
  const [logo, setLogo] = useState("");
  const dispatch = useAppDispatch();
  const dataCountry: any = [];

  COUNTRY.forEach((country) => {
    dataCountry.push({ label: country.name, value: country.name });
  });

  const [isLoading, setIsLoading] = useState(false);
  const [receiverId, setReceiverId] = useState("");

  const handleClose = () => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowAddClient && setShowAddClient(false);
    }, 1000);
    return () => clearTimeout(timer);
  };
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      if (type === "add") {
        const res = await dispatch(
          createPartner({
            ...data,
            user_id: profile?.user_id,
            type: clientType,
            logo: logo,
          }),
        );
        setReceiver &&
          setReceiver({
            ...data,
            partner_id: res?.payload,
            user_id: profile?.user_id,
            type: clientType,
            logo: logo,
          });
        handleClose();
      } else {
        await dispatch(
          updatePartner({
            ...data,
            partner_id: receiver?.partner_id,
            user_id: profile?.user_id,
            type: clientType,
            logo: logo,
          }),
        );
        setReceiver &&
          setReceiver({
            ...data,
            partner_id: receiver?.partner_id,
            user_id: profile?.user_id,
            type: clientType,
            logo: logo,
          });

        await dispatch(getPartner({}));
        handleClose();
      }
    } catch (error) {
      if (type === "add") {
        toast.error("Failed to add client", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
      } else {
        toast.error("Failed to update client", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
      }
      handleClose();
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    if (receiver && Object.keys(receiver).length > 0) {
      setDisable(false);
      setReceiverId(receiver?.partner_id || "");
      setClientType(receiver?.type || "");
      setValue("partner_email", receiver?.partner_email || "");
      setValue("partner_company", receiver?.partner_company || "");
      setValue("partner_first_name", receiver?.partner_first_name || "");
      setValue("partner_last_name", receiver?.partner_last_name || "");
      setValue("partner_country", receiver?.partner_country || "");
      setValue("partner_region", receiver?.partner_region || "");
      setValue("partner_city", receiver?.partner_city || "");
      setValue("partner_postal_code", receiver?.partner_postal_code || "");
      setValue("partner_address_line1", receiver?.partner_address_line1 || "");
      setValue("partner_address_line2", receiver?.partner_address_line2 || "");
      setValue("partner_tax_number", receiver?.partner_tax_number || "");
      setLogo(receiver?.logo || "");
    } else {
      reset();
      setLogo("");
    }
  }, [receiver, reset, setValue]);

  useEffect(() => {
    if (clientType === EnumTypeProfile.Business) {
      clearErrors("partner_first_name");
      clearErrors("partner_last_name");
      if (
        watch("partner_email") === "" ||
        watch("partner_company") === "" ||
        Object.keys(errors).length > 0
      ) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    } else {
      clearErrors("partner_company");
      if (clientType === EnumTypeProfile.Freelancer) {
        if (
          watch("partner_email") === "" ||
          watch("partner_first_name") === "" ||
          watch("partner_last_name") === "" ||
          Object.keys(errors).length > 0
        ) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      }
    }
  }, [
    clientType,
    Object.keys(errors)?.length,
    watch("partner_email"),
    watch("partner_company"),
    watch("partner_first_name"),
    watch("partner_last_name"),
  ]);

  const updateInvoice = async (receiver: any) => {
    await invoiceServices.updateInvoice({
      ...invoiceInfo,
      ...receiver,
    });
  };

  useEffect(() => {
    if (invoiceInfo) {
      const newReceiver = listPartners?.find(
        (partner: any) => partner?.partner_id === receiverId,
      );
      if (newReceiver !== undefined) {
        setReceiver && setReceiver(newReceiver);
        updateInvoice(newReceiver);
      }
    }
  }, [listPartners, invoiceInfo, receiverId]);

  useEffect(() => {
    if (watch("partner_tax_number") === "") {
      clearErrors("partner_tax_number");
      setDisable(true);
    }
  }, [watch("partner_tax_number")]);

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
      }
    }
  };

  return (
    <div className="flex h-fit w-[800px] flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10">
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        {type === "add" ? "Add new client" : "Edit client details"}
      </h3>
      <div className="grid h-fit w-full grid-cols-2 items-center gap-[11px]">
        <button
          onClick={() => setClientType(EnumTypeProfile.Business)}
          className={`flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-6 py-4 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#EAEDF5] ${
            clientType === EnumTypeProfile.Business
              ? "border-[#2B4896] bg-[#EAEDF5]"
              : "border-[#BDC6DE] bg-[#fff]"
          }
          `}
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
        <button
          disabled={
            type === "edit" && receiver?.type === EnumTypeProfile.Business
          }
          onClick={() => setClientType(EnumTypeProfile.Freelancer)}
          className={`flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-6 py-4 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#EAEDF5] ${
            clientType === EnumTypeProfile.Freelancer
              ? "border-[#2B4896] bg-[#EAEDF5]"
              : "border-[#BDC6DE] bg-[#fff]"
          }`}
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
      </div>
      <form className="flex w-full flex-col items-start gap-6" action="">
        <div
          className={` ${
            clientType === EnumTypeProfile.Business
              ? "grid grid-cols-2 gap-8"
              : ""
          } w-full`}
        >
          <div className="flex flex-col items-start">
            <InputField
              name={"partner_email"}
              label="Client Email *"
              register={register}
              errors={errors}
              watch={watch}
              handleChange={(e) => {
                let rex = new RegExp(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                );
                if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                  setValue("partner_email", e.target.value);
                  setError("partner_email", {
                    message: "Invalid email",
                  });
                } else {
                  setValue("partner_email", e.target.value);
                  clearErrors("partner_email");
                }
              }}
              pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Client Email *"
              required
              type="text"
              widthFull={true}
            />
          </div>
          {clientType === EnumTypeProfile.Business && (
            <div className="flex flex-col items-start">
              <InputField
                name={"partner_company"}
                label="Client's Company Name"
                register={register}
                errors={errors}
                watch={watch}
                handleChange={(e) => {
                  setValue("partner_company", e.target.value);
                  clearErrors("partner_company");
                }}
                // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
                setError={setError}
                clearErrors={clearErrors}
                setValue={setValue}
                className=""
                placeholder="Client's Company Name"
                required
                type="text"
                widthFull={true}
                maxLength={100}
              />
            </div>
          )}
        </div>

        {clientType === EnumTypeProfile.Freelancer && (
          <div className="grid w-full grid-cols-2 gap-8">
            <div className="flex flex-col items-start">
              <InputField
                name={"partner_first_name"}
                label="First name *"
                register={register}
                errors={errors}
                watch={watch}
                handleChange={(e) => {
                  const rex = new RegExp(
                    /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                  );
                  if (
                    !rex.test(e.target.value) ||
                    e.target.value.trim() === ""
                  ) {
                    // setError("first_name", {
                    //   message: "Invalid First Name",
                    // });
                    setValue(
                      "partner_first_name",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
                  } else {
                    setValue("partner_first_name", e.target.value);
                    clearErrors("partner_first_name");
                  }
                }}
                pattern={/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
                setError={setError}
                clearErrors={clearErrors}
                setValue={setValue}
                className=""
                placeholder="First name *"
                required
                type="text"
                widthFull={true}
              />
            </div>
            <div className="flex flex-col items-start">
              <InputField
                name={"partner_last_name"}
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
                    setError("partner_last_name", {
                      message: "Invalid Last Name",
                    });
                    setValue(
                      "partner_last_name",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
                  } else {
                    setValue("partner_last_name", e.target.value);
                    clearErrors("partner_last_name");
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
              />
            </div>
          </div>
        )}

        <div className="grid w-full grid-cols-3 gap-4">
          <SelectField
            data={dataCountry}
            visibleIcon
            placeholder="Country"
            formField="partner_country"
            searchPlaceholder="Search"
            errors={errors}
            control={control}
            setValue={setValue}
          />

          <div className="flex flex-col items-start">
            <InputField
              name={"partner_region"}
              widthFull
              label="Region / State"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "partner_region",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("partner_region", e.target.value);
                  clearErrors("partner_region");
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
              name={"partner_city"}
              widthFull
              label="City"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "partner_city",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                  clearErrors("partner_city");
                } else {
                  const rex = new RegExp(/^[a-zA-Z\s]*$/);
                  if (!rex.test(e.target.value)) {
                    setError("partner_city", {
                      message: "Invalid City",
                    });
                    setValue(
                      "partner_city",
                      e.target.value.replace(
                        /^\s+|\s+$[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                        "",
                      ),
                    );
                  } else {
                    setValue("partner_city", e.target.value);
                    clearErrors("partner_city");
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
              placeholder="City"
              type="text"
              maxLength={50}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-4">
          <div className="flex flex-col items-start">
            <InputField
              name={"partner_postal_code"}
              widthFull
              label="Postal Code"
              required={false}
              handleChange={(e) =>
                setValue("partner_postal_code", e.target.value)
              }
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
              name={"partner_address_line1"}
              widthFull
              label="Address Line 1"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "partner_address_line1",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("partner_address_line1", e.target.value);
                  clearErrors("partner_address_line1");
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
              name={"partner_address_line2"}
              widthFull
              label="Address Line 2"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "partner_address_line2",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("partner_address_line2", e.target.value);
                  clearErrors("partner_address_line2");
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
            name={"partner_tax_number"}
            widthFull
            label="Tax Number"
            required={false}
            handleChange={(e) => {
              const rex = new RegExp(/^\d{10,15}$/);
              if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                setError("partner_tax_number", {
                  message: "Invalid Tax",
                });
                setValue(
                  "partner_tax_number",
                  e.target.value.replace(
                    /^[[a-zA-Z]^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                    "",
                  ),
                );
              } else if (e.target.value.length < 10) {
                setError("partner_tax_number", {
                  message: "Tax number must be 10 digits long",
                });
                setValue("partner_tax_number", e.target.value);
              } else {
                setValue("partner_tax_number", e.target.value);
                clearErrors("partner_tax_number");
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
            type="number"
          />
        </div>
        <div
          className={`relative flex ${
            logo ? "h-[90px]" : "h-[40px] px-3 py-2"
          } relative w-fit items-center justify-center overflow-hidden rounded-md border border-[#DEDEDE] bg-white`}
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
                  {clientType === EnumTypeProfile.Business
                    ? "Upload Client's Company Logo"
                    : "Upload Client's Avatar"}
                </p>
              </>
            )}
          </label>
        </div>
        {logo && (
          <button
            onClick={() => setLogo("")}
            className="text-sm font-medium leading-[21px] text-[#D93F21]"
          >
            Remove logo
          </button>
        )}
        <div className="z-0 flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
          <button
            disabled={isLoading}
            type="button"
            onClick={() => {
              if (type === "add") {
                reset();
                setLogo("");
                setClientType(EnumTypeProfile.Business);
              }
              setShowAddClient && setShowAddClient(false);
            }}
            className="w-fit rounded-lg border border-[#BDC6DE] bg-[#fff] px-6 py-3"
          >
            Cancel
          </button>
          {isLoading ? (
            <button
              className={`flex w-fit flex-row items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white`}
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
              title="Save client details"
              onClick={handleSubmit(onSubmit)}
              disabled={disable}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddClient;
