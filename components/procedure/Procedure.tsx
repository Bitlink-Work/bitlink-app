"use client";
import { getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import { selectProfile } from "@/public/reducers/profileSlice";

import icon from "@/public/images/procedure/icon.png";
import treeGif from "@/public/images/procedure/tree.gif";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import MainButton from "../button/MainButton";
import Congratulations from "../congratulations/Congratulations";
import GetPaidFor from "./GetPaidFor";
import InvoiceCurency from "./InvoiceCurency";
import InvoiceData from "./InvoiceData";
import InvoiceDetail from "./InvoiceDetail";
import InvoiceFor from "./InvoiceFor";
import LogoUpload from "./LogoUpload";
import ReceiveYourFunds from "./ReceiveYourFunds";
import ReviewInvoice from "./ReviewInvoice";
import ReviewResult from "./ReviewResult";
const Procedure = () => {
  const router = useRouter();
  const [stepPro, setStepPro] = useState(router?.query?.step || 3);

  const [step3Data, setStep3Data] = useState(null);
  const [step4Data, setStep4Data] = useState(null);
  const [step5Data, setStep5Data] = useState(null);
  const [step6Data, setStep6Data] = useState(null);
  const [step7Data, setStep7Data] = useState(null);
  const [step8Data, setStep8Data] = useState(null);
  const [step9Data, setStep9Data] = useState(null);
  const [step10Data, setStep10Data] = useState(null);
  const [idInvoice, setIdInvoice] = useState(null);
  useEffect(() => {
    if (router?.query?.step) {
      setStepPro(Number(router?.query?.step));
    }
  }, [router]);

  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="relative h-full w-full">
      {stepPro == 3 ? (
        <div className="flex w-full justify-center text-text-primary md:h-[100vh] md:min-h-[900px]">
          <div className="h-full w-full bg-[#FDFCFB] p-[60px] md:w-[56%]">
            <div className="flex w-full items-center justify-between text-[#98999A]">
              <div className="text-[16px] font-normal leading-[24px]">
                Step 1/9
              </div>
              <button
                onClick={() => {
                  if (profile) {
                    localStorage.removeItem("dataInvoice");
                    localStorage.removeItem("logoUrl");
                    localStorage.removeItem("dataChain");
                    localStorage.removeItem("dataPaid");
                    router.push("/dashboard");
                  }
                }}
                className="text-[14px] font-semibold leading-[21px]"
              >
                Skip the tour
              </button>
            </div>
            <div className="mt-[223px] flex w-full flex-col items-center md:mx-auto md:w-[661px]">
              <div className="text-[36px] font-semibold leading-[54px]">
                Hi, you seem to be <span className="text-primary">new</span> to
                invoices
              </div>
              <div className="mt-[24px] text-[18px] font-normal leading-[27px]">
                No worries, this is easy. We will guide you step by step through
                the flow. You wil be an expert the next time you are doing this.
                Also this turtorial is optional. You can skip the tour on the
                top right.
              </div>

              <div className="relative mt-20">
                <MainButton
                  title="Get Started"
                  icon={arrowRight}
                  bold
                  onClick={() => router.push("/home?step=4")}
                />
                <Image
                  src={icon}
                  alt="icon"
                  objectFit="cover"
                  className="absolute bottom-[30%] right-[-30%] h-[80px] w-[80px]"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-center rounded-l-2xl bg-primary md:w-[44%]">
            <div className="h-[400px] w-[400px] mix-blend-darken">
              <Image src={treeGif} alt="tree gif" objectFit="cover" />
            </div>
          </div>
        </div>
      ) : stepPro == 4 ? (
        <InvoiceData setStepPro={setStepPro} />
      ) : stepPro == 5 ? (
        <InvoiceDetail setStepPro={setStepPro} setStep3Data={setStep3Data} />
      ) : stepPro == 6 ? (
        <LogoUpload
          setStepPro={setStepPro}
          step4Data={step3Data}
          setStep4Data={setStep4Data}
        />
      ) : stepPro == 7 ? (
        <InvoiceFor
          setStepPro={setStepPro}
          step5Data={step4Data}
          setStep5Data={setStep5Data}
        />
      ) : stepPro == 8 ? (
        <ReceiveYourFunds
          setStepPro={setStepPro}
          step7Data={step6Data}
          setStep7Data={setStep7Data}
        />
      ) : stepPro == 9 ? (
        <InvoiceCurency
          setStepPro={setStepPro}
          step6Data={step5Data}
          setStep6Data={setStep6Data}
        />
      ) : stepPro == 10 ? (
        <GetPaidFor
          setStepPro={setStepPro}
          step8Data={step7Data}
          setStep8Data={setStep8Data}
        />
      ) : stepPro == 11 ? (
        <ReviewInvoice
          setIdInvoice={setIdInvoice}
          setStepPro={setStepPro}
          step9Data={step8Data}
          setStep9Data={setStep9Data}
        />
      ) : stepPro == 12 ? (
        <ReviewResult />
      ) : stepPro == 13 ? (
        <Congratulations idInvoice={idInvoice} step11Data={step9Data} />
      ) : (
        ""
      )}
    </div>
  );
};
export default memo(Procedure);
