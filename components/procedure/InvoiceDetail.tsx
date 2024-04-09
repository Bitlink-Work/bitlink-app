"use client";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { getProfile, updateProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import { selectProfile } from "@/public/reducers/profileSlice";
import { COUNTRY, EnumTypeProfile } from "@/public/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MainButton from "../button/MainButton";
import SelectField from "../fields/SelectField";
import InputField from "../inputfield/InputField";

type TypeFormFiled = {
  companyName: string;
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  city: string;
  postal: string;
  address: string;
  address1: string;
  tax: string;
};

const schema = z.object({
  companyName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  country: z.string().trim().min(0, { message: "Choose country" }),
  region: z.string(),
  city: z.string().trim().min(0, { message: "Enter city" }),
  postal: z.string().trim().min(0, { message: "Enter postal code" }),
  address: z.string().trim().min(0, { message: "Enter address" }),
  address1: z.string().trim().min(0, { message: "Enter address" }),
  tax: z.string().trim(),
});

const InvoiceDetail = ({ setStepPro, setStep3Data }: any) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<TypeFormFiled>({
    values: {
      companyName: dataInvoice.from_company,
      firstName: dataInvoice.from_first_name,
      lastName: dataInvoice.from_last_name,
      country: dataInvoice.from_country,
      region: dataInvoice.from_region,
      city: dataInvoice.from_city,
      postal: dataInvoice.from_postal_code,
      address: dataInvoice.from_address_line_1,
      address1: dataInvoice.from_address_line_2,
      tax: dataInvoice.from_tax_number,
    },
    resolver: zodResolver(schema),
  });
  const [disable, setDisable] = useState(false);
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  const dataCountry: any = [];

  COUNTRY.forEach((country) => {
    dataCountry.push({ label: country.name, value: country.name });
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  const [isBack, setIsBack] = useState(false);

  // const watchAllFields = watch();
  useEffect(() => {
    // const isAllFieldsFilledExceptRegion = (
    //   Object.keys(watchAllFields) as (keyof typeof watchAllFields)[]
    // )
    //   .filter((key) => key !== "region")
    //   .every((key) => watchAllFields[key] !== "");

    // setDisable(!isAllFieldsFilledExceptRegion);
    if (dataInvoice.from_type === EnumTypeProfile.Business) {
      if (watch("companyName") !== "" && Object.keys(errors).length === 0) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else {
      if (dataInvoice.from_type === EnumTypeProfile.Freelancer) {
        if (
          watch("firstName") !== "" &&
          watch("lastName") !== "" &&
          Object.keys(errors).length === 0
        ) {
          setDisable(false);
        } else {
          setDisable(true);
        }
      }
    }
  }, [
    watch("firstName"),
    watch("lastName"),
    watch("companyName"),
    Object.keys(errors).length,
  ]);

  useEffect(() => {
    if (watch("tax") === "") {
      clearErrors("tax");
      setDisable(true);
    }
  }, [watch("tax")]);
  const router = useRouter();

  const handleClick = () => {
    router.push("/home?step=6");
  };
  const onSubmit = async (data: any) => {
    if (isBack) {
      router.push("/home?step=4");
    } else {
      await dispatch(
        updateProfile({
          ...profile,
          first_name: data?.firstName,
          last_name: data?.lastName,
          company_name: data?.companyName,
          country: data?.country,
          region: data?.region,
          city: data?.city,
          postal_code: data?.postal,
          address_line_1: data?.address,
          address_line_2: data?.address1,
          public_address: profile?.public_address || "",
          tax_number: Number(data?.tax) || 0,
        }),
      ).then(() => {
        setInvoiceToLocalStorage({
          ...dataInvoice,
          from_company: data?.companyName,
          from_first_name: data?.firstName,
          from_last_name: data?.lastName,
          from_country: data?.country,
          from_region: data?.region,
          from_city: data?.city,
          from_postal_code: data?.postal,
          from_address_line_1: data?.address,
          from_address_line_2: data?.address1,
          from_tax_number: data?.tax,
        });
      });
      setStep3Data(data);
      handleClick();
    }
  };

  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[63%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-between text-[#98999A]">
            <div className="text-[16px] font-normal leading-[24px]">
              Step 3/9
            </div>
            <button
              onClick={() => {
                if (profile) {
                  localStorage.removeItem("dataInvoice");
                  localStorage.removeItem("logoUrl");
                  localStorage.removeItem("dataChain");
                  localStorage.removeItem("dataPaid");
                  router.push("/dashboard");
                }
              }}
              className="text-[14px] font-semibold leading-[21px]"
            >
              Skip the tour
            </button>
          </div>
          <div className="mt-[51.5px] text-[36px] font-semibold leading-[54px]">
            Check your details
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-[60px] flex flex-col items-center justify-center gap-8"
          >
            {dataInvoice.from_type === EnumTypeProfile.Business && (
              <InputField
                name={"companyName"}
                widthFull
                label="Company Name *"
                required
                handleChange={(e) => {
                  if (e.target.value.length > 0) {
                    if (e.target.value.trim() !== "") {
                      setValue("companyName", e.target.value);
                      clearErrors("companyName");
                    } else {
                      setError("companyName", {
                        message: "Invalid Company Name",
                      });
                    }
                  } else {
                    setError("companyName", {
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
            )}
            {dataInvoice.from_type === EnumTypeProfile.Freelancer && (
              <div className="flex w-full items-center gap-x-[24px]">
                <InputField
                  name={"firstName"}
                  widthFull
                  label="First name *"
                  required
                  handleChange={(e) => {
                    const rex = new RegExp(/^[^\s]+$/);

                    if (
                      !rex.test(e.target.value) ||
                      e.target.value.trim() === ""
                    ) {
                      // setError("firstName", {
                      //   message: "Invalid First Name",
                      // });
                      setValue(
                        "firstName",
                        e.target.value.replace(/^\s+|\s+$/gm, ""),
                      );
                    } else {
                      setValue("firstName", e.target.value);
                      clearErrors("firstName");
                    }
                  }}
                  register={register}
                  errors={errors}
                  watch={watch}
                  // pattern={/^[a-z ,.'-]+$/i}
                  setError={setError}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  className=""
                  placeholder="First Name *"
                  type="text"
                  maxLength={50}
                />
                <InputField
                  name={"lastName"}
                  widthFull
                  label="Last name *"
                  required
                  handleChange={(e) => {
                    // const rex = new RegExp(/^[a-zA-Z\s]*$/);
                    if (
                      // !rex.test(e.target.value) ||
                      e.target.value.trim() === ""
                    ) {
                      setError("lastName", {
                        message: "Invalid Last Name",
                      });
                      setValue(
                        "lastName",
                        e.target.value.replace(/^\s+|\s+$/gm, ""),
                      );
                    } else {
                      setValue("lastName", e.target.value);
                      clearErrors("lastName");
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
                  placeholder="Last Name *"
                  type="text"
                  maxLength={50}
                />
              </div>
            )}
            <div className="flex w-full items-center gap-x-[24px]">
              <div className="h-[56px] w-full rounded bg-white">
                <SelectField
                  data={dataCountry}
                  searchPlaceholder="Search"
                  visibleIcon
                  placeholder="Country"
                  formField="country"
                  errors={errors}
                  control={control}
                  setValue={setValue}
                />
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
                {/* <div
                  className={`flex h-[56px] w-full items-center justify-between rounded-[4px] border-[1px] border-solid p-[16px] `}
                >
                  <input
                    className="w-full border-none bg-transparent outline-none text-sm font-normal leading-[21px] text-[#444445]"
                    placeholder="Country"
                    type="text"
                    {...register("country")}
                  />
                  <div className="h-[24px] w-[24px] cursor-pointer">
                    <Image src={arrowDown} alt="arrow down" objectFit="cover" />
                  </div>
                </div> */}
                {/* <div className="mt-[4px] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                  {errors.country && errors.country.message}
                </div> */}
              </div>
              {/* <div className="h-[78px] w-full">
                <div
                  className={`h-[56px] w-full rounded-[4px] border-[1px] border-solid border-[#DEDEDE] p-[16px]`}
                >
                  <input
                    className="w-full border-none bg-transparent text-sm font-normal leading-[21px] text-[#444445] outline-none"
                    placeholder="Region / State"
                    type="text"
                    {...register("region")}
                  />
                </div> */}
              {/* <div className="mt-[4px] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                  {errors.region && errors.region.message}
                </div> */}
              {/* </div> */}
              <InputField
                name={"region"}
                widthFull
                label="Region / State"
                required={false}
                handleChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setValue(
                      "region",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
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
              <InputField
                name={"city"}
                widthFull
                label="City"
                required={false}
                handleChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setValue("city", e.target.value.replace(/^\s+|\s+$/gm, ""));
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
            <div className="flex w-full items-center gap-x-[24px]">
              <InputField
                name={"postal"}
                widthFull
                label="Postal Code"
                required={false}
                handleChange={(e) => setValue("postal", e.target.value)}
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
              <InputField
                name={"address"}
                widthFull
                label="Address Line 1"
                required={false}
                handleChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setValue(
                      "address",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
                  } else {
                    setValue("address", e.target.value);
                    clearErrors("address");
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

              <InputField
                name={"address1"}
                widthFull
                label="Address Line 2"
                required={false}
                handleChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setValue(
                      "address1",
                      e.target.value.replace(/^\s+|\s+$/gm, ""),
                    );
                  } else {
                    setValue("address1", e.target.value);
                    clearErrors("address1");
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
              />
            </div>
            <InputField
              name={"tax"}
              widthFull
              label="Tax Number"
              required={false}
              handleChange={(e) => {
                const rex = new RegExp(/^\d{10,15}$/);

                if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                  setError("tax", {
                    message: "Invalid Tax",
                  });
                  setValue(
                    "tax",
                    e.target.value.replace(
                      /^[[a-zA-Z]^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                      "",
                    ),
                  );
                } else if (e.target.value.length < 10) {
                  setError("tax", {
                    message: "Tax number must be 10 digits long",
                  });
                  setValue("tax", e.target.value);
                } else {
                  setValue("tax", e.target.value);
                  clearErrors("tax");
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

            <div className="text-[14px] font-normal leading-[21px]">
              Your invoices and other communications will include this
              information. The more information you provide, the easier it will
              be to manage your paper trall in a compliant maner.
            </div>
            <div className="mt-[28px] flex w-full items-center justify-between">
              <button
                onClick={() => {
                  router.push("/home?step=4");
                  setIsBack(true);
                }}
                className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
              >
                Back
              </button>
              <MainButton
                title="Continue"
                icon={arrowRight}
                bold
                disabled={disable}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="flex h-full w-full justify-center border-l-[24px] border-solid border-[#DEDEDE] bg-[#fff] p-[60px] md:w-[47%]">
        <div className="flex h-full w-full items-end md:w-[595px]">
          <div className="w-full border-b-[1px] border-dashed border-[#DEDEDE] py-[60px] text-[20px] font-normal leading-[34px] text-[#6a6a6c]">
            <div className="text-base font-semibold leading-[24px] text-[#202124]">
              From
            </div>
            <div className="mt-[24px] flex flex-col gap-y-[12px] text-sm font-normal leading-[21px] text-[#444445]">
              {profile?.type === EnumTypeProfile.Freelancer ? (
                <div className="flex items-center gap-x-[16px]">
                  {(watch("firstName") || watch("lastName")) && (
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#BABABB] text-base font-semibold uppercase leading-[24px] text-[#FDFCFB]">
                      {watch("firstName").slice(0, 1)}
                      {watch("lastName").slice(0, 1)}
                    </div>
                  )}
                  <div className="flex items-center gap-x-[5px] text-sm font-normal leading-[21px] text-[#444445]">
                    <p>{watch("firstName")} </p>
                    {watch("lastName")}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-[16px]">
                  {watch("companyName") && (
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#BABABB] text-base font-semibold uppercase leading-[24px] text-[#FDFCFB]">
                      {watch("companyName").slice(0, 1)}
                    </div>
                  )}
                  <div className="flex items-center gap-x-[5px] text-sm font-normal leading-[21px] text-[#444445]">
                    {watch("companyName")}
                  </div>
                </div>
              )}
              {watch("region") && <p>{watch("region")}</p>}
              {watch("country") && <p>{watch("country")}</p>}
              {watch("postal") && (
                <p>
                  {watch("postal")}{" "}
                  {watch("city") && <span>{watch("city")}</span>}{" "}
                </p>
              )}
              {watch("address") && <p>{watch("address")}</p>}
              {watch("address1") && <p>{watch("address1")}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceDetail;
