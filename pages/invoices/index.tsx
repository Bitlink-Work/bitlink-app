import InvoiceInfo from "@/components/invoices/InvoiceInfo";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Reminder from "@/components/modal/Reminder";
import Popup from "@/components/popup/Popup";
import { Status } from "@/constants";
import { invoiceServices } from "@/public/api/invoiceServices";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import MainButton from "@/components/button/MainButton";
import ConfirmPopup from "@/components/invoices/components/ConfirmPopup";
import ConfirmInvoice from "@/components/modal/ConfirmInvoice";
import WarningConfirm from "@/components/modal/WarningConfirm";
import ic_back from "@/images/invoices/back.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Bounce, toast } from "react-toastify";

type Props = {};

const Invoice = (props: Props) => {
  const [showReminder, setShowReminder] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const invoice_id = useSearchParams().get("invoice_id");
  const type = useSearchParams().get("type");
  const [tx, setTx] = useState("");
  const [showCheckInvoice, setShowCheckInvoice] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState<any>(null);
  const fetchInvoiceInfo = useCallback(
    async (invoice_id: any) => {
      if (invoice_id) {
        const res = await invoiceServices.getInvoiceDetail(invoice_id);
        if (res) {
          setInvoiceInfo(res);
        } else {
          toast.error("Error fetching invoice info");
        }
      }
    },
    [invoice_id],
  );

  useEffect(() => {
    if (invoice_id) {
      fetchInvoiceInfo(invoice_id);
    }
  }, [fetchInvoiceInfo, invoice_id]);

  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (invoiceInfo) setStatus(Status[invoiceInfo?.status] || Status["DRAFT"]);
  }, [invoiceInfo]);

  const router = useRouter();

  const handleDeleteInvoice = async (invoice_id: any) => {
    setIsLoading(true);
    try {
      if (invoiceInfo?.status === "COMPLETED") return;
      else {
        const res = await invoiceServices.deleteInvoice({ invoice_id });
        if (res) {
          toast.success("Delete invoice successfully!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            transition: Bounce,
          });
          router.push("/sent-invoices");
        }
      }
    } catch (error) {
      toast.error("Delete invoice failed!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showConfirmDelete) setMessage("");
  }, [showConfirmDelete]);
  useEffect(() => {
    if ((!showCheckInvoice && !showWarning) || !showWarning) setTx("");
  }, [showCheckInvoice, showWarning]);

  const contentRef = useRef(null);
  const downloadPDF = () => {
    const input = contentRef.current;
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight(),
      );
      pdf.save("download.pdf");
    });
  };
  const deteleRef = useRef(null);
  const reminderRef = useRef(null);
  const confirmRef = useRef(null);
  const warningRef = useRef(null);
  return (
    <DefaultLayout>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-8 px-10 py-6 font-poppins">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-start gap-[6px]">
            <p className="flex items-center space-x-3">
              <button onClick={() => router.back()}>
                <Image
                  src={ic_back}
                  alt="back icon"
                  className="min-w-6 h-6 w-6"
                />
              </button>
              <span className="text-sm font-semibold">Back</span>
            </p>
            <div className="flex flex-row items-center gap-3">
              <h3 className="text-sm font-semibold leading-[21px] text-[#1A1C21]">
                Invoice
              </h3>
              <p className="text-sm font-semibold leading-[21px] text-[#444445]">
                #{invoice_id}
              </p>
              <div
                className={`flex h-fit w-fit flex-row items-center justify-start gap-1 rounded border-l-[1.5px] px-3 py-2`}
                style={{
                  background: status?.background,
                  borderLeft: `1.5px solid ${status?.border}`,
                }}
              >
                <Image src={status?.icon} alt="" width={14} height={14} />
                <p className="whitespace-nowrap text-sm font-medium leading-[150%] text-text-secondary">
                  {status?.text}
                </p>
              </div>
            </div>
            <p className="text-sm font-normal leading-[150%] text-text-secondary">
              ⭐️ Overview
            </p>
          </div>
          <div className=" flex flex-row items-center justify-center gap-6">
            <button
              onClick={() =>
                toast.info("Coming soon!", {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  transition: Bounce,
                })
              }
              className="flex w-fit items-center justify-center gap-[10px] rounded-lg border border-[rgba(189,198,222,1)] bg-white px-6 py-3 text-sm font-semibold leading-[150%] text-[#444445] transition-all"
            >
              <span>Share</span>
              <Image
                src="/images/invoices/copy.svg"
                width={24}
                height={24}
                alt=""
              />
            </button>
            {invoiceInfo?.status === "WAITING" && type === "sent" && (
              <MainButton
                title="Payment Confirmation"
                bold
                onClick={() => setShowCheckInvoice(true)}
              />
            )}
            <div className="group relative h-10 w-10 cursor-pointer">
              <button className="h-full w-full">
                <Image
                  src="/images/invoices/menu.svg"
                  width={40}
                  height={40}
                  alt=""
                />
              </button>

              <div
                className={`absolute right-[0] top-[100%] z-10 hidden h-fit w-fit flex-col items-start overflow-hidden whitespace-nowrap rounded-lg border border-[#DEDEDE] bg-[#fff] text-sm font-medium leading-[150%] text-text-primary shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)] group-hover:flex`}
              >
                <button
                  onClick={() => {
                    downloadPDF();
                    // toast.info("Coming soon!", {
                    //   position: "bottom-right",
                    //   autoClose: 3000,
                    //   hideProgressBar: false,
                    //   closeOnClick: true,
                    //   transition: Bounce,
                    // });
                  }}
                  className="flex w-[208px] justify-between gap-[10px] border-b border-[#DEDEDE] px-6 py-4"
                >
                  <span>Download invoice</span>
                  <Image
                    src="/images/invoices/download.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                </button>
                {invoiceInfo?.status === "DRAFT" && type === "sent" && (
                  <button
                    onClick={() => {
                      router.push(`/invoices/edit?invoice_id=${invoice_id}`);
                    }}
                    className="flex w-[208px] justify-between gap-[10px] border-b border-[#DEDEDE] px-6 py-4"
                  >
                    <span>Edit invoice</span>
                    <Image
                      src="/images/invoices/pen.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  </button>
                )}
                {invoiceInfo?.status === "WAITING" && type === "sent" && (
                  <button
                    onClick={() => {
                      setShowReminder(true);
                    }}
                    className="flex w-full items-center justify-between border-b border-[#DEDEDE] px-6 py-4"
                  >
                    <span>Send a reminder</span>
                    <Image
                      src="/images/invoices/mail.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  </button>
                )}
                {invoiceInfo?.status === "DRAFT" && type === "sent" && (
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex w-full items-center justify-between px-6 py-4"
                  >
                    <span>Void invoice</span>
                    <Image
                      src="/images/invoices/void.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div ref={contentRef} className="mx-auto max-w-[]">
          <InvoiceInfo
            invoiceInfo={invoiceInfo}
            fetchInvoiceInfo={fetchInvoiceInfo}
          />
        </div>
      </div>
      <Popup showPopup={showReminder}>
        <Reminder
          popupRef={reminderRef}
          invoiceInfo={invoiceInfo}
          setShowPopup={setShowReminder}
        />
      </Popup>
      <Popup showPopup={showConfirmDelete}>
        <ConfirmPopup
          popupRef={deteleRef}
          setShowPopup={setShowConfirmDelete}
          handleDeleteInvoice={handleDeleteInvoice}
          isLoading={isLoading}
          invoiceId={invoice_id}
          message={message}
          setMessage={setMessage}
        />
      </Popup>
      <Popup showPopup={showCheckInvoice}>
        <ConfirmInvoice
          popupRef={confirmRef}
          invoiceInfo={invoiceInfo}
          tx={tx}
          setTx={setTx}
          setShowWarning={setShowWarning}
          setShowPopup={setShowCheckInvoice}
        />
      </Popup>
      <Popup showPopup={showWarning}>
        <WarningConfirm
          popupRef={warningRef}
          tx={tx}
          setTx={setTx}
          invoiceInfo={invoiceInfo}
          setShowPopup={setShowWarning}
        />
      </Popup>
    </DefaultLayout>
  );
};

export default Invoice;
