"use client";
import { useInstructionsContext } from "@/context/InstructionsProvider";
import { getProfile } from "@/public/actions";
import { selectProfile } from "@/public/reducers/profileSlice";
import { kycServices } from "@/public/api/kycService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { saveStepKYC, updateKycData } from "@/public/reducers/kycSlices";

const KycItem = () => {
  const { step } = useInstructionsContext();

  const router = useRouter();

  const [kycSubmit, setKycSubmit] = useState(false);

  const { kycData } = useAppSelector((state) => state.kyc);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (localStorage.getItem("isSubmit") === "1") {
      setKycSubmit(true);
    }
  }, [kycSubmit]);

  return (
    <div
      style={{
        display: step === 1 ? "flex" : undefined,
      }}
      className="absolute right-0 top-[calc(100%+16px)] z-50 hidden h-fit w-fit flex-col gap-3 rounded-xl border border-[#DEDEDE] bg-[#fff] p-6 font-poppins shadow-[0px_4px_15px_0px_rgba(0,0,0,0.06)] group-hover:flex"
    >
      <div className="h-[134px] w-[254px]">
        <div className="text-[14px] font-medium leading-[21px] text-text-primary">
          🔍 KYC Verification
        </div>
        <div className="my-2 text-[12px] font-normal leading-[18px] text-text-secondary">
          Complete your KYC is required before your can accept payments
        </div>
        <button
          onClick={() => {
            dispatch(saveStepKYC());
            dispatch(
              updateKycData({
                ...kycData,
                first_name: "",
                last_name: "",
                email: "",
                country: "",
                card_type: "",
                card_first_name: "",
                card_last_name: "",
                card_number: "",
                dob: "",
                front_card: "",
                back_card: "",
                verify_image: "",
                verified_link: "",
              }),
            );
            router.push("/kyc");
          }}
          className="flex h-[53px] w-[153px] items-center justify-center rounded-[8px] bg-[#12B3471F]"
        >
          <div className="text-[14px] font-medium leading-[21px] text-[#12B347]">
            {kycSubmit === true ? "Review infomation" : " Complete Now"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default KycItem;
