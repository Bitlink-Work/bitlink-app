import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import { selectProfile } from "@/public/reducers/profileSlice";
import { Keypair, PublicKey } from "@solana/web3.js";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../header/Header";
import Popup from "../popup/Popup";
import AddClient from "./components/AddClient";
import EditExpired from "./components/EditExpired";
import EditInfo from "./components/EditInfo";
import InvoiceDetail from "./components/InvoiceDetail";

type Props = {};

const InvoiceComponent = (props: Props) => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const [reference, setReference] = useState<PublicKey>();
  const { dataInvoice } = useInvoiceContext();
  const [formValues, setFormValues] = useState<any>({
    from_wallet: "",
    from_company: "",
    from_first_name: "",
    from_last_name: "",
    from_country: "",
    from_region: "",
    from_city: "",
    from_postal_code: "",
    from_address_line_1: "",
    from_address_line_2: "",
    from_tax_number: "",
    from_company_logo: "",
    to_email: "",
    to_company: "",
    to_first_name: "",
    to_last_name: "",
    to_region: "",
    to_country: "",
    to_city: "",
    to_postal_code: "",
    to_address_line_1: "",
    to_address_line_2: "",
    to_tax_number: "",
    to_wallet: "",
    created_time: "",
    day_expired: 0,
    currency: "",
    chain: "",
    items: [],
    reference: "",
    partner_id: "",
    partner_type: "",
    qr: "",
    standard: "",
  });
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [expiredDate, setExpiredDate] = useState<Date>(new Date());
  const [deadline, setDeadline] = useState(30);
  const [showEditExpired, setShowEditExpired] = useState(false);
  const [type, setType] = useState("add");
  const [receiver, setReceiver] = useState<any>(null);
  const listPartners = useAppSelector(selectListPartners);
  const [totalBill, setTotalBill] = useState<any>(null);
  const [items, setItems] = useState<any>([]);
  const [step, setStep] = useState(1);
  const currencies = useAppSelector(selectCurrency);
  const [currency, setCurrency] = useState<any>("");
  const [currentNetwork, setCurrentNetwork] = useState<any>({});
  const [standard, setStandard] = useState("");
  const [wallet, setWallet] = useState("");
  const [edit, setEdit] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const pathName = usePathname();
  const partnerId = useSearchParams().get("partner_id");
  useEffect(() => {
    if (pathName === "/invoices/edit") {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [pathName]);

  const invoice_id = useSearchParams().get("invoice_id");
  const [invoiceInfo, setInvoiceInfo] = useState<any>(null);
  const fetchInvoiceInfo = useCallback(async () => {
    if (invoice_id) {
      const res = await invoiceServices.getInvoiceDetail(invoice_id);
      if (res) {
        setInvoiceInfo(res);
      } else {
        toast.error("Error fetching invoice info");
      }
    }
  }, [invoice_id]);

  useEffect(() => {
    if (invoice_id) {
      fetchInvoiceInfo();
    }
  }, [fetchInvoiceInfo, invoice_id]);

  useEffect(() => {
    if (edit) {
      if (invoiceInfo) {
        setFormValues((prev: any) => ({
          ...prev,
          ...invoiceInfo,
        }));
        setExpiredDate(new Date(invoiceInfo?.expired_time * 1000));
        const res = Math.ceil(
          (new Date(invoiceInfo?.expired_time * 1000).getTime() -
            new Date(invoiceInfo?.created_time * 1000).getTime()) /
            (24 * 60 * 60 * 1000),
        );
        setDeadline(res);
        const newReceiver = listPartners?.find((partner: any) => {
          return partner.partner_id === invoiceInfo?.partner_id;
        });
        if (newReceiver !== undefined) {
          setReceiver({ ...newReceiver });
        } else {
          setReceiver(null);
        }
        setCurrency(invoiceInfo?.currency);
        const network = currencies.find(
          (network: any) =>
            String(network.chain_name).toLowerCase() ===
            String(invoiceInfo?.chain).toLowerCase(),
        );
        setCurrentNetwork(network);
        setStandard(invoiceInfo?.standard);
        setWallet(invoiceInfo?.to_wallet);
        setItems(invoiceInfo?.items);
        if (invoiceInfo?.reference) {
          setReference(new PublicKey(invoiceInfo?.reference));
        } else {
          const reference = new Keypair();
          setReference(reference.publicKey);
        }
      }
    } else {
      const reference = new Keypair();
      setReference(reference.publicKey);
      setExpiredDate(new Date(new Date().setDate(new Date().getDate() + 30)));
    }
  }, [invoiceInfo]);

  useEffect(() => {
    if (partnerId) {
      const newReceiver = listPartners?.find((partner: any) => {
        return partner.partner_id === partnerId;
      });
      if (newReceiver !== undefined) {
        setReceiver({ ...newReceiver });
      } else {
        setReceiver(null);
      }
    } else {
      setReceiver(null);
    }
  }, [partnerId]);

  useEffect(() => {
    if (!edit) {
      if (profile) {
        setFormValues((prev: any) => ({
          ...prev,
          from_wallet: profile?.public_address || "",
          from_company: profile?.company_name || "",
          from_first_name: profile?.first_name || "",
          from_last_name: profile?.last_name || "",
          from_country: profile?.country || "",
          from_region: profile?.region || "",
          from_city: profile?.city || "",
          from_postal_code: profile?.postal_code || "",
          from_address_line_1: profile?.address_line_1 || "",
          from_address_line_2: profile?.address_line_2 || "",
          from_tax_number: profile?.tax_number || "",
        }));
      }
      if (receiver) {
        setFormValues((prev: any) => ({
          ...prev,
          to_email: receiver?.partner_email || "",
          to_company: receiver?.partner_company || "",
          to_first_name: receiver?.partner_first_name || "",
          to_last_name: receiver?.partner_last_name || "",
          to_country: receiver?.partner_country || "",
          to_region: receiver?.partner_region || "",
          to_city: receiver?.partner_city || "",
          to_postal_code: receiver?.partner_postal_code || "",
          to_address_line_1: receiver?.partner_address_line1 || "",
          to_address_line_2: receiver?.partner_address_line2 || "",
          to_tax_number: receiver?.partner_tax_number || "",
          to_company_logo:
            receiver?.partner_company_logo || receiver?.avatar || "",
          partner_id: receiver?.partner_id || "",
          partner_type: receiver?.type || "",
        }));
      }
      if (reference) {
        setFormValues((prev: any) => ({
          ...prev,
          reference: reference || "",
        }));
      }
      if (currency) {
        setFormValues((prev: any) => ({
          ...prev,
          currency: currency,
        }));
      }
      if (currentNetwork) {
        setFormValues((prev: any) => ({
          ...prev,
          chain: currentNetwork?.chain_name,
        }));
      }
      if (wallet) {
        setFormValues((prev: any) => ({
          ...prev,
          to_wallet: wallet,
        }));
      }
      if (standard) {
        setFormValues((prev: any) => ({
          ...prev,
          standard: standard,
        }));
      }
      if (expiredDate) {
        setFormValues((prev: any) => ({
          ...prev,
          day_expired: expiredDate,
        }));
      }
      if (items) {
        setFormValues((prev: any) => ({
          ...prev,
          items: items,
        }));
      }
    }
  }, [
    edit,
    currentNetwork,
    profile,
    receiver,
    reference,
    expiredDate,
    standard,
    wallet,
    items,
    currency,
  ]);

  useEffect(() => {
    if (!edit) {
      if (profile) {
        setFormValues((prev: any) => ({
          ...prev,
          from_company_logo: profile?.logo || "",
        }));

        setWallet(profile?.public_address || "");
      }
      if (currencies) {
        setCurrency(currencies[0]?.currencies[0]?.currency_symbol);
        setCurrentNetwork(currencies[0]);
      }
    }
  }, [profile, isReset]);

  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      setIsReset(false);
    } else {
      setIsReset(true);
    }
  }, [formValues]);

  const handleReset = () => {
    setFormValues({});
    setExpiredDate(new Date(new Date().setDate(new Date().getDate() + 30)));
    setReceiver(null);
    setCurrency(currencies[0].currencies[0].currency_symbol);
    setCurrentNetwork(currencies[0]);
    setStandard("");
    setWallet("");
    setDeadline(30);
    setType("add");
    setTotalBill(null);
    setItems([]);
    setStep(1);
  };

  useEffect(() => {
    if (receiver) {
      if (currency) {
        if (currentNetwork && wallet !== "") {
          if (standard && items.length > 0) {
            setStep(5);
          } else {
            setStep(4);
          }
        } else {
          setStep(3);
        }
      } else {
        setStep(2);
      }
    } else {
      setStep(1);
    }
  }, [receiver, currency, currentNetwork, wallet, standard, items]);

  useEffect(() => {
    setItems(dataInvoice?.items);
  }, [dataInvoice]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let dataInvoice = JSON.parse(localStorage.getItem("dataInvoice") as any);
      if (dataInvoice) {
        if (dataInvoice?.to_id != "") {
          setReceiver({
            partner_email: dataInvoice?.to_email,
            partner_company: dataInvoice?.to_company,
            partner_first_name: dataInvoice?.to_first_name,
            partner_last_name: dataInvoice?.to_last_name,
            partner_country: dataInvoice?.to_country,
            partner_region: dataInvoice?.to_region,
            partner_city: dataInvoice?.to_city,
            partner_postal_code: dataInvoice?.to_postal_code,
            partner_address_line1: dataInvoice?.to_address_line_1,
            partner_address_line2: dataInvoice?.to_address_line_2,
            partner_tax_number: dataInvoice?.to_tax_number,
            partner_id: dataInvoice?.to_id,
          });
        }

        setFormValues({
          ...formValues,
          from_company_logo: dataInvoice?.from_company_logo,
        });

        setWallet(dataInvoice?.to_wallet);
        setStandard(dataInvoice?.standard);
      }
    }
  }, []);

  return (
    <div className="relative flex flex-col items-start gap-8 bg-[#fdfcfb]">
      <Header handleReset={handleReset} />
      <InvoiceDetail
        edit={edit}
        invoiceInfo={invoiceInfo}
        setInvoiceInfo={setInvoiceInfo}
        formValues={formValues}
        setFormValues={setFormValues}
        setShowAddClient={setShowAddClient}
        setShowEditInfo={setShowEditInfo}
        setShowEditExpired={setShowEditExpired}
        expiredDate={expiredDate}
        profile={profile}
        setType={setType}
        receiver={receiver}
        setReceiver={setReceiver}
        deadline={deadline}
        reference={reference}
        items={items}
        setItems={setItems}
        totalBill={totalBill}
        setTotalBill={setTotalBill}
        step={step}
        setStep={setStep}
        currencies={currencies}
        currency={currency}
        setCurrency={setCurrency}
        currentNetwork={currentNetwork}
        setCurrentNetwork={setCurrentNetwork}
        standard={standard}
        setStandard={setStandard}
        wallet={wallet}
        setWallet={setWallet}
        isReset={isReset}
      />
      <Popup showPopup={showAddClient}>
        <AddClient
          edit={edit}
          invoiceInfo={invoiceInfo}
          receiver={receiver}
          setReceiver={setReceiver}
          setShowAddClient={setShowAddClient}
          type={type}
          profile={profile}
        />
      </Popup>
      <Popup showPopup={showEditInfo}>
        <EditInfo
          edit={edit}
          invoiceInfo={invoiceInfo}
          setInvoiceInfo={setInvoiceInfo}
          setShowEditInfo={setShowEditInfo}
          profile={profile}
        />
      </Popup>
      <Popup showPopup={showEditExpired}>
        <EditExpired
          edit={edit}
          invoiceInfo={invoiceInfo}
          setShowEditExpired={setShowEditExpired}
          setExpiredDate={setExpiredDate}
          setDeadline={setDeadline}
          deadline={deadline}
        />
      </Popup>
    </div>
  );
};

export default InvoiceComponent;
