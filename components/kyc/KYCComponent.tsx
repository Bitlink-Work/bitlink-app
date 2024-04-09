"use client";
import Header from "../header/Header";

import { useAppSelector } from "@/public/hook/hooks";
import Address from "./components/Address";
import Check from "./components/Check";
import IDVerify from "./components/IDVerify";
import KYCProcess from "./components/KYCProcess";
import PersonalInfo from "./components/PersonalInfo";
import Review from "./components/Review";
import Selfie from "./components/Selfie";
import Success from "./components/Success";

type Props = {};

const KYCComponent = (props: Props) => {
  const { step } = useAppSelector((state) => state.kyc);

  return (
    <div className="relative flex flex-col items-start  bg-[#fdfcfb]">
      <Header />
      <div className="flex w-full">
        <div className="h-[100vh] w-[22%]  border-r border-solid  border-r-[#BDC6DE] bg-[#FFFFFF] px-[40px] py-[24px] md:h-[1150px] md:w-[316px]">
          <KYCProcess step={step} />
        </div>
        <div className="w-[78%] bg-[#FDFCFB]  ">
          <div className="flex items-center px-[40px] ">
            <div className=" text-[24px] font-semibold leading-[36px] ">
              KYC Form{" "}
            </div>
            <div className="my-2 h-6 border-r-[2px] border-solid border-b-[#DEDEDE] px-[8px] "></div>
            <div className=" px-2 text-[14px] font-semibold leading-[21px] text-primary">
              4{" "}
              <span className="text-[14px] font-normal leading-[21px] text-text-secondary">
                Steps
              </span>
            </div>
          </div>

          {step == 1 ? (
            <>
              <PersonalInfo />
            </>
          ) : step == 2 ? (
            <>
              <Address />
            </>
          ) : step == 3 ? (
            <>
              <IDVerify />
            </>
          ) : step == 4 ? (
            <>
              <Selfie />
            </>
          ) : step == 5 ? (
            <>
              <Check />
            </>
          ) : step == 6 ? (
            <>
              <Success />
            </>
          ) : step == 7 ? (
            <>
              <Review />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCComponent;
