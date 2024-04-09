import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import MainButton from "../button/MainButton";
import SwitchButton from "../button/SwitchButton";
import SessionTitle from "../title/SessionTitle";

// import logo from "@/images/settings/logo.png";
import { getProfile, updateProfile } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch } from "@/public/hook/hooks";
import { COUNTRY, EnumTypeProfile } from "@/public/utils/constants";
import { CircularProgress } from "@mui/material";
import { Bounce, toast } from "react-toastify";
import SelectField from "../fields/SelectField";
import InputField from "../inputfield/InputField";
const Personal = ({ profile }: any) => {
  const notiPanels = [
    {
      title: "As an issuer",
      options: [
        "When I create & send a new invoice",
        "When an invoice I sent has been accepted",
        "When an invoice I sent has been paid",
      ],
    },
    {
      title: "As the payer of an invoice",
      options: ["When I receive a new invoice", "When I pay an invoice"],
    },
  ];
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profile) {
      setDisable(false);
      setValue("email", profile?.email_google);
      setValue("first_name", profile?.first_name);
      setValue("last_name", profile?.last_name);
    }
  }, [profile]);

  useEffect(() => {
    if (Object.keys(errors)?.length > 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [Object.keys(errors)?.length]);

  const onFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        updateProfile({
          ...profile,
          first_name: data.first_name,
          last_name: data.last_name,
        }),
      );
      if (res) {
        await dispatch(getProfile({}));
        toast.success("Update user type successfully", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Update user type failed", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("up", 0, 0, 0.5)}
        className="space-y-6"
      >
        <SessionTitle title="Individual Settings" small />
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6 rounded-xl border border-[#DEDEDE] bg-white px-8 pb-6 pt-8"
        >
          <InputField
            name={"email"}
            label="My email address"
            register={register}
            errors={errors}
            watch={watch}
            // handleClick={handleEmailClick}
            handleChange={(e) => {
              let rex = new RegExp(
                /^(?!\s+$)(^\s*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/,
              );
              if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                setValue("email", e.target.value);
                setError("email", {
                  message: "Invalid email",
                });
              } else {
                setValue("email", e.target.value);
                clearErrors("email");
              }
            }}
            pattern={
              /^(?!\s+$)(^\s*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/
            }
            setError={setError}
            clearErrors={clearErrors}
            setValue={setValue}
            className=""
            placeholder="My email address"
            required
            type="text"
            widthFull={true}
            readOnly
          />
          <div className="grid grid-cols-2 gap-6">
            <InputField
              name={"first_name"}
              label="First name"
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
                  setValue("first_name", e.target.value);
                  clearErrors("first_name");
                }
              }}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="First name"
              required
              type="text"
              widthFull={true}
              maxLength={50}
            />

            <InputField
              name={"last_name"}
              label="Last name"
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
              placeholder="Last name"
              required
              type="text"
              widthFull={true}
              maxLength={50}
            />
          </div>

          {isLoading ? (
            <button
              className={`ml-auto flex w-fit flex-row items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold leading-[21px] text-white`}
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
              bold
              disabled={disable}
              title="Save Changes"
              className="ml-auto"
              onClick={() => handleSubmit(onFormSubmit)}
            />
          )}
        </form>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn("up", 0, 0, 0.5)}
        >
          <SessionTitle title="Notifications" small />
        </motion.div>
        <div className="flex gap-6">
          {notiPanels.map((panel, index) => (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn(index == 1 ? "left" : "right", 0, 0, 0.5)}
              key={panel.title}
              className="w-full space-y-6 rounded-xl border border-[#DEDEDE] bg-white px-8 py-6"
            >
              <h2 className="text-sm font-medium text-text-primary">
                {panel.title}
              </h2>
              <div className="space-y-4">
                {panel.options.map((option) => (
                  <div key={option} className="flex items-center gap-6">
                    <SwitchButton />
                    <p className=" text-sm font-normal text-text-primary">
                      {option}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Company = ({ profile }: any) => {
  const {
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    register,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: profile,
  });
  const dataCountry: any = [];

  COUNTRY.forEach((country) => {
    dataCountry.push({ label: country.name, value: country.name });
  });

  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (profile) {
      setDisable(false);
      //setValue("email", profile?.email_google);
      setValue("company_name", profile?.company_name);
      setValue("country", profile?.country);
      setValue("region", profile?.region);
      setValue("city", profile?.city);
      setValue("postal_code", profile?.postal_code);
      setValue("address_1", profile?.address_line_1);
      setValue("address_2", profile?.address_line_2);
      setLogo(profile?.logo);
    }
  }, [profile]);

  useEffect(() => {
    if (watch("company_name") !== "" && Object.keys(errors)?.length === 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [watch("company_name"), Object.keys(errors)?.length]);

  const onFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        updateProfile({
          ...profile,
          company_name: data?.company_name,
          country: data?.country,
          region: data?.region,
          city: data?.city,
          postal_code: data?.postal_code,
          address_line_1: data?.address_1,
          address_line_2: data?.address_2,
          logo: logo,
        }),
      );
      if (res) {
        await dispatch(getProfile({}));
        toast.success("Update user type successfully", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Update user type failed", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
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
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("up", 0, 0, 0.5)}
        className="space-y-6"
      >
        <SessionTitle title="Organization Settings" small />
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="w-full space-y-6 rounded-xl border border-[#DEDEDE] bg-white px-8 py-6"
        >
          <div
            className={`relative flex ${
              logo ? "h-[90px]" : "h-[40px] px-3 py-2"
            } relative w-fit items-center justify-center overflow-hidden  bg-white`}
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
                  className="h-full w-full object-contain"
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
                    Upload Logo
                  </p>
                </>
              )}
            </label>
          </div>
          {logo && (
            <button
              onClick={() => setLogo(null)}
              className="text-sm font-medium leading-[21px] text-[#D93F21]"
            >
              Remove logo
            </button>
          )}
          <InputField
            name={"company_name"}
            label="Client's Company Name"
            register={register}
            errors={errors}
            watch={watch}
            handleChange={(e) => {
              setValue("company_name", e.target.value);
              clearErrors("company_name");
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

          <div className="grid grid-cols-3 gap-6">
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
            <InputField
              name={"postal_code"}
              widthFull
              label="Postal Code"
              maxLength={15}
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
            />
            <InputField
              name={"address_1"}
              widthFull
              label="Address Line 1"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "address_1",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("address_1", e.target.value);
                  clearErrors("address_1");
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
              name={"address_2"}
              widthFull
              label="Address Line 2"
              required={false}
              handleChange={(e) => {
                if (e.target.value.trim() === "") {
                  setValue(
                    "address_2",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("address_2", e.target.value);
                  clearErrors("address_2");
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

          {isLoading ? (
            <button
              className={`ml-auto flex w-fit flex-row items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold leading-[21px] text-white`}
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
              bold
              hideBorder
              disabled={disable}
              title="Save Changes"
              className="ml-auto"
              onClick={() => handleSubmit(onFormSubmit)}
            />
          )}
        </form>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn("up", 0, 0, 0.5)}
        >
          <SessionTitle title="Vendor Settings" small />
        </motion.div>
        <div className="flex gap-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("right", 0, 0, 0.5)}
            className="w-full space-y-6 rounded-xl border border-[#DEDEDE] bg-white px-8 py-6"
          >
            <h2 className="text-sm font-medium text-text-primary">
              Who can send bills to you?
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                {/* <SwitchButton /> */}
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="blue"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all checked:border-blue-500 checked:bg-blue-500"
                    id="blue"
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <p className=" text-sm font-normal text-text-primary">
                  Everyone except blocked vendors
                </p>
              </div>
              <div className="flex items-center gap-6">
                {/* <SwitchButton /> */}
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="blue"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all checked:border-blue-500 checked:bg-blue-500"
                    id="blue"
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <p className=" text-sm font-normal text-text-primary">
                  No one except approved vendors
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("left", 0, 0, 0.5)}
            // onSubmit={handleSubmit(onFormSubmit)}
            className="w-full space-y-6 rounded-xl border border-[#DEDEDE] bg-white px-8 py-6"
          >
            <h2 className="text-sm font-medium text-text-primary">
              Blocked Vendors
            </h2>
            <div className="space-y-6">
              <InputField
                name={"vendor_email"}
                label="Vendor's email"
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
                    setValue("vendor_email", e.target.value);
                    setError("vendor_email", {
                      message: "Invalid vendor email",
                    });
                  } else {
                    setValue("vendor_email", e.target.value);
                    clearErrors("vendor_email");
                  }
                }}
                pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
                setError={setError}
                clearErrors={clearErrors}
                setValue={setValue}
                className=""
                placeholder="Vendor's email"
                required
                type="text"
                widthFull={true}
              />

              <MainButton
                disabled={!watch("email")}
                className="ml-auto"
                title="Block a Vendor"
                outline
                bold
                onClick={() => {
                  toast.info("Coming soon!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    transition: Bounce,
                  });
                }}
                // hideBorder
              />
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

const Settings = ({ profile }: any) => {
  return (
    <>
      {profile?.type === EnumTypeProfile.Freelancer ? (
        <Personal profile={profile} />
      ) : (
        <Company profile={profile} />
      )}
    </>
  );
};

export default Settings;
