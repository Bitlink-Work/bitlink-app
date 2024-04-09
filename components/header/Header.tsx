"use client";
import { useInstructionsContext } from "@/context/InstructionsProvider";
import IconVerifyUser from "@/icon/icon-verify-user.svg";
import completeVerify from "@/images/kyc/completeVerify.svg";
import {
  getCreatedInvoice,
  getProfile,
  getReceivedInvoice,
} from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import { addressWalletCompact } from "@/public/utils/lib";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Instructions from "../instructions/Instructions";
import KybItem from "../kyb/components/KybItem";
import KycItem from "../kyc/components/KycItem";
import Notifications from "../notifications/Notifications";

type Props = {
  type?: string;
  handleReset?: () => void;
};

const Profile = ({ profile }: any) => {
  return (
    <Instructions step={0} title="Profile">
      <div className="group relative flex flex-row items-center justify-center gap-3">
        <div className="relative flex flex-col items-end">
          <p className="text-sm font-medium leading-[21px] text-[#636363]">
            {profile?.type === EnumTypeProfile.Freelancer
              ? profile?.first_name &&
                profile?.last_name &&
                profile?.first_name !== "" &&
                profile?.last_name !== ""
                ? `${profile?.first_name} ${profile?.last_name}`
                : profile?.name && profile?.name !== ""
                  ? profile?.name
                  : ""
              : profile?.company_name && profile?.company_name !== ""
                ? profile?.company_name
                : profile?.name && profile?.name !== ""
                  ? profile?.name
                  : ""}
          </p>
          <p className="text-xs font-normal leading-[18px] text-[#9FA7BE]">
            {profile?.email_google
              ? profile?.email_google
              : addressWalletCompact(profile?.public_address)}
          </p>
        </div>
        <Link
          href={"/settings"}
          className="relative h-10 w-fit overflow-hidden"
        >
          {profile?.type && (
            <Image
              src={
                profile?.type === EnumTypeProfile.Freelancer
                  ? "/images/header/user.svg"
                  : "/images/header/business.svg"
              }
              width={profile?.type === "FREELANCER" ? 40 : 60.17}
              height={40}
              alt=""
            />
          )}
        </Link>
      </div>
    </Instructions>
  );
};

const VerifyUser = ({ type }: { type: EnumTypeProfile }) => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  return (
    <Instructions step={1} title="KYC, KYB Verification">
      <div className="group relative flex h-8 w-8 cursor-pointer items-center justify-center after:absolute after:-inset-x-8 after:top-full after:block after:h-4">
        {profile?.is_verified === true ? (
          <Image src={completeVerify} alt="complete" />
        ) : (
          <>
            <Image src={IconVerifyUser} alt="icon" />
            {type === EnumTypeProfile.Freelancer ? <KycItem /> : <KybItem />}
          </>
        )}
      </div>
    </Instructions>
  );
};

const CreateInvoice = () => {
  const { step } = useInstructionsContext();
  return (
    <Instructions step={2} title="Create Invoice">
      <Link
        href={step === 2 ? "/home?step=3" : "/create-invoice"}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary drop-shadow-[0px_2.824px_11.294px_rgba(217,217,217,0.32)] hover:bg-btn-hover"
      >
        <Image src="/images/header/plus.svg" width={20} height={20} alt="" />
      </Link>
    </Instructions>
  );
};

const Header = ({ handleReset, type }: Props) => {
  const { handleSubmit, register, setValue } = useForm();
  const router = useRouter();
  const pathName = usePathname();
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    if (type === "sent") {
      await dispatch(
        getCreatedInvoice({
          page: 1,
          page_size: 10,
          invoice_id: data.search,
          status: "ALL",
        }),
      );
      setValue("search", "");
    } else {
      await dispatch(
        getReceivedInvoice({
          page: 1,
          page_size: 10,
          invoice_id: data.search,
          status: "ALL",
        }),
      );
      setValue("search", "");
    }
  };

  return (
    <div className="shadow-[0px 4px 20px 0px rgba(0,0,0,0.03)] flex h-[80px] w-full items-center justify-between border-b-[0.25px] border-[#DEDEDE] bg-[#FDFCFB] px-10">
      {pathName !== "/create-invoice" &&
      pathName !== "/kyb" &&
      pathName !== "/kyc" &&
      pathName !== "/document/sign" &&
      pathName !== "/invoices/edit" ? (
        <div className="flex w-[320px] items-center justify-between gap-4 rounded-lg bg-[#fff] px-4 py-2 shadow-[0px_3px_8px_0px_rgba(0,0,0,0.08)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 items-center gap-2"
          >
            <div className="h-6 w-[1px] bg-primary"></div>
            <input
              {...register("search")}
              className="h-full w-full border-none text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-[#98999A] focus:outline-none active:outline-none"
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setValue("search", e.target.value);
              }}
            />
            <button type="submit" hidden></button>
          </form>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary drop-shadow-[0px_2.824px_11.294px_rgba(217,217,217,0.32)] hover:bg-btn-hover"
          >
            <Image
              src="/images/header/search.svg"
              width={16}
              height={16}
              alt=""
            />
          </button>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push("/dashboard");
          }}
          className="flex h-8 w-8 cursor-pointer items-center justify-center"
        >
          <Image
            src="/images/header/close.svg"
            width={18.667}
            height={18.667}
            alt=""
          />
        </div>
      )}
      <div className="flex w-fit flex-row items-center justify-center gap-8 ">
        {pathName === "/create-invoice" ? (
          <button onClick={() => handleReset && handleReset()}>
            <Image
              src="/images/invoices/reload.svg"
              width={32}
              height={32}
              alt=""
            />
          </button>
        ) : (
          <CreateInvoice />
        )}
        <div className="h-10 w-[1px] bg-[#DEDEDE]"></div>
        <VerifyUser type={profile?.type} />
        <div className="group relative flex h-8 w-8 cursor-pointer items-center justify-center after:absolute after:-inset-x-8 after:top-full after:block after:h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="24"
            viewBox="0 0 21 24"
            fill="none"
            className="fill-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.2485 8.1556C18.2485 9.66271 18.6468 10.551 19.5234 11.5747C20.1877 12.3289 20.4 13.297 20.4 14.3472C20.4 15.3963 20.0553 16.3922 19.3648 17.2007C18.4608 18.17 17.1859 18.7888 15.8847 18.8964C13.9991 19.0571 12.1124 19.1925 10.2006 19.1925C8.28761 19.1925 6.40206 19.1115 4.5165 18.8964C3.21415 18.7888 1.93922 18.17 1.0364 17.2007C0.345864 16.3922 0 15.3963 0 14.3472C0 13.297 0.213481 12.3289 0.876586 11.5747C1.7806 10.551 2.1527 9.66271 2.1527 8.1556V7.64436C2.1527 5.62601 2.656 4.30622 3.69239 3.01423C5.23328 1.13004 7.70322 0 10.1469 0H10.2543C12.7504 0 15.3003 1.18442 16.8149 3.1496C17.7977 4.415 18.2485 5.67919 18.2485 7.64436V8.1556ZM6.68856 21.6727C6.68856 21.0684 7.24314 20.7917 7.75597 20.6732C8.35586 20.5463 12.0113 20.5463 12.6112 20.6732C13.124 20.7917 13.6786 21.0684 13.6786 21.6727C13.6488 22.248 13.3113 22.7581 12.8449 23.082C12.2403 23.5533 11.5307 23.8518 10.7888 23.9594C10.3786 24.0126 9.97546 24.0138 9.57951 23.9594C8.8365 23.8518 8.12688 23.5533 7.52341 23.0807C7.05589 22.7581 6.71838 22.248 6.68856 21.6727Z"
              // fill="#202124"
            />
          </svg>
          <Notifications />
        </div>
        <div className="h-10 w-[1px] bg-[#DEDEDE]"></div>
        {profile && (
          <Profile
            // name={profile?.name}
            // email={profile?.email_google}
            // avatar={profile?.avatar}
            // user_type={profile?.type}
            // public_address={profile?.public_address}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
};
export default Header;
