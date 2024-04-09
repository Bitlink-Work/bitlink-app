" use client";
import Image from "next/image";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {
  standard: any;
  setStandard: (value: any) => void;
  setFormValues: (value: any) => void;
  receiver?: any;
};

const STANDARDS = [
  {
    id: 0,
    title: "ISO 19005-3",
  },
  {
    id: 1,
    title: "ebXML",
  },
  {
    id: 2,
    title: "OASIS UBL 2.x",
  },
  {
    id: 3,
    title: "ISO/IEC 19845:2015",
  },
  {
    id: 4,
    title: "UN/CEFACT",
  },
  {
    id: 5,
    title: "PDF/A-3",
  },
  {
    id: 6,
    title: "CEN/PC 434",
  },
  {
    id: 7,
    title: "CEN/PC 440",
  },
  {
    id: 8,
    title: "PEPPOL BIS 3.0",
  },
];

const ReviewStandard = ({
  standard,
  setStandard,
  setFormValues,
  receiver,
}: Props) => {
  useEffect(() => {
    if (receiver) {
      setStandard(STANDARDS[0]?.title);
      //   setFormValues((prev: any) => ({
      //     ...prev,
      //     standard: STANDARDS[0]?.title,
      //   }));
    }
  }, [receiver, setFormValues, setStandard, standard]);

  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <h5 className="flex flex-row items-center gap-[6px] text-sm font-medium leading-[150%] text-text-primary">
        Standard formats ⭐
      </h5>
      <div className="group relative flex h-fit w-[320px] flex-row gap-1 rounded border border-[#DEDEDE] bg-[#fff] p-4">
        <input
          className="h-6 w-full text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary focus:outline-none active:outline-none "
          type="text"
          placeholder={STANDARDS[0]?.title}
          defaultValue={STANDARDS[0]?.title}
        />
        <div className="flex h-6 w-6 cursor-pointer items-center justify-center">
          <Image
            src="/images/received-invoices/arrow-down.svg"
            width={14.001}
            height={7}
            alt=""
          />
        </div>

        <div className="absolute inset-0 top-[calc(100%+1px)] z-10 hidden h-fit w-full bg-[#fff] group-hover:block ">
          {STANDARDS.map((item: any, index: any) => (
            <button
              //   disabled={item?.title !== "ISO 19005-3"}
              onClick={() => {
                if (item?.title !== "ISO 19005-3") {
                  toast.info("Coming soon!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    transition: Bounce,
                  });
                } else {
                  setStandard(item?.title);
                  //   setFormValues((prev: any) => ({
                  //     ...prev,
                  //     standard: item?.title,
                  //   }));
                }
              }}
              key={index}
              className={`bg-[]#fff] flex w-full cursor-pointer flex-row items-center justify-start gap-2 p-3 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#FEF9EE] ${
                item?.title !== "ISO 19005-3"
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <p>{item?.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStandard;
