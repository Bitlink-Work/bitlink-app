"use client";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { createPartner, getProfile, updatePartner } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import noteIcon from "@/public/images/procedure/noteIcon.png";
import { selectProfile } from "@/public/reducers/profileSlice";
import { COUNTRY, EnumTypeProfile } from "@/public/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";
import MainButton from "../button/MainButton";
import SelectField from "../fields/SelectField";
import InputField from "../inputfield/InputField";
import { validateTaxID } from "@/public/utils/lib";

type TypeFormFiled = {
  email: string;
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
  client_type: string;
  client_logo: string;
};

const schema = z.object({
  email: z.string().trim().min(1, { message: "Enter email" }),
  companyName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  country: z.string().trim().min(0, { message: "Choose country" }),
  region: z.string().trim().min(0),
  city: z.string().trim().min(0, { message: "Enter city" }),
  postal: z.string().trim().min(0, { message: "Enter postal code" }),
  address: z.string().trim().min(0, { message: "Enter address" }),
  address1: z.string().trim().min(0, { message: "Enter address" }),
  tax: z.string().trim().min(0, { message: "Enter tax number" }),
  client_type: z.string().trim().min(0, { message: "Choose client type" }),
});

const InvoiceFor = ({ setStepPro, step5Data, setStep5Data }: any) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const [disable, setDisable] = useState(true);
  const router = useRouter();
  const [showDetail, setShowDetail] = useState(false);
  const [logo, setLogo] = useState(dataInvoice?.to_logo);
  const dataCountry: any = [];

  COUNTRY.forEach((country) => {
    dataCountry.push({ label: country.name, value: country.name });
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    control,
    setValue,
    getValues,
    clearErrors,
  } = useForm<TypeFormFiled>({
    values: {
      email: dataInvoice.to_email,
      companyName: dataInvoice.to_company,
      firstName: dataInvoice.to_first_name,
      lastName: dataInvoice.to_last_name,
      country: dataInvoice.to_country,
      region: dataInvoice.to_region,
      city: dataInvoice.to_city,
      postal: dataInvoice.to_postal_code,
      address: dataInvoice.to_address_line_1,
      address1: dataInvoice.to_address_line_2,
      tax: dataInvoice.to_tax_number,
      client_type: dataInvoice.to_type,
      client_logo: dataInvoice.to_logo,
    },
    resolver: zodResolver(schema),
  });
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data: any) => {
    var stepData = { ...step5Data, client: { ...data } };
    setStep5Data(stepData);
    if (dataInvoice.to_id) {
      await dispatch(
        updatePartner({
          partner_id: dataInvoice.to_id,
          partner_email: data.email,
          partner_company: data.companyName,
          partner_first_name: data.firstName,
          partner_last_name: data.lastName,
          partner_region: data.region,
          partner_country: data.country,
          partner_city: data.city,
          partner_postal_code: data.postal,
          partner_address_line1: data.address,
          partner_address_line2: data.address1,
          partner_tax_number: data.tax,
          type: String(data.client_type).toUpperCase(),
          logo: logo,
        }),
      ).then(() => {
        setInvoiceToLocalStorage({
          ...dataInvoice,
          to_email: data.email,
          to_company: data.companyName,
          to_first_name: data.firstName,
          to_last_name: data.lastName,
          to_country: data.country,
          to_region: data.region,
          to_city: data.city,
          to_postal_code: data.postal,
          to_address_line_1: data.address,
          to_address_line_2: data.address1,
          to_tax_number: data.tax,
          to_type: data.client_type,
          to_logo: logo,
          to_id: dataInvoice.to_id,
        });
      });
    } else {
      await dispatch(
        createPartner({
          partner_email: data.email,
          partner_company: data.companyName,
          partner_first_name: data.firstName,
          partner_last_name: data.lastName,
          partner_region: data.region,
          partner_country: data.country,
          partner_city: data.city,
          partner_postal_code: data.postal,
          partner_address_line1: data.address,
          partner_address_line2: data.address1,
          partner_tax_number: data.tax,
          type: String(data.client_type).toUpperCase(),
          logo: logo,
          user_id: profile?.user_id,
        }),
      ).then((value) => {
        setInvoiceToLocalStorage({
          ...dataInvoice,
          to_id: value.payload,
          to_email: data.email,
          to_company: data.companyName,
          to_first_name: data.firstName,
          to_last_name: data.lastName,
          to_country: data.country,
          to_region: data.region,
          to_city: data.city,
          to_postal_code: data.postal,
          to_address_line_1: data.address,
          to_address_line_2: data.address1,
          to_tax_number: data.tax,
          to_type: data.client_type,
          to_logo: logo,
        });
      });
    }

    router.push("/home?step=8");
  };
  const handleUploadLogo = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file.size > 1024 * 1024) {
      toast.error("File is too large! Please select a file smaller than 1MB.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
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

  useEffect(() => {
    if (watch("client_type") === EnumTypeProfile.Freelancer) {
      setShowDetail(true);
      clearErrors("companyName");
    } else if (watch("client_type") === EnumTypeProfile.Business) {
      clearErrors("firstName");
      clearErrors("lastName");
    }
  }, [watch("client_type")]);

  useEffect(() => {
    if (watch("tax") !== "") {
      if (validateTaxID(watch("tax"))) {
        setDisable(false);
      }
    }
    if (watch("client_type") === EnumTypeProfile.Business) {
      if (
        watch("email") &&
        watch("companyName") &&
        Object.keys(errors).length === 0
      ) {
        setDisable(false);
        clearErrors("email");
        clearErrors("companyName");
      } else {
        setDisable(true);
      }
    } else {
      if (
        watch("email") &&
        watch("firstName") &&
        watch("lastName") &&
        Object.keys(errors).length === 0
      ) {
        clearErrors("email");
        setDisable(false);
      } else {
        setDisable(true);
      }
    }
  }, [
    clearErrors,
    errors,
    watch("client_type"),
    watch("email"),
    watch("companyName"),
    watch("firstName"),
    watch("lastName"),
    watch("tax"),
  ]);

  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[1120px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[63%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-between text-[#98999A]">
            <div className="text-[16px] font-normal leading-[24px]">
              Step 5/9
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-[73.5px] flex w-full flex-col items-center gap-y-[60px]"
          >
            <div className={`flex w-full flex-col gap-y-[10px]`}>
              <div className="text-[36px] font-semibold leading-[54px]">
                Who is this invoice for?
              </div>
              <div className="w-full">
                <div className="flex h-[79px] w-full gap-6">
                  <SelectField
                    data={[
                      { label: "Organization", value: "BUSINESS" },
                      {
                        label: "Individual",
                        value: "FREELANCER",
                      },
                    ]}
                    placeholder=""
                    formField="client_type"
                    control={control}
                    setValue={setValue}
                    className="h-[56px] w-[216px]"
                    hideSearch
                  />
                  {/* <TextField
                    // error={errors.email && true}
                    {...register("email")}
                    fullWidth
                    id="outlined-error-helper-text"
                    label="Client Email (required)"
                    helperText={errors.email && errors.email.message}
                    className="h-[56px] p-4"
                  /> */}
                  <InputField
                    name={"email"}
                    label="Client Email (required)"
                    register={register}
                    errors={errors}
                    watch={watch}
                    // handleClick={handleEmailClick}
                    handleChange={(e) => {
                      let rex = new RegExp(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                      );
                      if (
                        !rex.test(e.target.value) ||
                        e.target.value.trim() === ""
                      ) {
                        setValue("email", e.target.value);
                        setError("email", {
                          message: "Invalid email",
                        });
                      } else {
                        setValue("email", e.target.value);
                        clearErrors("email");
                      }
                    }}
                    pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    className=""
                    placeholder="Client Email (required)"
                    required
                    type="text"
                    widthFull={true}
                  />
                </div>
                <div className="mb-[20px] mt-[4px] flex w-full gap-[12px] rounded-[4px] bg-[#FBEBCB] p-[16px]">
                  <div className="h-[24px] w-[24px] overflow-hidden rounded-full">
                    <Image src={noteIcon} alt="note icon" objectFit="cover" />
                  </div>
                  <div className="text-[14px] font-normal leading-[21px]">
                    Your client will be notified via this email.
                  </div>
                </div>
              </div>
              {watch("client_type") === EnumTypeProfile.Business && (
                <div className="h-[79px] w-full">
                  <InputField
                    name={"companyName"}
                    label="Client's Company Name *"
                    register={register}
                    errors={errors}
                    watch={watch}
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
                    // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    className=""
                    placeholder="Client's Company Name *"
                    required
                    type="text"
                    widthFull={true}
                    maxLength={100}
                  />
                </div>
              )}
              {showDetail ? (
                <div className="flex w-full flex-col gap-8">
                  {watch("client_type") === EnumTypeProfile.Freelancer && (
                    <div className={` flex h-[56px] w-full gap-x-[24px]  `}>
                      <InputField
                        name={"firstName"}
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
                            setError("firstName", {
                              message: "Invalid First Name",
                            });
                            setValue(
                              "firstName",
                              e.target.value.replace(/^\s+|\s+$/gm, ""),
                            );
                          } else {
                            setValue("firstName", e.target.value);
                            clearErrors("firstName");
                          }
                        }}
                        // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
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
                      <InputField
                        name={"lastName"}
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
                            setError("lastName", {
                              message: "Invalid First Name",
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
                  )}
                  <div className="flex h-[56px] w-full gap-x-[24px] bg-white">
                    {/* <Controller
                      control={control}
                      name="country"
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth>
                            <InputLabel htmlFor="field.name">
                              Country
                            </InputLabel>
                            <Select
                              label="Country"
                              value={field.value}
                              onChange={field.onChange}
                              id={field.name}
                              style={{ borderColor: "#DEDEDE" }}
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
                      widthFit
                      errors={errors}
                      control={control}
                      setValue={setValue}
                    />
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
                          setValue(
                            "city",
                            e.target.value.replace(/^\s+|\s+$/gm, ""),
                          );
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
                  <div className="flex h-[56px] w-full gap-x-[24px]">
                    <InputField
                      name={"postal"}
                      widthFull
                      label="Postal Code"
                      required={false}
                      handleChange={(e) => setValue("postal", e.target.value)}
                      register={register}
                      errors={errors}
                      watch={watch}
                      maxLength={15}
                      // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
                      setError={setError}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      className=""
                      placeholder="Postal Code"
                      type="text"
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
                      const rex = new RegExp(/^\d{0,15}$/);

                      if (!rex.test(e.target.value)) {
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
                        if (e.target.value.length === 0) {
                          setValue("tax", e.target.value);
                          clearErrors("tax");
                        } else {
                          setError("tax", {
                            message: "Tax number must be 10 digits long",
                          });
                        }

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
                            Upload Client&apos;s Company Logo{" "}
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
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDetail(true)}
                  className="w-full text-center text-[14px] font-medium leading-[21px]"
                >
                  Extended Details
                </button>
              )}
            </div>
            <div className="text-[18px] font-normal leading-[27px]">
              These are requirements. Improve your invoices&apos; compliance for
              tax by entering additional details.
            </div>
            <div className="mt-[28px] flex w-full items-center justify-between">
              <button
                onClick={() => {
                  router.push("/home?step=6");
                }}
                type="button"
                className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
              >
                Back
              </button>
              <MainButton
                title="Continue"
                icon={arrowRight}
                onClick={() => {}}
                bold
                disabled={disable}
              />
            </div>
          </form>
        </div>
      </div>
      <div className=" flex h-full w-full justify-center border-l-[24px] border-solid border-[#DEDEDE] bg-[#fff] md:w-[47%]">
        <div className="flex h-full w-full flex-col p-[60px] md:w-[595px]">
          <div className="w-full border-b-[1px] border-dashed border-[#DEDEDE] py-[60px]">
            <div className="text-[16px] font-semibold leading-[24px]">From</div>
            <div className="mt-[24px] flex items-center gap-x-[16px]">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#BABABB] text-[16px] font-semibold leading-[24px] text-[#FDFCFB]">
                {dataInvoice?.from_type === EnumTypeProfile?.Business
                  ? `${dataInvoice?.from_company?.slice(0, 1)}`
                  : `${dataInvoice?.from_first_name?.slice(0, 1)}
                ${dataInvoice?.from_last_name?.slice(0, 1)}`}
              </div>
              <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
                {dataInvoice?.from_type === EnumTypeProfile?.Business
                  ? `${dataInvoice?.from_company}`
                  : `${dataInvoice?.from_first_name}
                ${dataInvoice?.from_last_name}`}
              </div>
            </div>

            <div className="mt-3 text-sm font-normal leading-[21px] text-[#6A6A6C]">
              {profile?.email_google
                ? profile?.email_google
                : profile?.public_address}
            </div>
            <div className="mt-[12px] text-[20px] font-normal leading-[34px] text-text-secondary"></div>
          </div>
          <div className="w-full border-b-[1px] border-dashed border-[#DEDEDE] py-[60px]">
            <div className="text-[16px] font-semibold leading-[24px]">
              Billed to
            </div>
            <div className="flex flex-col gap-y-[12px]">
              <div className="mt-[24px] text-[14px] font-normal leading-[21px]">
                {watch("email") && <div>{watch("email")}</div>}
              </div>

              <div className="h-[40px] w-[268px] rounded-[8px] bg-[#E9E9E9]"></div>
              <div className="h-[40px] w-[268px] rounded-[8px] bg-[#E9E9E9]"></div>
            </div>
          </div>
          <div className="w-full py-[60px]">
            <div className="text-[16px] font-semibold leading-[24px]">
              Invoice Currency (labeling)
            </div>
            <div className="mt-[24px] h-[80px] w-[236px] rounded-[8px] bg-[#E9E9E9]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceFor;
