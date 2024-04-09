import { useInstructionsContext } from "@/context/InstructionsProvider";
import IconArrow from "@/icon/icon-arrow.svg";
import Image from "next/image";
import { ReactNode } from "react";

const Instructions = ({
  children,
  step,
  title,
  showBg = true,
  left,
}: {
  children?: ReactNode;
  step?: number;
  title?: string;
  showBg?: boolean;
  left?: boolean;
}) => {
  const { step: currentStep } = useInstructionsContext();
  const show = step === currentStep;

  return (
    <div
      id={show ? "instructions" : undefined}
      style={{
        zIndex: show ? 1 : undefined,
        width: left ? "100%" : undefined,
        backgroundColor: left && show ? "#182853" : undefined,
      }}
      className="relative flex flex-col items-center rounded-lg"
    >
      {show && step < 3 && (
        <>
          {step !== 1 && (
            <div className="animation-move-top absolute top-[calc(100%+24px)] flex -translate-x-8 flex-col items-center">
              <Image src={IconArrow} alt="icon" />
              <div className="whitespace-nowrap font-poppins text-2xl font-normal leading-9 text-white">
                {title}
              </div>
            </div>
          )}

          {showBg && (
            <div className="absolute -inset-2 rounded-lg bg-white "></div>
          )}
        </>
      )}
      {children}
    </div>
  );
};

export default Instructions;
