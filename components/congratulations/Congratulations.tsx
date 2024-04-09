"use client";
import smileIcon from "@/images/congratulations/smileIcon.png";
import { getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import copy from "@/public/images/congratulations/copy.svg";
import pos from "@/public/images/congratulations/pos.gif";
import printer from "@/public/images/congratulations/printer.svg";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useInstructionsContext } from "@/context/InstructionsProvider";
import { useCallback, useEffect, useState } from "react";
import MainButton from "../button/MainButton";
import ModalView from "./ModalView";

const Congratulations = ({ step11Data, idInvoice }: any) => {
  const [review, setReview] = useState(false);
  const router = useRouter();
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { step, prevStep, nextStep } = useInstructionsContext();
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
              Step 9/9
            </div>
            <button
              onClick={() => {
                nextStep();

                router.push("/dashboard");
              }}
              className="text-[14px] font-semibold leading-[21px]"
            >
              Go to dashboard
            </button>
          </div>
          <div className="relative mt-[51px] flex w-full flex-col items-center pt-[76px]">
            <div className="h-[80px] w-[80px]">
              <Image src={smileIcon} alt="icon smile" objectFit="cover" />
            </div>
            <div className="mt-[24px] w-full text-[36px] font-semibold leading-[54px] text-primary">
              Congratulations!{" "}
              <span className="text-text-primary">You’re all finished.</span>
            </div>
            <div className="mb-[77px] mt-[32px] text-[18px] font-normal leading-[27px] text-[#4d4d50]">
              Onboarding is now complete. In the next and final step you can
              check your invoice in full before sending it. Hope you enjoyed!
            </div>
            <div className="absolute top-0 z-0 h-[490px] w-[549px] bg-[url(/images/congratulations/Confetti.png)] bg-cover"></div>
            <div className="mt-[129px] flex w-full items-center justify-between">
              {profile?.is_verified && (
                <button
                  // onClick={() => router.push("/home?step=12")}
                  className="mr-[10px] flex  items-center py-[12px] text-[14px] font-semibold leading-[21px] text-[#98999a]"
                >
                  Invoice link
                  <Image
                    src={copy}
                    alt="pos"
                    objectFit="cover"
                    className="ml-[10px]"
                  />
                </button>
              )}
              {/* <button
                onClick={() => setReview(true)}
                className="flex h-[48px] w-[163px] items-center justify-center gap-x-[10px] rounded-[8px] bg-primary text-[14px] font-semibold leading-[21px] text-white hover:bg-[#F5CC78]"
              >
                Review
                <div className="h-[24px] w-[24px]">
                  <Image
                    src={arrowRight}
                    alt="arrow right icon"
                    objectFit="cover"
                  />
                </div>
              </button> */}
              <MainButton
                title={"Print invoice"}
                icon={printer}
                onClick={() => {
                  // setReview(true)
                }}
              />
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="relative flex h-full w-full items-center justify-center rounded-l-2xl  bg-primary md:w-[37%]">
        <div className=" absolute -top-[97px] right-0 h-[353px] w-[353px] overflow-hidden bg-[url(/images/reviews/corner.png)] "></div>
        <div className="h-[487.2px] w-[400px]">
          <Image src={pos} alt="pos" objectFit="cover" />
        </div>
      </div>
      {review && (
        <ModalView
          idInvoice={idInvoice}
          step11Data={step11Data}
          setReview={setReview}
        />
      )}
    </div>
  );
};
export default Congratulations;
