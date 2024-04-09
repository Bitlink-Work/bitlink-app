import MainButton from "@/components/button/MainButton";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import {
  selectPartnersLogoBackground,
  setPartnerLogoBackground,
} from "@/public/reducers/partnerSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {
  partner: any;
  setPartner: (partner: any) => void;
  setShowHistory: (showHistory: boolean) => void;
  setShowContactDetail?: (showContactDetail: boolean) => void;
};

const backgroundColor = [
  "#E1AFD1",
  "#AD88C6",
  "#265073",
  "#2D9596",
  "#F4A259",
  "#F25C05",
  "#FF2E63",
  "#247BA0",
  "#70C1B3",
  "#FF1654",
  "#836FFF",
  "#1B3C73",
  "#2A9134",
  "#EA526F",
];

const Partner = ({
  partner,
  setPartner,
  setShowHistory,
  setShowContactDetail,
}: Props) => {
  const router = useRouter();
  const partnersLogoBackground = useAppSelector(selectPartnersLogoBackground);
  const randomColor = Math.floor(Math.random() * backgroundColor.length);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (partner?.logo) {
      return;
    } else {
      dispatch(
        setPartnerLogoBackground({
          partner_id: partner?.partner_id,
          color: backgroundColor[randomColor],
        }),
      );
    }
  }, []);

  return (
    <div className="flex w-full items-center justify-start rounded-xl border border-[#DEDEDE] bg-[#fff] px-6 py-4">
      <div className="flex flex-1 flex-row items-center gap-6">
        {partner?.logo ? (
          <Image src={partner?.logo} width={40} height={40} alt="" />
        ) : (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full `}
            style={{
              backgroundColor: partnersLogoBackground[partner?.partner_id],
            }}
          >
            {partner?.logo ? (
              <Image src={partner?.logo} width={40} height={40} alt="" />
            ) : (
              <p className="text-sm font-medium leading-[150%] text-[#fff]">
                {partner?.type === EnumTypeProfile.Freelancer
                  ? `${partner?.partner_first_name?.charAt(
                      0,
                    )}${partner?.partner_last_name?.charAt(0)}`
                  : partner?.partner_company?.charAt(0)}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col items-start gap-[6px]">
          <p className="text-sm font-medium leading-[150%] text-text-primary">
            {partner?.type === EnumTypeProfile.Freelancer
              ? `${partner?.partner_first_name} ${partner?.partner_last_name}`
              : partner?.partner_company}
          </p>
          <button
            onClick={() => {
              toast.info("Coming soon!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                transition: Bounce,
              });
            }}
            className="w-fir h-fit border-none bg-transparent 
          text-sm font-normal leading-[150%] text-[#D93F21] outline-none 
          focus:outline-none active:outline-none"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex flex-row items-start gap-6 text-sm font-medium leading-[150%] text-text-primary">
        <button
          onClick={() => {
            setPartner && setPartner(partner);
            setShowHistory && setShowHistory(true);
            // router.push("/customers", {
            //   query: { partner_id: partner?.partner_id },
            // });
          }}
          className="flex flex-row items-center justify-center gap-[10px] rounded-xl border border-[#DEDEDE] px-6 py-3"
        >
          <span>History</span>
          <Image
            src="/images/partner/clock-circle.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>
        <button
          onClick={() => {
            setPartner && setPartner(partner);
            setShowContactDetail && setShowContactDetail(true);
            // router.push("/customers", {
            //   query: { partner_id: partner?.partner_id },
            // });
          }}
          className="[px-6 py-3] flex flex-row items-center justify-center gap-[10px] 
        rounded-xl border border-[#DEDEDE] px-6 py-3"
        >
          <span>Contact Detail</span>
          <Image
            src="/images/partner/contacts.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>
        <MainButton
          title="Create New Invoice"
          onClick={() =>
            router.push({
              pathname: "/create-invoice",
              query: { partner_id: partner?.partner_id },
            })
          }
          className="h-[53px]"
        />
      </div>
    </div>
  );
};

export default Partner;
