import { kycServices } from "@/public/api/kycService";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type UserInfo = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  country: string;
  card_type: string;
  card_first_name: string;
  card_last_name: string;
  card_number: string;
  dob: string;
  email: string;
  front_card: string;
  back_card: string;
  verify_image: string;
};

const KYCVerification = () => {
  const param = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchUserInfo = async () => {
    const res = await kycServices.getKYC(param?.user_id as string);

    if (res) {
      let info: any = { ...res };
      setUserInfo(info);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [param?.user_id]);

  return (
    <div className="relative flex h-fit w-full items-center justify-center bg-[#F4F4F4] py-16">
      <Image
        className="absolute right-0 top-0 z-0"
        src="/images/kyc/logo.svg"
        alt=""
        width={320}
        height={320}
      />
      <div className="m-auto flex h-fit w-fit max-w-[1440px] flex-col gap-6">
        <div className="flex flex-row items-center justify-start gap-3">
          <Image
            src="/images/register/icCheck.png"
            alt=""
            width={36}
            height={36}
          />
          <div className="flex flex-row items-center justify-start gap-4">
            <h2 className="text-2xl font-semibold leading-9 text-[#202124]">
              Verify KYC
            </h2>
            <div className="h-6 w-[1px] bg-[#DEDEDE]"></div>
            <div className="flex flex-row items-center justify-start gap-[6px] text-sm leading-[21px]">
              <p className="font-semibold text-[#2B4896]">No.</p>
              <p className="font-medium text-[#444445]">0001276</p>
            </div>
          </div>
        </div>
        <div className="z-10 flex h-fit w-full flex-col gap-8 rounded-xl border border-[#DEDEDE] bg-white p-8">
          <div className="flex w-full flex-col gap-6">
            <div className="grid w-full grid-cols-2 items-start justify-between gap-20">
              <div className="flex w-fit flex-col gap-4">
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">First name</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.first_name}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Last name</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.last_name}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Email address</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.email}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Country</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.country}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Date of birth</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.dob}
                  </p>
                </div>
              </div>
              <div className="flex w-fit flex-col gap-4">
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Card Type</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.card_type}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Card First Name</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.card_first_name}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Card Last Name</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.card_last_name}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
                <div className="flex flex-row items-center justify-between text-sm leading-[21px]">
                  <p className="font-normal text-[#444445]">Card Number</p>
                  <p className="font-medium text-text-primary">
                    {userInfo?.card_number}
                  </p>
                </div>
                <div className="h-0 w-[548px] border border-dashed border-[#BDC6DE]"></div>
              </div>
            </div>
            <div className="w-fill flex flex-row items-center justify-between px-20">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-base font-semibold leading-6 text-text-primary">
                  Front card
                </p>
                <Image
                  src={userInfo?.front_card ? userInfo.front_card : ""}
                  alt=""
                  width={448.47}
                  height={275}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-base font-semibold leading-6 text-text-primary">
                  Backside card
                </p>
                <Image
                  src={userInfo?.back_card ? userInfo.back_card : ""}
                  alt=""
                  width={448.47}
                  height={275}
                />
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 text-sm font-semibold leading-[21px]">
            <button className="w-full rounded-lg border border-[#BDC6DE] bg-white px-6 py-3 text-[#444445]">
              Deny
            </button>
            <button className="w-full rounded-lg border-none bg-primary px-6 py-3 text-white outline-none hover:bg-btn-hover hover:outline-none active:outline-none">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
