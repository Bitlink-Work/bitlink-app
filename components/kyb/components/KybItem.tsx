"use client";
import { useInstructionsContext } from "@/context/InstructionsProvider";
import { getProfile } from "@/public/actions";
import { selectProfile } from "@/public/reducers/profileSlice";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { kybServices } from "@/public/api/kybService";
import {
  saveStep,
  updateKybData,
  updateKybFile,
} from "@/public/reducers/kybSlices";

const KybItem = () => {
  const { step } = useInstructionsContext();
  const router = useRouter();
  const { kybData } = useAppSelector((state) => state.kyb);
  //const { kybStepStatus } = useAppSelector((state) => state.kyb);
  const [kybSubmit, setKybSubmit] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (localStorage.getItem("isSubmit") === "1") {
      setKybSubmit(true);
    }
  }, [kybSubmit]);

  return (
    <div
      style={{
        display: step === 1 ? "flex" : undefined,
      }}
      className="absolute right-0 top-[calc(100%+16px)] z-50 hidden h-fit w-fit flex-col gap-3 rounded-xl border border-[#DEDEDE] bg-[#fff] p-6 font-poppins shadow-[0px_4px_15px_0px_rgba(0,0,0,0.06)] group-hover:flex"
    >
      <div className="h-[134px] w-[254px]">
        <div className="text-[14px] font-medium leading-[21px] text-text-primary">
          🔍 KYB Verification
        </div>
        <div className="my-2 text-[12px] font-normal leading-[18px] text-text-secondary">
          Complete your KYB is required before you can accept payments
        </div>
        <button
          onClick={async () => {
            dispatch(
              updateKybData({
                ...kybData,
                company_name: "",
                registration_number: "",
                registered_country: "",
                company_email: "",

                company_website: "",
                company_phone_number: "",
                registered_address: "",
                registered_person: "",

                tax_id: "",

                city: "",
                postcode: "",
                address_document: "",
                certificate_document: "",
                address_document_type: "",
                certificate_document_type: "",
                address_document_name: "",
                certificate_document_name: "",

                first_name: "",
                last_name: "",
                email: "",
                type_number: "",
                phone_number: "",
                card_type: "",
                card_first_name: "",
                card_last_name: "",
                dob: "",
                representative_country: "",
                front_card: "",
                back_card: "",

                verified_link: "",
              }),
            );
            dispatch(
              updateKybFile({
                ...kybData,
                address_document: {},
                certificate_document: {},
              }),
            );
            await dispatch(saveStep());
            router.push("/kyb");
          }}
          className="flex h-[53px] w-[153px] items-center justify-center rounded-[8px] bg-[#12B3471F]"
        >
          <div className="text-[14px] font-medium leading-[21px] text-[#12B347]">
            {kybSubmit === true ? "Review infomation" : " Complete Now"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default KybItem;
