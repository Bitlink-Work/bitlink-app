"use client";
import Header from "../header/Header";

import KYBProcess from "./components/KYBProcess";

import { useAppSelector } from "@/public/hook/hooks";
import CompanyDetail from "./components/CompanyDetail";
import RepresentativeDetail from "./components/RepresentativeDetail";
import CardVerify from "./components/CardVerify";
import KYBForm from "./components/KYBForm";

type Props = {};

const KYBComponent = (props: Props) => {
  const { step } = useAppSelector((state) => state.kyb);
  return (
    <div className="relative flex flex-col items-start  bg-[#fdfcfb]">
      <Header />
      <div className=" flex w-full">
        <div className="h-[100vh] w-[22%] border border-solid border-[rgba(189,198,222,1)] bg-white px-[40px] py-[24px] md:h-[1450px] md:w-[316px]">
          <div className="text-[14px] font-normal leading-[21px] ">
            Complete your KYB details to configure API keys and start accepting
            payouts.
          </div>

          <div className="my-[24px] w-full border-b border-b-[#EBE4D2]"></div>
          <KYBProcess step={step} />

          <div></div>
        </div>
        <div className="my-10 w-[78%] bg-[#FDFCFB] py-1 ">
          <div className="px-[40px]">
            <div className="flex items-center ">
              <div className="text-[24px] font-semibold leading-[36px] ">
                KYB Form{" "}
              </div>
              <div className="my-2 h-6 border-r-[2px] border-solid border-b-[#DEDEDE] px-[8px] "></div>
              <div className=" px-2 text-[14px] font-semibold leading-[21px] text-primary">
                3{" "}
                <span className="text-[14px] font-normal leading-[21px] text-text-secondary">
                  Steps
                </span>
              </div>
            </div>
            <div className="pt-[6px] text-[14px] font-normal leading-[21px] text-text-secondary">
              ⭐️ Complete your KYB is required before your can accept payments.
              Verification of your identity and business details is required.
            </div>
          </div>

          <div className="mb-6"></div>
          <div className="px-10">
            {" "}
            {step == 1 ? (
              <>
                <CompanyDetail />
              </>
            ) : step == 2 ? (
              <>
                <RepresentativeDetail />
              </>
            ) : step == 3 ? (
              <>
                <CardVerify />
              </>
            ) : step == 4 ? (
              <>
                <KYBForm />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYBComponent;
