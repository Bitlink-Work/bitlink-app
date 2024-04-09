import {
  InstructionsProvider,
  useInstructionsContext,
} from "@/context/InstructionsProvider";
import IconArrowLeft from "@/icon/icon-arrow-left.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

interface IProps {
  type?: string;
  children: React.ReactNode;
}

const InstructionsContent = ({
  label,
  step,
}: {
  label: string;
  step: number;
}) => {
  const [position, setPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>();

  useEffect(() => {
    if (document) {
      const bounding = document
        .getElementById("instructions")
        ?.getBoundingClientRect();
      setPosition({
        top: bounding?.top,
        bottom: bounding?.bottom,
        left: bounding?.left,
        right: bounding?.right,
      });
    }
  }, [step]);

  return (
    <div
      style={{
        top: position?.top ? position.top + 16 : 0,
        left: position?.right ? position?.right - 29 : position?.right,
        zIndex: 1,
      }}
      className="animation-move-left absolute flex min-w-[200px] flex-col items-center"
    >
      <Image src={IconArrowLeft} alt="icon" />
      <div className="translate-x-1/2 whitespace-nowrap font-poppins text-2xl font-normal leading-9 text-white">
        {label}
      </div>
    </div>
  );
};

const Instructions = ({ children }: IProps) => {
  const { step, prevStep, nextStep } = useInstructionsContext();

  if (step > 4) return <>{children}</>;

  return (
    <div className="relative">
      {step === 3 && <InstructionsContent label="Sent Invoices" step={step} />}
      {step === 4 && <InstructionsContent label="Settings" step={step} />}
      {children}
      {step > -1 && (
        <div className="animation-face-in absolute left-0 top-0 flex h-screen w-screen items-end justify-end bg-[#0D0E0FCC] px-[32px] py-[36px]">
          <div className="relative flex gap-6">
            <button
              disabled={step < 1}
              style={{
                display: step < 1 ? "none" : "block",
                cursor: step < 1 ? "not-allowed" : "pointer",
              }}
              onClick={prevStep}
              className="rounded-lg border border-[#BDC6DE] px-6 py-3 font-poppins text-sm font-semibold leading-[21px] text-white transition-opacity hover:opacity-70"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="rounded-lg border border-[#2B4896] bg-[#2B4896] px-6 py-3 font-poppins text-sm font-semibold leading-[21px] text-white transition-opacity hover:border-btn-hover hover:bg-btn-hover"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultLayout = ({ children, type }: IProps) => {
  return (
    <InstructionsProvider>
      <Instructions>
        <div className="h-screen w-full overflow-hidden">
          {/* <Header /> */}

          <div className="flex h-full w-full flex-row items-start justify-start">
            <Sidebar />
            <div className="flex h-full flex-1 flex-col items-start overflow-hidden">
              <Header type={type} />
              <div className="w-full flex-1 overflow-y-auto px-10 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </Instructions>
    </InstructionsProvider>
  );
};

export default DefaultLayout;
