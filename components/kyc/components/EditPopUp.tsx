"use client";
import MainButton from "@/components/button/MainButton";
import InputField from "@/components/fields/InputField";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { updateKycData } from "@/public/reducers/kycSlices";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  setShowPopup: (value: boolean) => void;
};

const EditPopup = ({ setShowPopup }: any) => {
  const { step, kycData } = useAppSelector((state) => state.kyc);
  const {
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: kycData?.email,
      firstName: kycData?.first_name,
      lastName: kycData?.last_name,
      idCard: kycData?.card_number,
      dob: kycData?.dob,
    },
  });
  const dispatch = useAppDispatch();
  const onSubmit = async (data: any) => {
    dispatch(
      updateKycData({
        ...kycData,
        first_name: data?.firstName,
        last_name: data?.lastName,
        email: data?.email,
        card_number: data?.idCard,
        dob: data?.dob,
      }),
    );
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10">
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        Edit your kyc infomation
      </h3>
      <form>
        <div className="mt-4 grid w-full grid-cols-2 gap-4">
          <InputField
            formField="firstName"
            placeholder="First Name"
            required
            errorText="This field is required"
            errors={errors}
            control={control}
          />
          <InputField
            formField="lastName"
            placeholder="Last Name"
            required
            errorText="This field is required"
            errors={errors}
            control={control}
          />
        </div>
        <div className="mt-8 grid w-full grid-cols-2 gap-4">
          <InputField
            formField="dob"
            placeholder="Date of birth"
            required
            errorText="This field is required"
            errors={errors}
            control={control}
          />
          <InputField
            formField="idCard"
            placeholder="ID Number"
            required
            errorText="This field is required"
            errors={errors}
            control={control}
          />
        </div>
        <div className="mt-4">
          <InputField
            formField="email"
            placeholder="Email address"
            required
            errorText="This field is required"
            errors={errors}
            control={control}
          />
        </div>

        <div className="mt-8 flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
          <button
            type="button"
            onClick={() => setShowPopup && setShowPopup(false)}
            className="w-fit rounded-lg bg-[#fff] px-6 py-3"
          >
            Cancel
          </button>
          <MainButton title="Agree" onClick={handleSubmit(onSubmit)} />
        </div>
      </form>
    </div>
  );
};

export default EditPopup;
