import Popup from "@/components/popup/Popup";
import { Status } from "@/constants";
import { getChainCurrency, sendMail } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch } from "@/public/hook/hooks";
import { CircularProgress } from "@mui/material";
import { createQR, encodeURL } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Bill from "./Bill";
import ConfirmCreate from "./ConfirmCreate";
import Currency from "./Currency";
import Footer from "./Footer";
import Heading from "./Heading";
import PaymentNetwork from "./PaymentNetwork";
import Process from "./Process";
import Receiver from "./Receiver";
import Sender from "./Sender";
import Standard from "./Standard";

type Props = {
  setShowAddClient: (show: boolean) => void;
  setShowEditInfo: (show: boolean) => void;
  setShowEditExpired: (show: boolean) => void;
  expiredDate: Date;
  formValues: any;
  setFormValues: (value: any) => void;
  profile: any;
  setType: (value: string) => void;
  receiver: any;
  setReceiver: (value: any) => void;
  deadline: number;
  edit?: boolean;
  invoiceInfo?: any;
  setInvoiceInfo?: (value: any) => void;
  reference?: any;
  items: any;
  setItems: (value: any) => void;
  totalBill: number;
  setTotalBill: (value: number) => void;
  step: number;
  setStep: (value: number) => void;
  currency: any;
  setCurrency: (value: any) => void;
  currencies: any;
  currentNetwork: any;
  setCurrentNetwork: (value: any) => void;
  standard: any;
  setStandard: (value: any) => void;
  wallet: any;
  setWallet: (value: any) => void;
  isReset?: boolean;
};

export const NETWORK: Record<string, any> = {
  Ethereum: {
    id: 0,
    title: "Ethereum",
    symbol: "ETH",
    icon: "/images/invoices/eth.svg",
  },
  "BNB Chain": {
    id: 1,
    title: "BNB Chain",
    symbol: "BNB",
    icon: "/images/invoices/bnb.svg",
  },
  Polygon: {
    id: 2,
    title: "Polygon",
    symbol: "MATIC",
    icon: "/images/invoices/polygon.svg",
  },
};

const InvoiceDetail = ({
  setShowAddClient,
  setShowEditInfo,
  setShowEditExpired,
  expiredDate,
  formValues,
  setFormValues,
  profile,
  setType,
  receiver,
  setReceiver,
  deadline,
  edit,
  invoiceInfo,
  setInvoiceInfo,
  reference,
  items,
  setItems,
  totalBill,
  setTotalBill,
  step,
  setStep,
  currency,
  setCurrency,
  currencies,
  currentNetwork,
  setCurrentNetwork,
  standard,
  setStandard,
  wallet,
  setWallet,
  isReset,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fetchCurrency = useCallback(async () => {
    try {
      await dispatch(getChainCurrency({}));
    } catch (error) {
      console.error("Error fetching currency:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSendding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCreateInvoice = async () => {
    try {
      setIsLoading(true);
      if (edit) {
        let created_time = invoiceInfo?.created_time;
        if (String(formValues?.chain).toLowerCase() === "solana") {
          let memo = `${formValues?.reference}`;
          let message = "Thanks for the business!";
          let wallet = bs58.decode(
            formValues?.to_wallet ||
              "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
          );
          let recipient = new PublicKey(wallet || "");
          let reference = new PublicKey(formValues?.reference);
          let amount = new BigNumber(totalBill);
          let label =
            formValues?.to_company ||
            `${formValues?.from_first_name} ${formValues?.from_last_name}` ||
            "";
          let url = encodeURL({
            recipient,
            amount,
            reference,
            label,
            message,
            memo,
          });
          const qr = createQR(url, 120);
          const res = await invoiceServices.updateInvoice({
            ...formValues,
            invoice_id: invoiceInfo?.invoice_id,
            currency: currency,
            chain: currentNetwork?.chain_name,
            created_time: created_time || "0",
            expired_time:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: qr?._options?.data || "",
          });
          if (res) {
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: invoiceInfo?.invoice_id, type: "sent" },
            });
          }
        } else {
          const res = await invoiceServices.updateInvoice({
            ...formValues,
            invoice_id: invoiceInfo?.invoice_id,
            currency: currency,
            chain: currentNetwork?.chain_name,
            created_time: created_time || "0",
            expired_time:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
          });
          if (res) {
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: invoiceInfo?.invoice_id, type: "sent" },
            });
          }
        }
      } else {
        let created_time = new Date();
        if (String(formValues?.chain).toLowerCase() === "solana") {
          let memo = `${formValues?.reference}`;
          let message = "Thanks for the business!";
          let wallet = bs58.decode(
            formValues?.to_wallet ||
              "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
          );
          let recipient = new PublicKey(wallet || "");
          let reference = new PublicKey(formValues?.reference);
          let amount = new BigNumber(totalBill);
          let label =
            formValues?.from_company ||
            `${formValues?.from_first_name} ${formValues?.from_last_name}` ||
            "";
          let url = encodeURL({
            recipient,
            amount,
            reference,
            label,
            message,
            memo,
          });
          const qr = createQR(url, 120);
          const res = await invoiceServices.createInvoice({
            ...formValues,
            created_time: created_time || "0",
            day_expired:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: qr?._options?.data || "",
          });

          if (res) {
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: res?.data?.invoice_id, type: "sent" },
            });
          }
        } else {
          const res = await invoiceServices.createInvoice({
            ...formValues,
            created_time: created_time || "0",
            day_expired:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: "",
          });

          if (res) {
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: res?.data?.invoice_id, type: "sent" },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateInvoiceAndSend = async () => {
    try {
      setIsSendding(true);
      if (edit) {
        let created_time = invoiceInfo?.created_time;
        if (String(formValues?.chain).toLowerCase() === "solana") {
          let memo = `${formValues?.reference}`;
          let message = "Thanks for the business!";
          let wallet = bs58.decode(
            formValues?.to_wallet ||
              "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
          );
          let recipient = new PublicKey(wallet || "");
          let reference = new PublicKey(formValues?.reference);
          let amount = new BigNumber(totalBill);
          let label =
            formValues?.from_company ||
            `${formValues?.from_first_name} ${formValues?.from_last_name}` ||
            "";
          let url = encodeURL({
            recipient,
            amount,
            reference,
            label,
            message,
            memo,
          });
          const qr = createQR(url, 120);
          const res = await invoiceServices.updateInvoice({
            ...formValues,
            invoice_id: invoiceInfo?.invoice_id,
            currency: currency,
            chain: currentNetwork?.currency_name,
            created_time: created_time,
            expired_time:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: qr?._options?.data || "",
          });

          if (res) {
            await dispatch(
              sendMail({
                invoice_id: res?.data?.invoice_id,
              }),
            );
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: invoiceInfo?.invoice_id, type: "sent" },
            });
          }
        } else {
          const res = await invoiceServices.updateInvoice({
            ...formValues,
            invoice_id: invoiceInfo?.invoice_id,
            currency: currency,
            chain: currentNetwork?.currency_name,
            created_time: created_time,
            expired_time:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: "",
          });

          if (res) {
            await dispatch(
              sendMail({
                invoice_id: res?.data?.invoice_id,
              }),
            );
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: invoiceInfo?.invoice_id, type: "sent" },
            });
          }
        }
      } else {
        let currentTime = new Date();
        let created_time = new Date();
        if (String(formValues?.chain).toLowerCase() === "solana") {
          let memo = `${formValues?.reference}`;
          let message = "Thanks for the business!";
          let wallet = bs58.decode(
            formValues?.to_wallet ||
              "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
          );
          let recipient = new PublicKey(wallet || "");
          let reference = new PublicKey(formValues?.reference);
          let amount = new BigNumber(totalBill);
          let label =
            formValues?.from_company ||
            `${formValues?.from_first_name} ${formValues?.from_last_name}` ||
            "";
          let url = encodeURL({
            recipient,
            amount,
            reference,
            label,
            message,
            memo,
          });
          const qr = createQR(url, 120);
          const res = await invoiceServices.createInvoice({
            ...formValues,
            created_time: created_time || "0",
            day_expired:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: qr?._options?.data || "",
          });

          if (res) {
            await dispatch(
              sendMail({
                invoice_id: res?.data?.invoice_id,
              }),
            );
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: res?.data.invoice_id, type: "sent" },
            });
          }
        } else {
          const res = await invoiceServices.createInvoice({
            ...formValues,
            created_time: created_time || "0",
            day_expired:
              deadline !== null
                ? new Date(expiredDate).valueOf()
                : new Date().setDate(new Date().getDate() + 1000000),
            qr: "",
          });

          if (res) {
            await dispatch(
              sendMail({
                invoice_id: res?.data?.invoice_id,
              }),
            );
            router.push("/invoices", {
              pathname: "/invoices",
              query: { invoice_id: res?.data.invoice_id, type: "sent" },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      setIsSendding(false);
    } finally {
      setIsSendding(false);
    }
  };

  useEffect(() => {
    if (edit) {
      let chain = currencies?.find(
        (item: any) =>
          String(item?.chain_name).toLowerCase() ===
          String(invoiceInfo?.chain).toLowerCase(),
      );
      setCurrentNetwork(chain);
    } else {
      setCurrentNetwork(currencies[0]);
    }
  }, [invoiceInfo, edit, currencies, setStep, setCurrentNetwork]);

  return (
    <div className="flex w-full flex-row items-start justify-between gap-[95.5px] px-[60px] pb-8">
      <div className="flex flex-1 flex-col gap-6 border-[1.5px] border-[#DEDEDE] bg-[#fff] p-8">
        <Heading
          edit={edit}
          expiredDate={expiredDate}
          formValues={formValues}
          setFormValues={setFormValues}
          setShowEditExpired={setShowEditExpired}
          deadline={deadline}
        />
        <div className=" w-full">
          <div className="flex flex-col items-start">
            <Sender
              edit={edit}
              formValues={formValues}
              invoiceInfo={invoiceInfo}
              setInvoiceInfo={setInvoiceInfo}
              profile={profile}
              receiver={receiver}
              setShowEditInfo={setShowEditInfo}
              setShowAddClient={setShowAddClient}
              setReceiver={setReceiver}
              setStep={setStep}
              setType={setType}
            />
            {(!receiver || Object.keys(receiver).length === 0) && (
              <Receiver
                setReceiver={setReceiver}
                setShowAddClient={setShowAddClient}
                setStep={setStep}
                setType={setType}
              />
            )}
            <PaymentNetwork
              edit={edit}
              currencies={currencies}
              invoiceInfo={invoiceInfo}
              currency={currency}
              setStep={setStep}
              receiver={receiver}
              currentNetwork={currentNetwork}
              setCurrency={setCurrency}
              setCurrentNetwork={setCurrentNetwork}
              items={items}
              setFormValues={setFormValues}
            />
            <Currency
              edit={edit}
              invoiceInfo={invoiceInfo}
              currency={currency}
              currencies={currencies}
              currentNetwork={currentNetwork}
              setCurrency={setCurrency}
              setCurrentNetwork={setCurrentNetwork}
              setStep={setStep}
              receiver={receiver}
              setFormValues={setFormValues}
              wallet={wallet}
              setWallet={setWallet}
              formValues={formValues}
            />

            <Standard
              standard={standard}
              setStandard={setStandard}
              receiver={receiver}
              setFormValues={setFormValues}
            />
            <Bill
              edit={edit}
              invoiceInfo={invoiceInfo}
              currency={currency}
              setStep={setStep}
              items={items}
              setItems={setItems}
              totalBill={totalBill}
              setTotalBill={setTotalBill}
              receiver={receiver}
              standard={standard}
              currencies={currencies}
              wallet={wallet}
              isReset={isReset}
              setFormValues={setFormValues}
            />
            <Footer invoiceInfo={invoiceInfo} reference={reference} />
          </div>
        </div>
      </div>
      <div className="flex h-fit w-fit flex-col gap-6 bg-transparent">
        <div className="flex flex-col items-start justify-start gap-3">
          <div className="flex flex-row items-center justify-start gap-3 text-2xl font-semibold leading-[150%]">
            <h3 className="text-text-primary">Invoice</h3>
            {/* <p className="text-[#5E6470]">#AB2324-01</p> */}
          </div>
          <div
            className={`flex h-fit w-fit flex-row items-center justify-start gap-1 rounded border-l-[1.5px] px-3 py-2`}
            style={{
              background:
                Status[invoiceInfo ? invoiceInfo?.status : "DRAFT"].background,
              borderLeft: `1.5px solid ${
                Status[invoiceInfo ? invoiceInfo?.status : "DRAFT"].border
              }`,
            }}
          >
            <Image src={Status["DRAFT"].icon} width={14} height={14} alt="" />
            {/* <p className="text-sm font-normal leading-[150%] text-[#19213D]">
              {Status[invoiceInfo ? invoiceInfo?.status : "DRAFT"].icon}
            </p> */}
            <p className="whitespace-nowrap text-sm font-medium leading-[150%] text-text-secondary">
              {Status[invoiceInfo ? invoiceInfo?.status : "DRAFT"].text}
            </p>
          </div>
        </div>
        <Process
          invoiceInfo={invoiceInfo}
          receiver={receiver}
          currency={currency}
          profile={profile}
          step={step}
          formValues={formValues}
          totalBill={totalBill}
        />
        <div className="flex flex-row items-center justify-start gap-6">
          <button
            disabled={
              isLoading ||
              step < 5 ||
              !formValues?.from_company_logo ||
              (invoiceInfo &&
                invoiceInfo?.status !== "DRAFT" &&
                invoiceInfo?.status !== "OVERDUE") ||
              isSending
            }
            onClick={() => {
              handleCreateInvoice();
              localStorage.removeItem("dataInvoice");
              localStorage.removeItem("logoUrl");
              localStorage.removeItem("dataChain");
              localStorage.removeItem("dataPaid");
            }}
            className="flex h-fit w-fit cursor-pointer flex-row items-center justify-center gap-1 rounded-lg border border-[#BDC6DE] px-6 py-3 text-sm font-semibold leading-[150%] text-[#98999A] disabled:cursor-not-allowed disabled:border-none"
          >
            {isLoading ? (
              <>
                <CircularProgress color="inherit" size={16} />
                <p>...Loading</p>
              </>
            ) : (
              <p>Save draft</p>
            )}
          </button>
          <button
            // onClick={handleCreateInvoiceAndSend}
            disabled={
              step < 5 ||
              !formValues?.from_company_logo ||
              isSending ||
              !receiver ||
              isLoading
            }
            onClick={step === 5 ? () => setShowConfirm(true) : () => null}
            className={`h-fit w-fit cursor-pointer rounded-lg ${
              step === 5 && formValues?.from_company_logo
                ? "bg-primary text-white hover:bg-btn-hover"
                : "bg-[#DEDEDE] text-[#98999A]"
            } flex flex-row items-center justify-center gap-1 px-6 py-3 text-sm font-semibold leading-[150%] disabled:cursor-not-allowed`}
          >
            {isSending ? (
              <>
                <CircularProgress color="inherit" size={16} />
                <p>Sending...</p>
              </>
            ) : (
              <p>Create & send</p>
            )}
          </button>

          <Popup showPopup={showConfirm}>
            <ConfirmCreate
              onOpen={setShowConfirm}
              onClick={handleCreateInvoiceAndSend}
              receiver={receiver}
              invoiceInfo={invoiceInfo}
              formValues={formValues}
              totalBill={totalBill}
            />
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
