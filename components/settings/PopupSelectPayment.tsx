import bank from "@/images/settings/bank.svg";
import wallet from "@/images/settings/wallet.svg";
import { handleCloseModal } from "@/public/utils/lib";
import Image from "next/image";
import { useEffect, useRef } from "react";
import MainButton from "../button/MainButton";

type Props = {
  setShowPopup: (value: boolean) => void;
  selectedForm: string;
  setSelectedForm: (value: string) => void;
  setShowPopupForm: (value: boolean) => void;
};

const PopupSelectPayment = ({
  setShowPopup,
  selectedForm,
  setSelectedForm,
  setShowPopupForm,
}: Props) => {
  //   const [paymentMethod, setPaymentMethod] = useState("crypto");

  const popupRef = useRef(null);
  useEffect(() => {
    handleCloseModal(popupRef, () => {
      setSelectedForm("crypto");
      setShowPopup(false);
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
            Select a Payment Method
          </h4>
          <button
            className="p-[5px]"
            onClick={() => {
              setSelectedForm("crypto");
              setShowPopup(false);
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
          Select your payment method from the options to get started.
        </p>
      </div>
      <div className="h-[1px] w-full bg-[#E9E9E9]"></div>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setSelectedForm("crypto")}
          className={`
          ${
            selectedForm === "crypto"
              ? "border-[#2B4896] bg-[#EAEDF5]"
              : "border-[#DEDEDE] bg-white"
          }
          flex h-[73.5px] w-[480px] items-center justify-center gap-4 rounded-xl border  px-4 py-3 text-sm font-medium leading-[21px] text-text-primary`}
        >
          <Image src={wallet} alt="Wallet" />
          <p>Crypto</p>
        </button>
        <button
          onClick={() => setSelectedForm("bank")}
          className={` ${
            selectedForm === "bank"
              ? "border-[#2B4896] bg-[#EAEDF5]"
              : "border-[#DEDEDE] bg-white"
          } flex h-[73.5px] w-[480px] items-center justify-center gap-4 rounded-xl border px-4 py-3 text-sm font-medium leading-[21px] text-text-primary`}
        >
          <Image src={bank} alt="Bank" />
          <p>Bank Account</p>
        </button>
      </div>
      <div className="flex justify-end">
        <MainButton
          bold
          hideBorder
          title={"Next"}
          onClick={() => {
            setShowPopup(false);
            setShowPopupForm(true);
          }}
        />
      </div>
    </div>
  );
};

export default PopupSelectPayment;
