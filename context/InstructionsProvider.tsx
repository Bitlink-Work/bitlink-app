import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type TypeInstructionsProvider = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  skip: () => void;
};

const InstructionsContext = createContext<TypeInstructionsProvider>({
  step: -1,
  nextStep() {},
  prevStep() {},
  skip() {},
});

const useInstructionsContext = () => useContext(InstructionsContext);

const InstructionsProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(-1);

  const value: TypeInstructionsProvider = {
    step: step,
    nextStep: function (): void {
      setStep((prev) => prev + 1);
    },
    prevStep: function (): void {
      setStep((prev) => prev - 1);
    },
    skip: function (): void {
      setStep(-1);
    },
  };

  useEffect(() => {
    if (step < 0) {
      const valueLocal = localStorage.getItem("step-instructions");
      setStep(valueLocal ? Number(valueLocal) : 0);
    } else {
      localStorage.setItem("step-instructions", JSON.stringify(step));
    }
  }, [step]);

  return (
    <InstructionsContext.Provider value={value}>
      {children}
    </InstructionsContext.Provider>
  );
};

export { InstructionsProvider, useInstructionsContext };
