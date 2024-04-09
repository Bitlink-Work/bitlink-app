import { useRouter } from "next/router";
import { useState } from "react";
import Procedure from "../procedure/Procedure";
import WellcomePage from "./WellcomePage";
import WhoYouAre from "./WhoYouAre";
import { useEffect } from "react";
import AppContextProvider from "@/context/AppContextProvider";

const Banner = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (router?.query?.step) {
      setStep(Number(router?.query?.step));
    }
  }, [router?.query?.step]);

  return (
    <AppContextProvider>
      <div className="flex w-full items-center justify-center">
        {step == 1 ? (
          <WellcomePage setStep={setStep} />
        ) : step == 2 ? (
          <WhoYouAre setStep={setStep} />
        ) : (
          <Procedure />
        )}
      </div>
    </AppContextProvider>
  );
};
export default Banner;
