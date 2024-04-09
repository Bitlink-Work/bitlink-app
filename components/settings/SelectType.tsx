import { getProfile, updateUserType } from "@/public/actions";
import { useAppDispatch } from "@/public/hook/hooks";
import { EnumTypeProfile } from "@/public/utils/constants";
import { handleCloseModal } from "@/public/utils/lib";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";
import MainButton from "../button/MainButton";

type Props = {
  profile: any;
  setShowChangeType: (value: boolean) => void;
};

const SelectType = ({ profile, setShowChangeType }: Props) => {
  const dispatch = useAppDispatch();
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateUserType = async () => {
    try {
      setIsLoading(true);
      if (userType !== profile?.type) {
        if (userType === EnumTypeProfile.Business) {
          localStorage.removeItem("isSubmit");
          localStorage.setItem("isSubmit", "0");
        }
        const res = await dispatch(
          updateUserType({
            user_id: profile?.user_id,
            type: userType,
          }),
        );
        if (res) {
          dispatch(getProfile({}));
          toast.success("User type updated successfully", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      toast.error("Update user type failed", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
      setShowChangeType(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setUserType(profile?.type);
    }
  }, []);

  const popupRef = useRef(null);

  useEffect(() => {
    handleCloseModal(popupRef, () => {
      setUserType(profile?.type);
      setShowChangeType(false);
    });
  }, []);
  return (
    <div
      ref={popupRef}
      className="flex flex-col gap-4 rounded-xl border border-[#DEDEDE] bg-white p-6"
    >
      <div className="flex flex-col items-start gap-[6px]">
        <div className="flex w-full flex-row items-start justify-between">
          <h4 className="text-sm font-semibold leading-[21px] text-text-primary">
            Select a User type
          </h4>
          <button
            className="p-[5px]"
            onClick={() => {
              setUserType(profile?.type);
              setShowChangeType(false);
            }}
          >
            <Image
              src="/images/partner/close.svg"
              width={14}
              height={14}
              alt="User type"
            />
          </button>
        </div>
        <p className="text-sm font-normal leading-[21px] text-[#444445]">
          Select your user type from the options to get started.
        </p>
      </div>
      <div className="h-[1px] w-full bg-[#E9E9E9]"></div>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setUserType("FREELANCER")}
          className={`${
            userType === EnumTypeProfile.Freelancer
              ? "border-[#2B4896] bg-[#EAEDF5]"
              : "border-[#DEDEDE] bg-white"
          } flex h-[73.5px] w-[480px] items-center justify-center gap-4 rounded-xl border  px-4 py-3 text-sm font-medium leading-[21px] text-text-primary`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.2126 5.52684C13.2126 8.31705 11.0046 10.5537 8.25 10.5537C5.49543 10.5537 3.28737 8.31705 3.28737 5.52684C3.28737 2.73663 5.49543 0.5 8.25 0.5C11.0046 0.5 13.2126 2.73663 13.2126 5.52684ZM0.75 16.2464C0.75 13.6621 4.20422 13.0152 8.25 13.0152C12.3168 13.0152 15.75 13.6844 15.75 16.2687C15.75 18.8531 12.2948 19.5 8.25 19.5C4.1832 19.5 0.75 18.8298 0.75 16.2464Z"
              fill="#202124"
            />
          </svg>
          <p>Individual</p>
        </button>
        <button
          onClick={() => setUserType("BUSINESS")}
          className={`${
            userType === EnumTypeProfile.Business
              ? "border-[#2B4896] bg-[#EAEDF5]"
              : "border-[#DEDEDE] bg-white"
          } flex h-[73.5px] w-[480px] items-center justify-center gap-4 rounded-xl border px-4 py-3 text-sm font-medium leading-[21px] text-text-primary`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="16"
            viewBox="0 0 23 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.4083 4.23285C15.4083 6.58254 13.5351 8.4666 11.199 8.4666C8.86292 8.4666 6.98974 6.58254 6.98974 4.23285C6.98974 1.88227 8.86292 0 11.199 0C13.5351 0 15.4083 1.88227 15.4083 4.23285ZM11.199 16C7.76785 16 4.83809 15.456 4.83809 13.2802C4.83809 11.1034 7.74904 10.5396 11.199 10.5396C14.6302 10.5396 17.56 11.0836 17.56 13.2604C17.56 15.4362 14.649 16 11.199 16ZM17.2071 4.30922C17.2071 5.50703 16.8498 6.62288 16.223 7.55051C16.1586 7.64597 16.2159 7.77476 16.3296 7.79457C16.4863 7.82159 16.6484 7.8369 16.8131 7.8414C18.4562 7.88463 19.9309 6.82102 20.3383 5.21974C20.9418 2.84123 19.1698 0.705896 16.9134 0.705896C16.6681 0.705896 16.4335 0.732013 16.2051 0.778845C16.1738 0.78605 16.1407 0.800459 16.1228 0.828378C16.1013 0.862601 16.1174 0.908532 16.1389 0.938252C16.8167 1.8938 17.2071 3.05918 17.2071 4.30922ZM19.9282 9.51257C21.0323 9.72962 21.7584 10.1727 22.0593 10.8166C22.3136 11.3453 22.3136 11.9586 22.0593 12.4864C21.599 13.4851 20.1154 13.8058 19.5387 13.8886C19.4196 13.9066 19.3238 13.8031 19.3364 13.6833C19.6309 10.9157 17.2877 9.60353 16.6815 9.30183C16.6555 9.28832 16.6502 9.2676 16.6528 9.255C16.6546 9.24599 16.6654 9.23158 16.6851 9.22888C17.9968 9.20456 19.4071 9.38468 19.9282 9.51257ZM5.68711 7.84131C5.85186 7.83681 6.01304 7.8224 6.17063 7.79448C6.28434 7.77467 6.34165 7.64588 6.27718 7.55042C5.6504 6.62279 5.29313 5.50694 5.29313 4.30913C5.29313 3.05909 5.68353 1.89371 6.36135 0.938162C6.38284 0.908442 6.39806 0.862511 6.37746 0.828288C6.35956 0.80127 6.32553 0.78596 6.29509 0.778755C6.06586 0.731923 5.83127 0.705806 5.58593 0.705806C3.32951 0.705806 1.55751 2.84114 2.16191 5.21965C2.56932 6.82093 4.04405 7.88454 5.68711 7.84131ZM5.84694 9.25446C5.84962 9.26796 5.84425 9.28778 5.81918 9.30219C5.2121 9.60389 2.86883 10.9161 3.16342 13.6827C3.17595 13.8034 3.08104 13.9061 2.96195 13.889C2.38531 13.8061 0.901629 13.4855 0.441392 12.4867C0.186203 11.9581 0.186203 11.3457 0.441392 10.817C0.742248 10.1731 1.46752 9.72998 2.57156 9.51203C3.09358 9.38504 4.50294 9.20492 5.8156 9.22924C5.8353 9.23194 5.84515 9.24635 5.84694 9.25446Z"
              fill="#202124"
            />
          </svg>
          <p>Organization</p>
        </button>
      </div>
      <div className="flex justify-end">
        <MainButton
          bold
          hideBorder
          disabled={
            isLoading ||
            userType === profile?.type ||
            profile?.type === EnumTypeProfile.Business
          }
          title={isLoading ? "...Saving" : "Save"}
          onClick={handleUpdateUserType}
        />
      </div>
    </div>
  );
};

export default SelectType;
