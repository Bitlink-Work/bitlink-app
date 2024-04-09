import { handleCloseModal } from "@/public/utils/lib";
import { useEffect, useRef } from "react";

interface Props {
  onOpen?: any;
  onClick?: any;
  receiver?: any;
  invoiceInfo?: any;
  formValues?: any;
  totalBill?: any;
}

export default function ConfirmCreate({
  onOpen,
  onClick: handleCreateInvoiceAndSend,
  receiver,
  invoiceInfo,
  formValues,
  totalBill,
}: Props) {
  const handleSendNow = () => {
    handleCreateInvoiceAndSend();
    localStorage.removeItem("dataInvoice");
    localStorage.removeItem("logoUrl");
    localStorage.removeItem("dataChain");
    localStorage.removeItem("dataPaid");

    onOpen(false);
  };

  const popupRef = useRef(null);

  useEffect(() => {
    handleCloseModal(popupRef, () => {
      onOpen(false);
    });
  }, []);

  return (
    <div
      ref={popupRef}
      className="h-[311px] w-fit rounded-xl bg-white px-[60px] py-10"
    >
      <div className="font-poppins text-2xl font-semibold leading-[36px] text-[#202124]">
        Please confirm
      </div>
      <div className="mt-8 flex items-start justify-start gap-10">
        <div className="w-[168px] whitespace-nowrap font-poppins text-sm font-normal leading-[21px] text-[#202124]">
          Recipient information
        </div>
        <div className="flex flex-col">
          <div className="font-poppins text-sm font-semibold leading-[21px]">
            {receiver?.type === "FREELANCER"
              ? `${receiver?.partner_first_name} ${receiver?.partner_last_name}`
              : `${receiver?.partner_company || invoiceInfo?.to_company || ""}`}
          </div>
          <div className="font-poppins text-sm font-semibold leading-[21px]">
            {receiver?.partner_email || invoiceInfo?.to_email || ""}
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-start gap-10">
        <div className="w-[168px] font-poppins text-sm font-normal leading-[21px] text-[#202124]">
          Amount due
        </div>
        <div className="font-poppins text-sm font-semibold leading-[21px]">
          {formValues?.currency} {totalBill || ""}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpen(false)}
          className="border-[rgba(189,198 222,1)] flex h-[45px] w-[175px] items-center justify-center rounded-lg border bg-white font-poppins text-sm font-semibold leading-[21px] text-[#444445]"
        >
          Cancel
        </button>
        <button
          onClick={handleSendNow}
          className="flex h-[45px] w-[175px] items-center justify-center rounded-lg bg-[#2B4896] font-poppins text-sm font-semibold leading-[21px] text-white"
        >
          Send now
        </button>
      </div>
    </div>
  );
}
