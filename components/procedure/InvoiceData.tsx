"use client";
import { getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import bigMark from "@/public/images/procedure/bigMark.gif";
import icFile from "@/public/images/procedure/icFile.png";
import icHand from "@/public/images/procedure/icHand.png";
import icSetting from "@/public/images/procedure/icSetting.png";
import icSocket from "@/public/images/procedure/icSocket.png";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import MainButton from "../button/MainButton";

const InvoiceData = ({ setStepPro }: any) => {
  const data = [
    {
      id: 1,
      icon: icHand,
      title: "Hand input",
    },
    {
      id: 2,
      icon: icSetting,
      title: "Automatic CCIP",
    },

    {
      id: 3,
      icon: icSocket,
      title: "Push API",
    },
    {
      id: 4,
      icon: icFile,
      title: "Batch file",
    },
  ];
  const router = useRouter();
  const [item, setItem] = useState<any>(data[0]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(1);
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleClick = () => {
    if (item?.id) {
      setSelectedItemId(item.id);
    }
    if (item?.id === 1) {
      router.push("/home?step=5");
    }
  };
  return (
    <div className="flex w-full justify-center text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="h-full w-full bg-[#FDFCFB] p-[60px] md:w-[56%]">
        <div className="flex w-full items-center justify-between text-[#98999A]">
          <div className="text-[16px] font-normal leading-[24px]">Step 2/9</div>
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
        <div className="mt-[80px] flex w-full flex-col items-center gap-y-[80px] md:mx-auto md:w-[661px]">
          <div className="text-[36px] font-semibold leading-[54px]">
            How would you want to input your invoice data?
          </div>
          <div className="flex flex-col items-center justify-center gap-y-[11px]">
            {data.map((item: any, index: number) => {
              return (
                <button
                  disabled={item.title !== "Hand input"}
                  onClick={() => {
                    setItem(item);
                    setSelectedItemId(item.id);
                  }}
                  key={index}
                  className={`group relative flex h-[56px] w-[400px] items-center justify-center rounded-[6px] border-[1px] border-solid ${
                    selectedItemId === item.id
                      ? "border-[#2B4896] bg-[#EAEDF5]"
                      : "border-[#DEDEDE]"
                  }`}
                >
                  <div className="mr-[8px] h-[24px] w-[24px] group-disabled:opacity-60">
                    <Image src={item.icon} alt="icon" objectFit="cover" />
                  </div>
                  <div className="text-[12px] font-medium leading-[18px] text-[#000] group-disabled:opacity-60">
                    {item.title}
                  </div>
                  {item.title !== "Hand input" && (
                    <Image
                      className="absolute left-[-5.5px] top-[-11.36px]"
                      width={113.08}
                      height={47.36}
                      src="/images/procedure/coming_soon.png"
                      alt="arrow"
                      objectFit="cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex w-full items-center justify-between">
            <button
              onClick={() => {
                router.push("/home?step=3");
              }}
              className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
            >
              Back
            </button>
            <MainButton
              title="Continue"
              icon={arrowRight}
              bold
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center rounded-l-2xl bg-primary md:w-[44%]">
        <div className="h-[400px] w-[400px] mix-blend-color-dodge">
          <Image src={bigMark} alt="tree gif" objectFit="cover" />
        </div>
      </div>
    </div>
  );
};
export default InvoiceData;
