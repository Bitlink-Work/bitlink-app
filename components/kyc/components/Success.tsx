import MainButton from "@/components/button/MainButton";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import face from "@/public/images/kyc/face.svg";
import smile from "@/public/images/kyc/smile.svg";
import { nextStep, prevStep, updateKycData } from "@/public/reducers/kycSlices";

import Image from "next/image";
import * as React from "react";

function Success() {
  const dispatch = useAppDispatch();

  return (
    <div className="px-10">
      <div>
        <div className="my-[24px]">
          <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
            Face check
          </div>
          <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
            Face check is the process of verifying identity through facial
            recognition of an individual.
          </div>
        </div>

        <div className="flex h-[400px] w-full flex-col items-center rounded-[12px] border border-solid border-[#DEDEDE] px-[24px] py-[32px] ">
          <div className="my-auto items-center">
            <div className="absolute left-1/2 top-[260px] z-0 h-[257px] w-[287px] bg-[url(/images/congratulations/Confetti.png)] bg-cover"></div>
            <div className=" z-1 absolute left-[52%] top-[300px]">
              <div className="flex items-center justify-center">
                {" "}
                <Image src={smile} alt="smile" />
              </div>

              <div className="text-center text-[24px] font-semibold leading-[36px] text-[#2B4896]">
                Congratulations!{" "}
              </div>
              <div className="text-center text-[24px] font-semibold leading-[36px] text-[#202124]">
                You&apos;re all finished.
              </div>
            </div>
          </div>

          {/* <div>
              {" "}
              <Image
                src={`data:image/jpeg;base64,${kycData?.verify_image}`}
                alt="ffff"
                width={400}
                height={400}
              />
            </div> */}

          <div className="mb-2 flex w-full justify-end gap-4">
            <button
              onClick={() => {
                dispatch(prevStep(4));
              }}
              className="flex items-center justify-center px-[24px] py-[12px] "
            >
              <div className=" text-[14px] font-semibold leading-[21px] opacity-50">
                Back
              </div>
            </button>
            <MainButton
              // disabled={!kycInfo?.verify_image}
              title="Next"
              onClick={() => {
                dispatch(nextStep(7));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
