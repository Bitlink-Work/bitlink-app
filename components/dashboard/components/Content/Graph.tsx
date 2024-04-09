"use client";

import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import Chart from "../Chart/Chart";
import ProgressBar from "../ProgressBar/ProgressBar";

type Props = {};

const Graph = (props: Props) => {
  return (
    <div className="flex w-full flex-col gap-[24px] md:flex-row md:items-center">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("right", 0, 0, 0.5)}
        className="flex h-[340px] w-full flex-col gap-6 rounded-[12px] border-[1px] border-[#DEDEDE] p-5"
      >
        <div className="flex flex-col items-center justify-between md:flex-row">
          <h1 className="text-[14px] font-medium leading-[21px] text-text-primary">
            Invoice Analytics
          </h1>
          <div className="flex flex-row items-center gap-[20px]">
            <div className="flex flex-row items-center gap-[8px]">
              <div className="h-2 w-2 rounded-full bg-[#1890FF]"></div>
              <p className="text-[12px] font-normal leading-[18px] text-text-primary">
                Payouts
              </p>
            </div>
            <div className="flex flex-row items-center gap-[8px]">
              <div className="h-2 w-2 rounded-full bg-[#FB8A00]"></div>
              <p className="text-[12px] font-normal leading-[18px] text-text-primary">
                Pay-ins
              </p>
            </div>
            <div className="flex w-[88px] flex-row gap-1 rounded-[8px] bg-white py-[4px] pl-[12px] pr-[8px] shadow-md">
              <p className="text-[12px] font-normal leading-[18px] text-text-primary">
                Monthly
              </p>
              <Image
                src="/images/dashboard/arrow-down.svg"
                width={16}
                height={16}
                alt=""
              />
            </div>
          </div>
        </div>
        <Chart />
      </motion.div>

      <ProgressBar />
    </div>
  );
};

export default Graph;
