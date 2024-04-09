import { getCreatedData, getCreatedInvoice } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch } from "@/public/hook/hooks";
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
  popupRef: any;
};

const WarningConfirm = ({
  invoiceInfo,
  tx,
  setTx,
  setShowPopup,
  popupRef,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
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
        await dispatch(getCreatedInvoice({}));
        await dispatch(getCreatedData({}));
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

  useEffect(() => {
    handleCloseModal(popupRef, () => {
      setShowPopup(false);
    });
  }, []);
  return (
    <div
      ref={popupRef}
      className="flex w-[750px] flex-col gap-8 rounded-xl bg-white p-10"
    >
      <div className="flex flex-row items-center justify-start gap-2">
        <Image
          src="/icon/icon-warning.gif"
          alt="pending"
          width={36}
          height={36}
        />
        <h2 className="text-2xl font-semibold leading-9 text-text-primary">
          Are you sure you want to mark this invoice as paid?
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <p className="text-sm font-normal leading-[21px] text-text-primary">
          Please check the Transaction Hash again.
        </p>

        <div className="relative w-full rounded border border-[#FB8A00] p-4">
          <input
            className="w-full text-sm font-normal leading-[21px] text-[#444445] outline-none hover:outline-none focus:outline-none active:outline-none"
            // placeholder="Transaction Hash"
            type="text"
            required
            onChange={(e) => setTx(e.target.value)}
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
        </div>
        <div className="flex w-full flex-row items-center justify-start gap-3 rounded bg-[#FFF7E6] p-4 text-xs font-normal leading-[18px] text-text-primary">
          <Image
            src="/icon/icon-info-warning.svg"
            width={24}
            height={24}
            alt=""
          />
          <p>
            Thank you for submitting the transaction hash. However{" "}
            <b>the transaction hash does not match your wallet address</b> or
            the difference in payment amount.
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
            <p>Saving...</p>
          </button>
        ) : (
          <MainButton
            disabled={isLoading || !tx}
            title="OK"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              handelUpdateInvoiceStatus();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WarningConfirm;
