import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { invoiceServices } from "@/public/api/invoiceServices";
import { CircularProgress } from "@mui/material";
import { createQR, encodeURL } from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import MainButton from "../button/MainButton";
import ReviewCurrency from "../invoices/components/ReviewCurrency";
import ReviewFooter from "../invoices/components/ReviewFooter";
import ReviewHeading from "../invoices/components/ReviewHeading";
import ReviewPaymentNetwork from "../invoices/components/ReviewPaymentNetwork";
import ReviewProcess from "../invoices/components/ReviewProcess";
import ReviewSender from "../invoices/components/ReviewSender";
import ReviewBill from "../invoices/components/Reviewbill";
import ReviewReceiver from "./ReviewReceiver";
import ReviewStandard from "./ReviewStandard";

type Props = {
  setShowAddClient: (show: boolean) => void;
  setShowEditInfo: (show: boolean) => void;
  setShowEditExpired: (show: boolean) => void;
  expiredDate: Date;
  profile?: any;
  setIdInvoice: (id: string) => void;
  step9Data: any;
  setStep9Data: (data: any) => void;
  profileOwner?: any;
};
const currentDate = new Date();

const sender = {
  fistName: "Phxxxuc",
  lastName: "Ha",
  company: "draft",
  address: "90M HQV",
  city: "Ho Chi Minh City",
  postal_code: "07000 Phu Thuan",
  country: "Vietnam",
  email: "",
};

const ReviewDetail = ({
  setShowAddClient,
  setStep9Data,
  setShowEditInfo,
  setShowEditExpired,
  expiredDate,
  step9Data,
  setIdInvoice,
  profile,
  profileOwner,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  var logoData = localStorage.getItem("dataInvoice");
  const { dataInvoice } = useInvoiceContext();
  var fromLogoData = JSON.parse(logoData as any);
  const [createData, setCreateData] = useState<any>(null);
  const [fromLogo, setFromLogo] = useState<any>(
    fromLogoData?.from_company_logo,
  );
  const createInvoiceData = useMemo(
    () => ({
      from_company: profile?.company_name,
      from_first_name: profile?.first_name,
      from_last_name: profile?.last_name,
      from_country: profile?.country,
      from_region: profile?.region,
      from_city: profile?.city,
      from_postal_code: profile?.postal_code,
      from_address_line_1: profile?.address_line_1,
      from_address_line_2: profile?.address_line_2,
      from_tax_number: profile?.tax_number,
      from_company_logo: fromLogo,
      from_wallet: profile?.public_address,
      to_email: profileOwner?.partner_email,
      to_company: profileOwner?.partner_company,
      to_first_name: profileOwner?.partner_first_name,
      to_last_name: profileOwner?.partner_last_name,
      to_region: profileOwner?.partner_region,
      to_country: profileOwner?.partner_country,
      to_city: profileOwner?.partner_city,
      to_postal_code: profileOwner?.partner_postal_code,
      to_address_line_1: profileOwner?.partner_address_line1,
      to_address_line_2: profileOwner?.partner_address_line2,
      to_tax_number: profileOwner?.partner_tax_number,
      to_wallet: dataInvoice?.to_wallet,
      // currency: step9Data?.invoiceCurrency?.currency_name,
      // chain: step9Data?.dataPayment?.title,
      currency: dataInvoice?.dataChain?.currencies[0]?.currency_symbol || "",
      chain: dataInvoice?.dataChain?.chain_name || "",
      items: createData?.items,
      partner_id: profileOwner?.partner_id,
      partner_type: profileOwner?.type,
    }),
    [profile, fromLogo, profileOwner, dataInvoice, createData],
  );
  const [isValidWallet, setIsValidWallet] = useState(true);
  const [validBill, setIsValidBill] = useState(true);
  const [validLogo, setValidLogo] = useState(true);
  const [disabled, setDisable] = useState(false);
  const [totalBill, setTotalBill] = useState(0);

  useEffect(() => {
    if (createInvoiceData?.items?.length > 0) {
      let total = 0;
      createInvoiceData?.items?.reduce((acc: any, item: any) => {
        total += item?.price * item?.quantity;
        return total;
      });
      setTotalBill(total);
    } else {
      setTotalBill(0);
    }
  }, [createInvoiceData]);

  const [standard, setStandard] = useState("");
  const router = useRouter();
  const handleCreate = async () => {
    if (String(dataInvoice?.dataChain?.chain_name).toLowerCase() === "solana") {
      let ref = new Keypair();
      let reference = ref.publicKey;
      let created_time = new Date();
      let memo = `${reference}`;
      let message = "Thanks for the business!";
      let wallet = bs58.decode(
        createInvoiceData?.to_wallet ||
          "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
      );
      let recipient = new PublicKey(wallet || "");
      // let reference = new PublicKey(formValues?.reference);
      let amount = new BigNumber(
        Math.round(Number(totalBill) * 1000000) / 1000000,
      );
      let label =
        createInvoiceData?.to_company ||
        `${createInvoiceData?.from_first_name} ${createInvoiceData?.from_last_name}` ||
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
        ...createInvoiceData,
        reference: reference || "",
        created_time: created_time || "0",
        day_expired: new Date(expiredDate).valueOf() / 1000,
        qr: qr?._options?.data || "",
      });

      if (res) {
        router.push("/home?step=12", {
          query: {
            step: 12,
            invoice_id: res?.data?.invoice_id,
          },
        });
      }
    } else {
      let created_time = new Date();
      const res = await invoiceServices.createInvoice({
        ...createInvoiceData,
        reference: "",
        created_time: created_time || "0",
        day_expired: new Date(expiredDate).valueOf() / 1000,
        qr: "",
      });

      if (res) {
        router.push("/home?step=12", {
          query: {
            step: 12,
            invoice_id: res?.data?.invoice_id,
          },
        });
      }
    }
  };
  useEffect(() => {
    if (profileOwner?.type === "FREELANCER") {
      if (
        isValidWallet === false ||
        validBill === false ||
        profileOwner?.partner_first_name === "" ||
        profileOwner?.partner_last_name === "" ||
        validLogo === false
      ) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    } else {
      if (
        isValidWallet === false ||
        validBill === false ||
        profileOwner?.partner_company === "" ||
        validLogo === false
      ) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [isValidWallet, validBill, validLogo]);

  return (
    <div className="flex w-full flex-col  ">
      <div className="my-[48px] px-[60px] text-[36px] font-semibold leading-[54px] text-text-primary">
        Review
      </div>
      <div className="flex w-full flex-row items-start justify-between gap-[95.5px]  px-[60px] pb-8">
        <div className="flex flex-1 flex-col gap-6 border-[1.5px] border-[#DEDEDE] bg-[#fff] p-8">
          <ReviewHeading
            setValidLogo={setValidLogo}
            setStep9Data={setStep9Data}
            step9Data={step9Data}
            expiredDate={expiredDate}
            setFromLogo={setFromLogo}
            setShowEditExpired={setShowEditExpired}
          />
          <div className=" w-full">
            <div className="flex flex-col items-start">
              <div className="flex w-full justify-between">
                <ReviewSender
                  step9Data={step9Data}
                  setShowEditInfo={setShowEditInfo}
                />

                <ReviewReceiver
                  step9Data={step9Data}
                  setShowAddClient={setShowAddClient}
                />
              </div>
              <ReviewPaymentNetwork
                step9Data={step9Data}
                invoiceInfo={dataInvoice}
                setIsValidWallet={setIsValidWallet}
              />
              <ReviewCurrency step9Data={step9Data} />

              <ReviewStandard
                standard={standard}
                setStandard={setStandard}
                setFormValues={step9Data}
                receiver={step9Data}
              />
              <ReviewBill
                setCreateData={setCreateData}
                setStep9Data={setStep9Data}
                step9Data={step9Data}
                setIsValidBill={setIsValidBill}
              />
              <ReviewFooter step9Data={step9Data} />
            </div>
          </div>
        </div>
        <div className="flex h-fit w-fit flex-col gap-6 bg-transparent">
          <div className="flex flex-col items-start justify-start gap-3">
            <div className="flex flex-row items-center justify-start gap-3 text-2xl font-semibold leading-[150%]">
              <h3 className="text-text-primary">Invoice</h3>
            </div>
          </div>
          <ReviewProcess
            isValidWallet={isValidWallet}
            validBill={validBill}
            validLogo={validLogo}
            step9Data={step9Data}
          />
          <div className="flex flex-row items-center justify-end gap-6">
            {/* <button
              onClick={handleCreate}
              className="h-fit w-fit cursor-pointer rounded-lg px-6 py-3 text-sm font-semibold leading-[150%] text-[#98999A]"
            >
              <p>Save draft</p>
            </button> */}
            {isLoading ? (
              <button>
                <CircularProgress color="inherit" size={16} />
                <p>Sending...</p>
              </button>
            ) : (
              <MainButton
                disabled={disabled}
                onClick={handleCreate}
                title="Create invoice"
                bold
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
