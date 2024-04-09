"use client";
import { getProfile } from "@/public/actions";

import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { addressWalletCompact } from "@/public/utils/lib";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { EnumTypeProfile } from "@/public/utils/constants";
type Props = {
  setShowEditInfo: (show: boolean) => void;
};

const sender = {
  fistName: "Phuc",
  lastName: "Ha",
  company: "Western Sydney University",
  address: "90M HQV",
  city: "Ho Chi Minh City",
  postal_code: "07000 Phu Thuan",
  country: "Vietnam",
  email: "etteam8@gmail.com",
};

const ReviewSender = ({ setShowEditInfo }: any) => {
  const profile: IProfile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);
  const { setIsOpen, setIsOwner } = useInvoiceContext();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <div className="flex flex-row items-center gap-[6px] text-sm font-semibold leading-[150%] text-text-primary">
        <h5>From</h5>
        <button
          onClick={() => {
            setShowEditInfo && setShowEditInfo(true);
            setIsOpen(true);
            setIsOwner(false);
          }}
          className="flex h-[16px] w-[16px] cursor-pointer items-center justify-center"
        >
          <Image
            src="/images/invoices/edit.svg"
            width={12}
            height={12}
            alt=""
          />
        </button>
      </div>
      <div className="flex flex-col items-start gap-[3px] text-sm font-normal leading-normal text-text-primary">
        <div className="flex flex-row items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
          >
            <path
              d="M8.9997 2.2998C7.0113 2.2998 5.3997 3.9114 5.3997 5.8998V6.4998C5.3997 8.4882 7.0113 10.0998 8.9997 10.0998C10.9881 10.0998 12.5997 8.4882 12.5997 6.4998V5.8998C12.5997 3.9114 10.9881 2.2998 8.9997 2.2998ZM8.99853 11.8998C6.59492 11.8998 3.51093 13.1999 2.62353 14.3537C2.07513 15.0671 2.59717 16.0998 3.49657 16.0998H14.5017C15.4011 16.0998 15.9231 15.0671 15.3747 14.3537C14.4873 13.2005 11.4021 11.8998 8.99853 11.8998Z"
              fill="#1890FF"
            />
          </svg>
          <p className="font-semibold">
            {profile?.type === EnumTypeProfile.Freelancer
              ? profile?.first_name &&
                profile?.last_name &&
                profile?.first_name !== "" &&
                profile?.last_name !== ""
                ? `${profile?.first_name} ${profile?.last_name}`
                : addressWalletCompact(profile?.public_address)
              : profile?.company_name && profile?.company_name !== ""
                ? profile?.company_name
                : addressWalletCompact(profile?.public_address)}
          </p>
        </div>
        <p>{profile?.email_google}</p>
        <p>{profile?.address_line_1}</p>
        <p>{profile?.address_line_2}</p>
        <p>
          {profile?.postal_code} {profile?.city}
        </p>
        <p>{profile?.country}</p>
      </div>
    </div>
  );
};

export default ReviewSender;
