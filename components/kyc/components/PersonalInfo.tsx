"use client";
import MainButton from "@/components/button/MainButton";

import InputField from "@/components/inputfield/InputField";
import { getProfile } from "@/public/actions";
import { kycServices } from "@/public/api/kycService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { nextStep, updateKycData } from "@/public/reducers/kycSlices";
import { selectProfile } from "@/public/reducers/profileSlice";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
} from "@/public/utils/lib";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const PersonalInfo = ({ setStep }: any) => {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const { step, kycData } = useAppSelector((state) => state.kyc);
  const [kycInfo, setKycInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    dispatch(
      updateKycData({
        ...kycData,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        email: profile?.email_google,
      }),
    );
  }, [profile]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: kycData?.email || profile?.email_google,
      firstName: kycData?.first_name || profile?.first_name,
      lastName: kycData?.last_name || profile?.last_name,
    },
  });

  const getkycInfo = async () => {
    const res = await kycServices.getKYC(profile?.user_id);
    setKycInfo(res);
  };
  useEffect(() => {
    getkycInfo();
  }, [profile]);

  useEffect(() => {
    if (kycInfo) {
      setReadOnly(true);
      setValue("email", kycInfo?.email);
      setValue("firstName", kycInfo?.first_name);
      setValue("lastName", kycInfo?.last_name);
    }
  }, [kycInfo]);

  const onSubmit = async (data: any) => {
    dispatch(
      updateKycData({
        ...kycData,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      }),
    );

    dispatch(nextStep(2));
  };

  useEffect(() => {
    if (kycInfo) {
      setActive(true);
    } else {
      if (
        watch("firstName") !== "" &&
        watch("lastName") !== "" &&
        watch("email") !== "" &&
        validateEmail(watch("email")) &&
        validateFirstName(watch("firstName")) &&
        validateLastName(watch("lastName"))
      ) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [watch("email"), , watch("firstName"), watch("lastName")]);

  return (
    <div className="my-[24px] px-10">
      <div className="mb-[24px]">
        <div className="">
          <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
            Individual information
          </div>
          <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
            Fill in the parts inside completing the interviewer&apos;s personal.
          </div>
        </div>
      </div>

      <div className="h-[269px] w-full rounded-[12px] border border-solid border-[#DEDEDE] px-[24px]">
        <form>
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <InputField
              name={"firstName"}
              widthFull
              readOnly={readOnly}
              label="First Name"
              register={register}
              errors={errors}
              watch={watch}
              clearErrors={clearErrors}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              setValue={setValue}
              handleChange={(e) => setValue("firstName", e.target.value)}
              className=""
              placeholder="First Name"
              required
              type="text"
            />
            <InputField
              name={"lastName"}
              widthFull
              readOnly={readOnly}
              clearErrors={clearErrors}
              label="Last Name"
              handleChange={(e) => setValue("lastName", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              setValue={setValue}
              className=""
              placeholder="Last Name"
              required
              type="text"
            />
          </div>
          <div className="mt-8">
            <InputField
              // formField="email"
              // placeholder="Email address"
              // required
              // errorText="This field is required"
              // // errors={errors}
              // control={control}
              name={"email"}
              widthFull
              readOnly={readOnly}
              label="Email address"
              clearErrors={clearErrors}
              handleChange={(e) => {
                let rex = new RegExp(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
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
              pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
              register={register}
              errors={errors}
              watch={watch}
              setError={setError}
              setValue={setValue}
              className=""
              placeholder="Email address"
              required
              type="text"
            />
          </div>
        </form>
        <div className="float-right mt-6">
          <MainButton
            onClick={handleSubmit(onSubmit)}
            title="Next"
            disabled={!active}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
