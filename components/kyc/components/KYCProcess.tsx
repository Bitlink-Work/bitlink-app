type Props = {
  step: number;
};

const PROCESS = [
  {
    id: 0,
    step: 1,
    title: "Individual information",
    isCompleted: false,
  },
  {
    id: 1,
    step: 2,
    title: "ID verification ",
    isCompleted: false,
  },
  {
    id: 2,
    step: 3,
    title: "Selfie",
    isCompleted: false,
  },
  {
    id: 3,
    step: 4,
    title: "Review",
    isCompleted: false,
  },
];

const KYCProcess = ({ step }: Props) => {
  let currentProcess = 1;
  if (step === 1) {
    currentProcess = 1;
  } else if (step === 2 || step === 3) {
    currentProcess = 2;
  } else if (step === 4 || step === 5 || step == 6) {
    currentProcess = 3;
  } else {
    currentProcess = 4;
  }
  return (
    <div className="flex flex-row items-start justify-start gap-3">
      <div>
        {PROCESS.map((item) => (
          <div key={item.id} className="h-[103px] w-fit">
            <div
              className={`after:contents-[''] relative flex h-8 w-8 items-center justify-center rounded-full ${
                item.step <= currentProcess
                  ? "bg-[#43A048] text-[#fff] after:border-[#43A048]"
                  : "bg-[#e6e2e2] text-text-primary after:border-[#DEDEDE]"
              }
              ${
                item.step < currentProcess
                  ? " after:border-[#43A048]"
                  : "after:border-[#DEDEDE]"
              } after:absolute after:left-[50%] after:top-[100%] after:h-[71px] after:-translate-x-1/2 after:border-[2px] after:border-dashed ${
                item.step === 4 ? "after:hidden" : ""
              }`}
            >
              <p className="text-sm font-semibold leading-[150%]">
                {item.step}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-1">
        <div className="h-[103px] w-fit ">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[0].title}
          </p>
          <p className="text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
            Complete the interviewer&apos;s personal information.
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[1].title}
          </p>
          <p className="text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
            Complete the interviewer&apos;s ID card section.
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[2].title}
          </p>
          <p className="text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
            Face check.
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[3].title}
          </p>
          <p className="text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
            Review your infomation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCProcess;
