import MainButton from "@/components/button/MainButton";
import { handleCloseModal } from "@/public/utils/lib";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

type Props = {
  handleDeleteInvoice: (invoice_id: any) => void;
  setShowPopup: (value: boolean) => void;
  isLoading: boolean;
  invoiceId: any;
  message: string;
  setMessage: (value: string) => void;
  popupRef: any;
};
const ConfirmPopup = ({
  setShowPopup,
  handleDeleteInvoice,
  isLoading,
  invoiceId,
  message,
  setMessage,
  popupRef,
}: Props) => {
  useEffect(() => {
    handleCloseModal(popupRef, () => {
      setShowPopup(false);
    });
  }, []);
  return (
    <div
      ref={popupRef}
      className="flex w-[800px] flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10"
    >
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        What is the reason to void this invoice?
      </h3>
      <textarea
        className="w-full resize-none rounded-lg border border-[#DEDEDE] bg-[#FFFFFF] p-4 text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary hover:outline-none focus:outline-none active:outline-none"
        name=""
        id=""
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Explain your reason for voiding this invoice (required)"
        cols={10}
        rows={10}
        required
      ></textarea>
      <div className="flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
        <button
          disabled={isLoading}
          onClick={() => {
            setShowPopup && setShowPopup(false);
          }}
          className="w-fit rounded-lg border border-[#BDC6DE] bg-[#fff] px-6 py-3 text-[#6A6A6C]"
        >
          Cancel
        </button>
        {isLoading ? (
          <button
            disabled={isLoading}
            onClick={() => {
              handleDeleteInvoice && handleDeleteInvoice(invoiceId);
            }}
            className="flex w-fit flex-row items-center justify-center gap-1 rounded-lg bg-primary px-6 py-3 text-white hover:bg-btn-hover"
          >
            <>
              <CircularProgress color="inherit" size={16} />
              <p>...Loading</p>
            </>
          </button>
        ) : (
          <MainButton
            disabled={isLoading || message === ""}
            title="Void Invoice"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteInvoice && handleDeleteInvoice(invoiceId);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmPopup;
