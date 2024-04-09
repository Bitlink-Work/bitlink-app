type Props = {
  step: number;
};

const PROCESS = [
  {
    id: 0,
    step: 1,
    title: "Company Details",
    isCompleted: false,
    subtitle: "Complete the company data form.",
  },
  {
    id: 1,
    step: 2,
    title: "Representatives",
    isCompleted: false,
    subtitle: "Provide data about the representatives.",
  },
  {
    id: 2,
    step: 3,
    title: "Review",
    isCompleted: false,
    subtitle: "Review your infomation.",
  },
];

const KYBProcess = ({ step }: Props) => {
  let currentProcess = 1;
  if (step === 1) {
    currentProcess = 1;
  } else if (step === 2 || step === 3) {
    currentProcess = 2;
  } else {
    currentProcess = 3;
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
                item.step === 3 ? "after:hidden" : ""
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
        {PROCESS.map((item) => (
          <div key={item.id} className="h-[103px] w-fit ">
            <p
              className={`text-sm font-semibold leading-[150%] ${
                item.step <= step ? "text-text-primary" : "text-[#98999A]"
              }  `}
            >
              {PROCESS[item.id].title}
            </p>
            <p className="text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
              {PROCESS[item.id].subtitle}
            </p>
          </div>
        ))}

        {/* <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-[#98999A]">
            {PROCESS[1].title}
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-[#98999A]">
            {PROCESS[2].title}
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-[#98999A]">
            {PROCESS[3].title}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default KYBProcess;
