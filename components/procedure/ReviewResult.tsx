import { sendMail } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Popup from "../popup/Popup";
import ISOInvoice from "../standards/ISOInvoice";
import ModalConfirm from "./ModalConfirm";

// import ReviewInvoiceInfo from "../invoices/ReviewInvoiceInfo";

type Props = {};

const ReviewResult = () => {
  const profile = useAppSelector(selectProfile);
  const invoiceId = useSearchParams().get("invoice_id");
  const [invoiceInfo, setInvoiceInfo] = useState<any>();
  const dispatch = useAppDispatch();
  const [isSending, setIsSendding] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const handleClosePopup = () => {
    setShowConfirmModal(false);
  };
  const handleCreateInvoiceAndSend = async () => {
    if (profile?.is_verified) {
      try {
        setIsSendding(true);

        await dispatch(
          sendMail({
            invoice_id: invoiceId,
          }),
        );
        router.push("/home?step=13");
        localStorage.removeItem("dataInvoice");
        localStorage.removeItem("logoUrl");
        localStorage.removeItem("dataChain");
        localStorage.removeItem("dataPaid");
      } catch (error) {
        console.error("Error creating invoice:", error);
        setIsSendding(false);
      } finally {
        setIsSendding(false);
      }
    } else {
      setShowConfirmModal(true);
    }
  };

  const fetchInvoiceInfo = async () => {
    if (invoiceId) {
      const res = await invoiceServices.getInvoiceDetail(invoiceId);
      if (res) {
        setInvoiceInfo(res);
      } else {
        toast.error("Error fetching invoice info");
      }
    }
  };

  useEffect(() => {
    fetchInvoiceInfo();
  }, [invoiceId]);

  return (
    <>
      <div className=" relative flex h-fit w-full flex-col items-start justify-start gap-8 bg-primary  p-[60px] font-poppins">
        <div className=" absolute -top-[97px] right-0 -z-[0] h-[353px] w-[353px] overflow-hidden bg-[url(/images/reviews/corner.png)] "></div>
        <div className="flex w-full flex-row items-center justify-between ">
          <div className="flex flex-col items-start justify-start gap-[6px]">
            <div className="flex flex-row items-center gap-3"></div>
            <p className="text-[36px] font-semibold leading-[150%]  text-white">
              Overview
            </p>
          </div>
          <div className="z-1 absolute right-8  ">
            <div className="  flex flex-row items-center justify-center gap-6 ">
              <button
                onClick={() => {
                  router.push("/dashboard");
                  localStorage.removeItem("dataInvoice");
                  localStorage.removeItem("logoUrl");
                  localStorage.removeItem("dataChain");
                  localStorage.removeItem("dataPaid");
                }}
                className="flex w-fit items-center justify-center gap-[10px] rounded-lg border border-white bg-transparent px-6 py-3 text-sm font-semibold leading-[150%] text-white"
              >
                <span>Dashboard</span>
              </button>
              <button
                onClick={handleCreateInvoiceAndSend}
                className="flex w-fit items-center justify-center gap-[10px] rounded-lg bg-white px-6 py-3 text-sm font-semibold leading-[150%] text-text-primary"
              >
                {isSending ? (
                  <>
                    <CircularProgress color="inherit" size={16} />
                    <p>Sending...</p>
                  </>
                ) : (
                  <p>Send invoice</p>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="m-auto w-[892.5px]">
          {/* <ReviewInvoiceInfo invoiceInfo={invoiceInfo} /> */}
          <ISOInvoice
            invoiceInfo={invoiceInfo}
            fetchInvoiceInfo={fetchInvoiceInfo}
          />
        </div>
      </div>
      <Popup showPopup={showConfirmModal} onClose={handleClosePopup}>
        <ModalConfirm setShowConfirmModal={setShowConfirmModal} />
      </Popup>
    </>
  );
};

export default ReviewResult;
