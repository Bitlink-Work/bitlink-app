import MainButton from "@/components/button/MainButton";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/inputfield/InputField";
import { getPartner, updatePartner } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { COUNTRY, EnumTypeProfile } from "@/public/utils/constants";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
type Props = {
  partner: any;
  setShowContactDetail: (value: boolean) => void;
};

const ContactDetail = ({ partner, setShowContactDetail }: Props) => {
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    register,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      partner_email: partner?.partner_email || "",
      partner_company: partner?.partner_company || "",
      partner_first_name: partner?.partner_first_name || "",
      partner_last_name: partner?.partner_last_name || "",
      partner_region: partner?.partner_region || "",
      partner_country: partner?.partner_country || "",
      partner_city: partner?.partner_city || "",
      partner_postal_code: partner?.partner_postal_code || "",
      partner_address_line1: partner?.partner_address_line1 || "",
      partner_address_line2: partner?.partner_address_line2 || "",
      partner_tax_number: partner?.partner_tax_number || "",
      logo: partner?.logo || "",
    },
  });

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const [logo, setLogo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (partner) {
      setValue("partner_email", partner?.partner_email || "");
      setValue("partner_company", partner?.partner_company || "");
      setValue("partner_first_name", partner?.partner_first_name || "");
      setValue("partner_last_name", partner?.partner_last_name || "");
      setValue("partner_country", partner?.partner_country || "");
      setValue("partner_region", partner?.partner_region || "");
      setValue("partner_city", partner?.partner_city || "");
      setValue("partner_postal_code", partner?.partner_postal_code || "");
      setValue("partner_address_line1", partner?.partner_address_line1 || "");
      setValue("partner_address_line2", partner?.partner_address_line2 || "");
      setValue("partner_tax_number", partner?.partner_tax_number || "");
      setLogo(partner?.logo || "");
    }
  }, [partner]);

  const handleClose = async () => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContactDetail && setShowContactDetail(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await dispatch(
        updatePartner({
          ...data,
          partner_id: partner?.partner_id,
          user_id: profile?.user_id,
          logo: logo,
        }),
      );

      await dispatch(getPartner({}));
      handleClose();
    } catch (error) {
      toast.error("Failed to update client", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
      handleClose();
    } finally {
      handleClose();
    }
  };

  const handleUploadLogo = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    if (fd) {
      fd.append("img_file", e.target.files[0]);
      const res = await invoiceServices.uploadLogo(fd);
      if (res) {
        setLogo(res?.data?.url);
      }
    }
  };

  const dataCountry: any = [];

  COUNTRY.forEach((country) => {
    dataCountry.push({ label: country.name, value: country.name });
  });

  return (
    <div className="flex w-fit flex-col items-start justify-start gap-8 rounded-xl border border-[#DEDEDE] bg-white p-6">
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Contact Detail
        </h2>
        <div className="flex w-fit flex-row items-center justify-center gap-2 rounded border-l-[1.5px] border-l-[#2B4896] bg-[#2B48961F] px-3 py-2 text-xs font-medium leading-[18px] text-text-primary">
          {partner?.type === "FREELANCER" ? (
            <Image
              src="/images/howtobuy/icPerson.png"
              width={24}
              height={24}
              alt={""}
            />
          ) : (
            <Image
              src="/images/howtobuy/icGroup.png"
              width={24}
              height={24}
              alt={""}
            />
          )}
          <p>
            {partner?.type === EnumTypeProfile.Business
              ? "Organization"
              : "Individual"}
          </p>
        </div>
      </div>
      <form className="flex w-full flex-col items-start gap-6" action="">
        <div
          className={` ${
            partner?.type === EnumTypeProfile.Business
              ? "grid grid-cols-2 gap-8"
              : ""
          } w-full`}
        >
          <div className="flex flex-col items-start">
            <InputField
              name={"partner_email"}
              label="Client Email (required)"
              register={register}
              errors={errors}
              watch={watch}
              // handleClick={handleEmailClick}
              handleChange={(e) => {
                let rex = new RegExp(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                );
                if (!rex.test(e.target.value)) {
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
              placeholder="Client Email (required)"
              required
              type="text"
              widthFull={true}
            />
          </div>
          {partner?.type === EnumTypeProfile.Business && (
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
        {partner?.type === EnumTypeProfile.Freelancer && (
          <div className="grid w-full grid-cols-2 gap-8">
            <div className="flex flex-col items-start">
              <InputField
                name={"partner_first_name"}
                label="First name *"
                register={register}
                errors={errors}
                watch={watch}
                handleChange={(e) => {
                  const rex = new RegExp(/^[a-zA-Z\s]*$/);
                  if (!rex.test(e.target.value)) {
                    setError("partner_first_name", {
                      message: "Invalid First Name",
                    });
                    setValue(
                      "partner_first_name",
                      e.target.value.replace(
                        /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                        "",
                      ),
                    );
                  } else {
                    setValue("partner_first_name", e.target.value);
                    clearErrors("partner_first_name");
                  }
                }}
                pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
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
                  const rex = new RegExp(/^[a-zA-Z\s]*$/);
                  if (!rex.test(e.target.value)) {
                    setError("partner_last_name", {
                      message: "Invalid Last Name",
                    });
                    setValue(
                      "partner_last_name",
                      e.target.value.replace(
                        /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                        "",
                      ),
                    );
                  } else {
                    setValue("partner_last_name", e.target.value);
                    clearErrors("partner_last_name");
                  }
                }}
                pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
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
                const rex = new RegExp(/^[a-zA-Z\s]*$/);
                if (!rex.test(e.target.value)) {
                  setError("partner_region", {
                    message: "Invalid Region / State",
                  });
                  setValue(
                    "partner_region",
                    e.target.value.replace(
                      /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                      "",
                    ),
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
            />
          </div>
          <div className="flex flex-col items-start">
            <InputField
              name={"partner_city"}
              widthFull
              label="City"
              required={false}
              handleChange={(e) => {
                const rex = new RegExp(/^[a-zA-Z\s]*$/);
                if (!rex.test(e.target.value)) {
                  setError("partner_city", {
                    message: "Invalid City",
                  });
                  setValue(
                    "partner_city",
                    e.target.value.replace(
                      /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                      "",
                    ),
                  );
                } else {
                  setValue("partner_city", e.target.value);
                  clearErrors("partner_city");
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
              type="number"
              maxLength={15}
            />
          </div>
          <div className="flex flex-col items-start">
            <InputField
              name={"partner_address_line1"}
              widthFull
              label="Address Line 1"
              required={false}
              handleChange={(e) =>
                setValue("partner_address_line1", e.target.value)
              }
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
          </div>
          <div className="flex flex-col items-start">
            <InputField
              name={"partner_address_line2"}
              widthFull
              label="Address Line 2"
              required={false}
              handleChange={(e) =>
                setValue("partner_address_line2", e.target.value)
              }
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
        </div>
        <div className="flex w-full flex-col items-start">
          <InputField
            name={"partner_tax_number"}
            widthFull
            label="Tax Number"
            required={false}
            handleChange={(e) => {
              const rex = new RegExp(/^[0-9]*$/);
              if (!rex.test(e.target.value)) {
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
        <div className="flex flex-row items-center justify-start gap-6">
          {logo && (
            <div className="h-14 w-14">
              <Image
                loader={({ src }) => src}
                className="h-full w-full object-contain"
                width={56}
                height={56}
                src={logo ? logo : ""}
                alt={""}
              />
            </div>
          )}
          <div
            className={`relative cursor-pointer rounded-md border border-[#DEDEDE] bg-white px-3 py-2`}
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

              <>
                <Image
                  width={24}
                  height={24}
                  src="/images/invoices/upload.svg"
                  alt={""}
                />
                <p className="text-xs font-medium leading-[18px] text-[#202124]">
                  {logo ? "Reset logo" : "Upload Logo"}
                </p>
              </>
            </label>
          </div>
        </div>
      </form>
      <div className="z-0 flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
        <button
          disabled={isLoading}
          type="button"
          onClick={async () => {
            // await reset();
            setShowContactDetail && setShowContactDetail(false);
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
            <p>...Saving</p>
          </button>
        ) : (
          <MainButton
            title="Save client details"
            onClick={handleSubmit(onSubmit)}
            // disabled={!isValid}
          />
        )}
      </div>
    </div>
  );
};

export default ContactDetail;
