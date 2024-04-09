"use client";
import MainButton from "@/components/button/MainButton";
import { useInstructionsContext } from "@/context/InstructionsProvider";
import close from "@/images/kyc/Close.svg";

import { useAppDispatch } from "@/public/hook/hooks";
import { saveStep, updateStatusStep } from "@/public/reducers/kybSlices";
import { saveStepKYC, updateStatusStepKyc } from "@/public/reducers/kycSlices";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  setShowPopup: (value: boolean) => void;
};

const ConfirmKYC = ({ setShowPopup }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("step-instructions")) {
      setStep(Number(localStorage.getItem("step-instructions")));
    }
  }, []);

  const { nextStep } = useInstructionsContext();

  return (
    <div
      onClick={() => setShowPopup && setShowPopup(false)}
      className=" relative flex h-[548px] w-[598px] flex-col items-start gap-8 rounded-xl 
      bg-[#fff] px-10 pb-8 pt-6"
    >
      <div className="absolute right-4 top-4 cursor-pointer">
        <Image src={close} alt="close" />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-center">
          <Image
            src="/icon/icon-stick-done.gif"
            alt="pending"
            width={160}
            height={160}
          />
        </div>
        <div className=" text-center text-[24px] font-semibold leading-[36px] text-[#43A048]">
          Application Submitted
        </div>
        <div className="mb-4 mt-4 text-left text-[14px] font-normal leading-[21px] text-[#202124]">
          You have submitted your application successfully. We will notify you
          by email once we get the result. Thank you for your patience.
        </div>
        <div className="flex justify-center">
          <div className="flex items-center justify-center gap-[6px] rounded bg-[#FBEBCB] px-[12px] py-[8px]">
            <span>🕒</span>
            <span className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
              Processing time:{" "}
              {pathname === "/kyc" ? "24 hours" : "15 business days"}
            </span>
          </div>
        </div>
        <div className="mt-6 flex h-[68px] w-full items-center justify-center gap-3 rounded bg-[#E6F7FF] p-4">
          <Image src="/icon/icon-info.svg" width={24} height={24} alt="" />
          <span className="font-poppins text-xs font-normal leading-[18px] text-[#202124]">
            If you have any questions, please feel free to reach out to our
            customer service team based on your convenient time zone.
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
        <a
          href="mailto:support@bitlink.work"
          className="flex items-center justify-center rounded-lg border 
        border-[#BDC6DE] px-[24px] py-[12px] font-poppins text-sm leading-[21px] text-[#6A6A6C]"
        >
          Contact Us
        </a>
        <MainButton
          title="Done"
          onClick={async () => {
            if (pathname === "/kyc") {
              // await dispatch(saveStepKYC());
              await dispatch(updateStatusStepKyc());
            } else {
              // await dispatch(saveStep());
              await dispatch(updateStatusStep());
            }
            if (step && step === 2) {
              router.back();
            } else {
              router.push("/dashboard");
              nextStep();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ConfirmKYC;
