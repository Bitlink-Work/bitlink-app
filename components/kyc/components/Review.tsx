"use client";
import MainButton from "@/components/button/MainButton";
import { getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import InputField from "@/components/inputfield/InputField";
import Popup from "@/components/popup/Popup";
import { useInstructionsContext } from "@/context/InstructionsProvider";
import { kycServices } from "@/public/api/kycService";
import { prevStep, updateKycData } from "@/public/reducers/kycSlices";
import {
  formatDate,
  validateDob,
  validateEmail,
  validateFirstName,
  validateIDNumber,
  validateLastName,
} from "@/public/utils/lib";
import ConfirmKYC from "./ConfirmKYC";

const schema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  card_number: yup.string().required(),
  email: yup.string().required(),
  dob: yup.string().required(),
});

interface IReview {
  first_name: string;
  last_name: string;
  card_number: string;
  email: string;
  dob: string;
}

const Review = () => {
  const router = useRouter();
  const { step, nextStep } = useInstructionsContext();
  const [kycInfo, setKycInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<IReview>({
    resolver: yupResolver(schema),
  });
  const dispatch = useAppDispatch();
  const { kycData } = useAppSelector((state) => state.kyc);
  const [isEdit, setIsEdit] = useState(false);
  const [showPopupConfirm, setShowPopupConfirm] = React.useState(false);

  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      dispatch(
        updateKycData({
          ...kycData,
          verified_link: `https://admin-stag.bitlink.work/kyc/${profile?.user_id}`,
        }),
      );
    }
  }, [profile]);

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

      setValue("first_name", kycInfo?.first_name);
      setValue("last_name", kycInfo?.last_name);
      setValue("email", kycInfo?.email);
      setValue("card_number", kycInfo?.card_number);
      setValue("dob", kycInfo?.dob);
    }
  }, [kycInfo]);

  useEffect(() => {
    if (kycInfo) {
      setReadOnly(true);
    }
  }, [kycInfo]);

  const onSubmit = handleSubmit((data: any) => {
    dispatch(
      updateKycData({
        ...kycData,
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
        card_number: data?.card_number,
        dob: data?.dob,
      }),
    );
  });

  const first_name = watch("first_name");
  const last_name = watch("last_name");
  const card_number = watch("card_number");
  const dob = watch("dob");
  const email = watch("email");

  const validateDate = kycInfo?.dob;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setValue("first_name", first_name || kycData?.first_name);
      setValue("last_name", last_name || kycData?.last_name);
      setValue("card_number", card_number || kycData?.card_number);
      setValue("dob", dob || kycData?.dob);

      setValue("email", email || kycData?.email);
    }
  }, [
    isEdit,

    kycData?.first_name,
    kycData?.last_name,
    kycData?.card_number,
    kycData?.dob,

    kycData?.email,
    setValue,
  ]);

  useEffect(() => {
    if (kycInfo) {
      setActive(true);
    } else {
      if (isEdit) {
        if (
          watch("first_name") !== "" &&
          watch("last_name") !== "" &&
          watch("card_number") !== "" &&
          watch("dob") !== "" &&
          watch("email") !== "" &&
          validateFirstName(watch("first_name")) &&
          validateLastName(watch("last_name")) &&
          validateDob(watch("dob")) &&
          validateIDNumber(watch("card_number")) &&
          validateEmail(watch("email"))
        ) {
          setActive(true);
        } else {
          setActive(false);
        }
      }
    }
  }, [
    watch("dob"),
    watch("first_name"),
    watch("last_name"),
    watch("card_number"),
    watch("email"),
  ]);

  return (
    <div className=" px-10">
      <div className="my-[24px]">
        <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
          Review your infomation
        </div>
        <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
          Ensuring Accuracy and Completeness.
        </div>
      </div>
      <div
        className={` ${
          isEdit ? "h-[580px]" : "h-[417px]"
        } w-full rounded-[12px] border border-solid border-[#DEDEDE] px-[24px] py-[32px]`}
      >
        <div className=" flex items-center justify-between">
          <div className="text-[18px] font-medium leading-[27px] text-[#202124]">
            Infomation review
          </div>

          {isEdit ? (
            <MainButton
              title={"Save"}
              disabled={!active}
              className={`flex items-center gap-[6px] `}
              onClick={() => {
                onSubmit();
                setIsEdit(false);
              }}
            ></MainButton>
          ) : (
            <>
              <div
                onClick={() => {
                  setIsEdit(true);
                }}
                className={`flex cursor-pointer gap-2 ${
                  kycInfo ? "hidden" : ""
                }`}
              >
                <Image
                  src="/images/invoices/edit.svg"
                  width={24}
                  height={24}
                  alt=""
                />
                <div className="text-[16px] font-normal leading-[24px] text-[#2B4896]">
                  Edit
                </div>
              </div>
            </>
          )}
        </div>
        {isEdit ? (
          <div className=" flex flex-col gap-2">
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  First Name
                </div>
                <InputField
                  name={"first_name"}
                  readOnly={readOnly}
                  label="First Name *"
                  handleChange={(e) => setValue("first_name", e.target.value)}
                  register={register}
                  errors={errors}
                  watch={watch}
                  pattern={
                    /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
                  }
                  setError={setError}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  className=""
                  required
                  type="text"
                />
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  Last Name
                </div>
                <InputField
                  name={"last_name"}
                  readOnly={readOnly}
                  label="Last Name *"
                  handleChange={(e) => setValue("last_name", e.target.value)}
                  register={register}
                  errors={errors}
                  watch={watch}
                  pattern={
                    /^(?!\s+$)(^\s*$|^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
                  }
                  setError={setError}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  className=""
                  required
                  type="text"
                />
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  Email address
                </div>
                <InputField
                  name={"email"}
                  readOnly={readOnly}
                  label="Email *"
                  handleChange={(e) => setValue("email", e.target.value)}
                  register={register}
                  errors={errors}
                  watch={watch}
                  pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
                  setError={setError}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  className=""
                  required
                  type="text"
                />
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  ID Number
                </div>
                <InputField
                  // formField="idNumber"
                  // placeholder="ID Number"
                  // required
                  // errorText="This field is required"
                  // errors={errors}
                  // control={control}
                  name={"card_number"}
                  label="ID Number"
                  clearErrors={clearErrors}
                  readOnly={readOnly}
                  handleChange={(e) => setValue("card_number", e.target.value)}
                  register={register}
                  errors={errors}
                  watch={watch}
                  pattern={/^(?!\s+$)(^\s*$|^[0-9]*$)/}
                  setError={setError}
                  setValue={setValue}
                  className=""
                  required
                  type="text"
                />
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  Date of birth
                </div>
                <InputField
                  name={"dob"}
                  readOnly={readOnly}
                  label="Date of birth"
                  register={register}
                  errors={errors}
                  watch={watch}
                  pattern={
                    /^(?!\s+$)(^\s*$|^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$)/
                  }
                  setError={setError}
                  clearErrors={clearErrors}
                  handleChange={(e) => setValue("dob", e.target.value)}
                  setValue={setValue}
                  required
                  className=""
                  type="date"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className=" flex flex-col gap-2">
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  First Name
                </div>
                <div className="text-[14px] font-medium leading-[21px] text-[#202124]">
                  {kycInfo?.first_name || kycData?.first_name}
                </div>
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  Last Name
                </div>
                <div className="text-[14px] font-medium leading-[21px] text-[#202124]">
                  {kycInfo?.last_name || kycData?.last_name}
                </div>
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  Email address
                </div>
                <div className="text-[14px] font-medium leading-[21px] text-[#202124]">
                  {kycInfo?.email || kycData?.email}
                </div>
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  ID Number
                </div>
                <div className="text-[14px] font-medium leading-[21px] text-[#202124]">
                  {kycInfo?.card_number || kycData?.card_number}
                </div>
              </div>
              <div className="mt-2 border border-b border-dashed border-b-[#BDC6DE]"></div>
            </div>
            <div>
              <div className="mt-4 flex items-center justify-between">
                <div className=" text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
                  Date of birth
                </div>
                <div className="text-[14px] font-medium leading-[21px] text-[#202124]">
                  {/* {formatDate(kycInfo?.dob)} */}
                  {formatDate(kycData?.dob) || formatDate(kycInfo?.dob)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`float-right mt-6 flex gap-4 ${isEdit ? "hidden" : ""}`}
        >
          <button
            onClick={() => {
              dispatch(prevStep(6));
            }}
            className="flex items-center justify-center px-[24px] py-[12px] "
          >
            <div className=" text-[14px] font-semibold leading-[21px] opacity-50">
              Back
            </div>
          </button>
          <MainButton
            title="Complete"
            onClick={async () => {
              if (kycInfo) {
                router.push("/dashboard");
              } else {
                const res = await kycServices.uploadKYC(kycData);
                if (res) {
                  localStorage.setItem("isSubmit", "1");
                  setShowPopupConfirm(true);
                }
              }
            }}
          />
        </div>
      </div>

      {/* <Popup showPopup={showPopupEdit}>
        <EditPopup setShowPopup={setShowPopupEdit} />
      </Popup> */}

      {/* <SignPopup
          step8Data={step8Data}
          items={items}
          setTotalAmountData={setTotalAmountData}
          setShowPopup={setShowPopupAmount}
        /> */}

      <Popup showPopup={showPopupConfirm}>
        <ConfirmKYC setShowPopup={setShowPopupConfirm} />
      </Popup>
    </div>
  );
};

export default Review;
