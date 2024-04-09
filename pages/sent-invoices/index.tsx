import ConfirmPopup from "@/components/invoices/components/ConfirmPopup";
import DefaultLayout from "@/components/layout/DefaultLayout";
import ConfirmInvoice from "@/components/modal/ConfirmInvoice";
import Reminder from "@/components/modal/Reminder";
import WarningConfirm from "@/components/modal/WarningConfirm";
import Popup from "@/components/popup/Popup";
import SentInvoices from "@/components/sent-invoices/SentInvoices";
import { getCreatedData, getCreatedInvoice } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch } from "@/public/hook/hooks";
import { useEffect, useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";
type Props = {};

const SentInvoicesPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const [showReminder, setShowReminder] = useState(false);
  const [showCheckInvoice, setShowCheckInvoice] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [invoiceInfo, setInvoiceInfo] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [tx, setTx] = useState("");
  const handleDeleteInvoice = async (invoice_id: any) => {
    setIsLoading(true);
    try {
      const res = await invoiceServices.deleteInvoice({ invoice_id });
      if (res) {
        toast.success("Delete invoice successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
        await dispatch(
          getCreatedInvoice({
            page: 1,
            page_size: 10,
          }),
        );
        await dispatch(getCreatedData({}));
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
      setShowConfirmDelete(false);
    }
  };

  useEffect(() => {
    if (!showConfirmDelete) setMessage("");
  }, [showConfirmDelete]);

  const deleteRef = useRef(null);
  const reminderRef = useRef(null);
  const confirmRef = useRef(null);
  const warningRef = useRef(null);

  return (
    <DefaultLayout type="sent">
      <SentInvoices
        setSelectedId={setSelectedId}
        invoiceInfo={invoiceInfo}
        setInvoiceInfo={setInvoiceInfo}
        setShowReminder={setShowReminder}
        setShowCheckInvoice={setShowCheckInvoice}
        setShowConfirmDelete={setShowConfirmDelete}
      />
      <Popup showPopup={showConfirmDelete}>
        <ConfirmPopup
          popupRef={deleteRef}
          setShowPopup={setShowConfirmDelete}
          handleDeleteInvoice={handleDeleteInvoice}
          isLoading={isLoading}
          invoiceId={selectedId}
          message={message}
          setMessage={setMessage}
        />
      </Popup>
      <Popup showPopup={showReminder}>
        <Reminder
          popupRef={reminderRef}
          invoiceInfo={invoiceInfo}
          setShowPopup={setShowReminder}
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

export default SentInvoicesPage;
