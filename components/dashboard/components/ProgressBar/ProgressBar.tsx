"use client";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import more from "@/images/dashboard/more.svg";
import Image from "next/image";
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
type Props = {};

const ProgressBar = (props: Props) => {
  const idGreen = "green";
  const idRed = "red";
  const idOrange = "orange";

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn("left", 0, 0, 0.5)}
      className="flex flex-col gap-4 rounded-[12px] border-[1px] border-[#DEDEDE] p-5 max-md:items-center"
    >
      <div className="flex items-center justify-between max-md:w-full">
        <h3 className="#202124 text-[14px] font-medium leading-[21px]">
          Status
        </h3>
        <Image src={more} width={24} height={24} alt="" />
      </div>
      <div className="relative max-h-[216px] md:max-w-[216px]">
        <div className="h-[216px] w-[216px] ">
          <GradientSVGOrange />
          <CircularProgressbar
            value={60}
            styles={{
              path: {
                stroke: `url(#${idOrange})`,
                height: "100%",
                strokeLinecap: "round",
                transition: "stroke-dashoffset 0.5s ease 0s",
                transform: "rotate(0.25turn)",
                transformOrigin: "center center",
              },
              trail: {
                stroke: "#E9E9E966",
              },
            }}
          />
        </div>
        <div className="absolute left-[22px] top-6 h-[172px] w-[172px]">
          <GradientSVGRed />
          <CircularProgressbar
            value={65}
            styles={{
              path: {
                stroke: `url(#${idRed})`,
                height: "100%",
                strokeLinecap: "round",
                transition: "stroke-dashoffset 0.5s ease 0s",
                transform: "rotate(0.25turn)",
                transformOrigin: "center center",
              },
              trail: {
                stroke: "#E9E9E966",
              },
            }}
          />
        </div>
        <div className="absolute left-[44px] top-12 h-[127px] w-[127px]">
          <GradientSVGGreen />
          <CircularProgressbar
            value={90}
            styles={{
              path: {
                stroke: `url(#${idGreen})`,
                height: "100%",
                strokeLinecap: "round",
                transition: "stroke-dashoffset 0.5s ease 0s",
                transform: "rotate(0.25turn)",
                transformOrigin: "center center",
              },
              trail: {
                stroke: "#E9E9E966",
              },
            }}
          />
        </div>
        <div className="absolute left-[72px] top-20">
          <p className="text-center text-[24px] font-semibold leading-[36px] text-primary">
            12
          </p>
          <span className="text-[10px] font-normal leading-[15px] text-text-secondary">
            Total invoices
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FB8A00]"></div>
          <span className="text-[12px] font-normal text-text-primary">
            Awaiting
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#D93F21]"></div>
          <span className="text-[12px] font-normal text-text-primary">
            Overdue
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#34C759]"></div>
          <span className="text-[12px] font-normal text-text-primary">
            Completed
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressBar;
function GradientSVGGreen() {
  const idCSS = "green";
  const gradientTransform = `rotate(330)`;
  return (
    <svg className="h-0">
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="2%" stopColor="#34C759 " />
          <stop offset="100%" stopColor="#DBFFE4 " />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GradientSVGRed() {
  const idCSS = "red";
  const gradientTransform = `rotate(330)`;
  return (
    <svg className="h-0">
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="#D93F21" />
          <stop offset="98%" stopColor="#FFE7E2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GradientSVGOrange() {
  const idCSS = "orange";
  const gradientTransform = `rotate(330)`;
  return (
    <svg className="h-0">
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="#FF9500 " />
          <stop offset="98%" stopColor="#FFF1DD " />
        </linearGradient>
      </defs>
    </svg>
  );
}
