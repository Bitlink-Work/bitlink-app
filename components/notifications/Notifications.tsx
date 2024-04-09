"use client";
import Image from "next/image";
import { useState } from "react";
import NotiItem from "./NotiItem";

type Props = {};

const Notifications = (props: Props) => {
  const [active, setActive] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const handleViewMore = () => {
    setShowMore((prev) => !prev);
  };

  const renderNotiItems = (count: number) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(<NotiItem key={i} status="OVERDUE" />);
    }
    return items;
  };
  return (
    <div
      className="absolute right-[-32.32px] top-[calc(100%+24px)] z-50 hidden h-fit w-fit flex-col gap-3 rounded-xl border border-[#DEDEDE] bg-[#fff] p-6 font-poppins shadow-[0px_4px_15px_0px_rgba(0,0,0,0.06)] 
    group-hover:flex
    "
    >
      <h4 className="text-sm font-semibold leading-[150%] text-text-primary">
        Notification
      </h4>
      <div className="flex flex-row items-center justify-start gap-3">
        <div
          onClick={() => setActive("All")}
          className={`${
            active === "All" ? "bg-[#E9E9E9]" : "bg-[#fff]"
          } flex flex-row items-center justify-center gap-1 rounded-[200px] px-4 py-[6px]`}
        >
          <div className="px-2 py-1 ">
            <p className="text-sm font-medium leading-[150%] text-text-primary">
              All
            </p>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-primary px-[6px] py-[2px] text-xs font-medium leading-[150%] text-white">
            <p>9+</p>
          </div>
        </div>
        <div
          onClick={() => setActive("Report")}
          className={`${
            active === "Report" ? "bg-[#E9E9E9]" : "bg-[#fff]"
          } flex flex-row items-center justify-center gap-1 rounded-[200px] px-4 py-[6px]`}
        >
          <div className="px-2 py-1 ">
            <p className="text-sm font-medium leading-[150%] text-text-primary">
              Report
            </p>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-primary px-[6px] py-[2px] text-xs font-medium leading-[150%] text-white md:hidden">
            <p>9+</p>
          </div>
        </div>
        <div
          onClick={() => setActive("People")}
          className={`${
            active === "People" ? "bg-[#E9E9E9]" : "bg-[#fff]"
          } flex flex-row items-center justify-center gap-1 rounded-[200px] px-4 py-[6px]`}
        >
          <div className="px-2 py-1 ">
            <p className="text-sm font-medium leading-[150%] text-text-primary">
              People
            </p>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-primary px-[6px] py-[2px] text-xs font-medium leading-[150%] text-white md:hidden">
            <p>9+</p>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#E9E9E9]"></div>
      <div className="max-h-[400px] overflow-y-auto">
        <div className="flex w-full flex-row items-center justify-between">
          <h5 className="text-base font-medium leading-[150%] text-[#000000]">
            News
          </h5>
          <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
            <div className="h-6 w-6">
              <Image
                src="/images/dashboard/Tick.svg"
                alt="Tick"
                width={24}
                height={24}
              />
            </div>
            <p className="text-sm font-medium leading-[150%] text-[#1890FF]">
              Mark all as read
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start gap-[6px]">
          <NotiItem status="WAITING" />
          <NotiItem status="OVERDUE" />
        </div>
        <h5 className="text-base font-medium leading-[150%] text-[#000000]">
          Yesterday
        </h5>
        <div className="flex flex-col items-center justify-start gap-[6px]">
          <NotiItem status="WAITING" />
          <NotiItem status="OVERDUE" />
          {showMore && renderNotiItems(2)}
        </div>
        {showMore ? null : (
          <div className="w-full text-center">
            <button
              onClick={handleViewMore}
              className="h-fit w-fit cursor-pointer whitespace-nowrap text-sm font-medium leading-[150%] text-text-secondary"
            >
              View more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
