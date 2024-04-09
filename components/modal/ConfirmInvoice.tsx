import { getCreatedData, getCreatedInvoice } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch } from "@/public/hook/hooks";
import { EnumTypeProfile } from "@/public/utils/constants";
import { handleCloseModal } from "@/public/utils/lib";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import MainButton from "../button/MainButton";

type Props = {
  invoiceInfo: any;
  tx: string;
  setTx: (value: string) => void;
  setShowPopup: (value: boolean) => void;
  setShowWarning: (value: boolean) => void;
  popupRef: any;
};

const ConfirmInvoice = ({
  invoiceInfo,
  tx,
  setTx,
  setShowPopup,
  setShowWarning,
  popupRef,
}: Props) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const dispatch = useAppDispatch();
  const handelUpdateInvoiceStatus = async () => {
    try {
      setIsLoading(true);
      const res = await invoiceServices.updateInvoiceStatus({
        invoice_id: invoiceInfo?.invoice_id,
      });
      if (res) {
        toast.success("Update invoice status successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Update invoice status failed", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    } finally {
      setTx("");
      setIsLoading(false);
      setShowPopup(false);
    }
  };
  const checkInvoicePayment = async () => {
    try {
      setIsLoading(true);
      const res = await invoiceServices.checkInvoicePayment({
        invoice_id: invoiceInfo?.invoice_id,
        tx_hash: tx,
      });

      if (res) {
        handelUpdateInvoiceStatus();
        await dispatch(getCreatedInvoice({}));
        await dispatch(getCreatedData({}));
      } else {
        setShowWarning(true);
      }
    } catch (error) {
      const res: any = { error };
      toast.error("This transaction information does not match the Invoice.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
      setShowWarning(true);
    } finally {
      setShowPopup(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCloseModal(popupRef, () => {
      setShowPopup(false);
    });
  }, []);

  return (
    <div
      ref={popupRef}
      className="flex w-[680px] flex-col gap-8 rounded-xl bg-white p-10"
    >
      <div className="flex flex-row items-center justify-start gap-2">
        <Image
          src="/icon/icon-stick-done.gif"
          alt="pending"
          width={36}
          height={36}
        />
        <h2 className="text-2xl font-semibold leading-9 text-text-primary">
          Payment Confirmation
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <p className="text-sm font-normal leading-[21px] text-text-primary">
          I confirm that the recipient for Invoice #{invoiceInfo?.invoice_id}
          has been successfully paid and processed.
        </p>
        <div className="flex flex-col gap-[12px] rounded-[18px] border border-[#EBEFF6] px-6 py-4">
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-normal leading-[21px] text-text-primary">
              Invoice no
            </p>
            <p className="text-sm font-semibold leading-[21px] text-text-primary">
              #{invoiceInfo?.invoice_id}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-normal leading-[21px] text-text-primary">
              Recipient information
            </p>
            <div className="text-end">
              <p className="text-sm font-semibold leading-[21px] text-text-primary">
                {invoiceInfo?.partner_type === EnumTypeProfile.Freelancer
                  ? `${invoiceInfo?.to_first_name} ${invoiceInfo?.to_last_name}`
                  : invoiceInfo?.to_company}{" "}
                <br />
                {invoiceInfo?.to_email}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-normal leading-[21px] text-text-primary">
              Amount due
            </p>
            <p className="text-sm font-semibold leading-[21px] text-text-primary">
              {invoiceInfo?.currency} {invoiceInfo?.total_value}
            </p>
          </div>
        </div>
        <div className="relative w-full rounded border border-[#DEDEDE] p-4">
          <input
            className="w-full text-sm font-normal leading-[21px] text-[#444445] outline-none hover:outline-none focus:outline-none active:outline-none"
            // placeholder="Transaction Hash"
            type="text"
            required
            onChange={(e) => {
              if (e.target.value.trim() === "") {
                setTx(e.target.value);
                setIsEmpty(true);
              } else {
                setTx(e.target.value);
                setIsEmpty(false);
              }
            }}
            value={tx}
          />
          <div
            className={`absolute  ${
              tx
                ? "left-2 top-0 translate-y-[-50%] px-2 text-xs"
                : "left-4 top-[50%] translate-y-[-50%]  text-sm"
            }`}
          >
            <p className="relative z-20">Transaction Hash</p>
            <div
              className={`${
                tx ? "block" : "hidden"
              } absolute left-0 top-[calc(50%)] z-0 h-[2px] w-full -translate-y-[calc(50%+0.5px)] bg-white`}
            ></div>
          </div>
          {isEmpty && (
            <p className="absolute left-0 top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
              This field is required
            </p>
          )}
        </div>
        <div className="flex w-full flex-row items-center justify-start gap-3 rounded bg-[#E6F7FF] p-4 text-xs font-normal leading-[18px] text-text-primary">
          <Image src="/icon/icon-info.svg" width={24} height={24} alt="" />
          <p>
            Please provide the Transaction Hash for tracking purposes. Click on
            the Confirm button to confirm that your invoice has been
            successfully paid by the recipient.
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <MainButton
          disabled={isLoading}
          title="Cancel"
          outline
          bold
          onClick={() => {
            setTx("");
            setIsEmpty(false);
            setShowPopup(false);
          }}
        />
        {isLoading ? (
          <button
            className={`flex w-fit flex-row items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold leading-[21px] text-white`}
          >
            <CircularProgress
              style={{
                color: "#ffffff",
              }}
              size={16}
            />
            <p>...Saving</p>
          </button>
        ) : (
          <MainButton
            disabled={isLoading || !tx}
            title="Confirm"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              checkInvoicePayment();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmInvoice;
