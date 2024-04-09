"use client";
import { getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import iconUpload from "@/public/images/procedure/upload.png";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LogoUpload = ({ setStepPro }: any) => {
  const router = useRouter();
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#fff] md:w-[63%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-between text-[#98999A]">
            <div className="text-[16px] font-normal leading-[24px]">
              Step 4/9
            </div>
            <button
              onClick={() => {
                if (profile) {
                  router.push("/dashboard");
                  localStorage.removeItem("dataInvoice");
                  localStorage.removeItem("logoUrl");
                  localStorage.removeItem("dataChain");
                  localStorage.removeItem("dataPaid");
                }
              }}
              className="text-[14px] font-semibold leading-[21px]"
            >
              Skip the tour
            </button>
          </div>
          <div className="mt-[112.5px] text-[36px] font-semibold leading-[54px]">
            Upload your company logo
          </div>
        </div>
      </div>
      <div className="flex h-full w-full justify-center border-l-[24px] border-solid border-[#DEDEDE] bg-[#fff] p-[60px] md:w-[47%]">
        <div className="flex h-full w-full items-end pt-[] md:w-[571px]"></div>
      </div>
    </div>
  );
};
export default LogoUpload;
