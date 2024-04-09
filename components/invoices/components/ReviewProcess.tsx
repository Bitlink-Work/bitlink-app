"use client";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { getProfile } from "@/public/actions";

import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import { selectProfile } from "@/public/reducers/profileSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import { useCallback, useEffect, useState } from "react";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
type Props = {};

const formValue = {
  sender: {
    name: "Thanh Hong Phuc Ha",
    email: "etteam8@gmail.com",
  },
  receiver: {
    name: "ESOLLABS",
    email: "phuc.hth@esollabs.com",
  },
  currency: {
    symbol: "ETH",
    name: "Ethereum",
  },
  address: "0xC4e87dCA8C105F78B63AE57b0d8CB9a39B5CEB0e",
  amount: {
    quantity: 1,
    total: 6.0,
  },
};

const PROCESS = [
  {
    id: 0,
    step: 1,
    title: "Your credentials",
    isCompleted: true,
  },
  {
    id: 1,
    step: 2,
    title: "Billed to",
    isCompleted: true,
  },
  {
    id: 2,
    step: 3,
    title: "Invoice Currency",
    isCompleted: true,
  },
  {
    id: 3,
    step: 4,
    title: "Receive Payment",
    isCompleted: true,
  },
  {
    id: 4,
    step: 5,
    title: "Amount Details",
    isCompleted: true,
  },
];

const ReviewProcess = ({
  step9Data,
  isValidWallet,
  validBill,
  validLogo,
}: any) => {
  const profile: IProfile = useAppSelector(selectProfile);
  const listPartner: IProfileOwner[] = useAppSelector(selectListPartners);
  const { dataInvoice } = useInvoiceContext();
  const profileOwner = listPartner.find(
    (element) => element.partner_id === dataInvoice.to_id,
  );

  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  const data = localStorage?.getItem("dataChain");
  const dataChain = data && JSON.parse(data);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const [totalValue, setTotalValue] = useState<number>();

  const [step, setStep] = useState<any>();
  useEffect(() => {
    if (validBill === false) {
      setStep(4);
    } else if (isValidWallet === false) {
      setStep(3);
    } else if (validLogo === false) {
      setStep(5);
    } else {
      setStep(5);
    }
  }, [validBill, isValidWallet, validLogo]);

  useEffect(() => {
    if (dataInvoice?.items) {
      let result = dataInvoice?.items?.reduce(
        (total: any, item: any) => total + Number(item?.amount),
        0,
      );

      setTotalValue(Math.round(result * 1000000) / 1000000);
    }
  }, [dataInvoice?.items]);

  const currencies = useAppSelector(selectCurrency);

  const backNetwork = currencies.find(
    (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
  );
  const backCurrency = backNetwork?.currencies.find(
    (item: any) => item?.currency_symbol === dataInvoice?.currency,
  );
  // const [invoiceCurrency, setInvoiceCurrency] = useState<any>();
  // useEffect(() => {}, [dataInvoice]);

  return (
    <div className="flex flex-row items-start justify-start gap-[60px]">
      <div>
        {PROCESS.map((item) => (
          <div key={item.id} className="h-[103px] w-fit">
            <div
              className={`after:contents-[''] relative flex h-8 w-8 items-center justify-center rounded-full ${
                item.step <= step
                  ? "bg-[#43A048] text-[#fff] after:border-[#43A048]"
                  : "bg-[#E9E9E9] text-text-primary after:border-[#DEDEDE]"
              } after:absolute after:left-[50%] after:top-[100%] after:h-[71px] after:-translate-x-1/2 after:border-[2px] after:border-dashed ${
                item.step === 5 ? "after:hidden" : ""
              }`}
            >
              <p className="text-sm font-semibold leading-[150%] text-[#FFFFFF]">
                {item.step}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="h-[103px] w-fit ">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[0].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            {profile?.type === EnumTypeProfile.Freelancer ? (
              <>
                <p className="text-xs font-normal leading-[150%] text-text-secondary">
                  {profile?.first_name || dataInvoice?.from_first_name}{" "}
                  {profile?.last_name || dataInvoice?.from_last_name}
                </p>
                <p className="text-xs font-normal leading-[150%] text-text-secondary">
                  {profile?.email_google}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-normal leading-[150%] text-text-secondary">
                  {profile?.company_name}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[1].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {profileOwner?.type === EnumTypeProfile.Freelancer
                ? `${
                    profileOwner?.partner_first_name ||
                    dataInvoice?.to_first_name
                  } ${
                    profileOwner?.partner_last_name || dataInvoice?.to_last_name
                  }`
                : profileOwner?.partner_company || dataInvoice?.to_company}
            </p>
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {profileOwner?.partner_email || dataInvoice?.to_email}
            </p>
          </div>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[2].title}
          </p>
          <p className="text-xs font-normal leading-[150%] text-text-secondary">
            {backCurrency?.currency_symbol ||
              dataInvoice?.dataChain?.currencies[0]?.currency_symbol}
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[3].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              Wallet ({dataInvoice?.to_wallet?.slice(0, 6)}...{" "}
              {dataInvoice?.to_wallet?.slice(-4)}){/* {step9Data?.wallet} */}
            </p>
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              in {backCurrency?.currency_symbol} (on{" "}
              {dataInvoice?.dataNetwork?.currencies[0]?.currency_name})
            </p>
          </div>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[4].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {dataInvoice?.items?.length} items
            </p>
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              Total: {backCurrency?.currency_symbol} {totalValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProcess;
