"use client";
import { getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { QRCodeCanvas } from "qrcode.react";
type Props = {};

const ReviewInvoiceInfo = ({ invoiceInfo }: any) => {
  const { dataInvoice } = useInvoiceContext();
  const invoice_id = useSearchParams().get("invoice_id");
  const [reference, setReference] = useState<PublicKey>();
  const [recipient, setRecipient] = useState<PublicKey>();
  const res = new Date();
  res.setDate(res.getDate() + 30);
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const created_time = new Date(
    invoiceInfo?.created_time * 1000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expired_time = new Date(
    invoiceInfo?.expired_time * 1000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [subTotal, setSubTotal] = useState<any>();

  var totalAmount = 0;
  var sub = 0;
  var tax = 0;
  for (var i = 0; i < invoiceInfo?.items?.length; i++) {
    var amountStr = invoiceInfo?.items[i]["amount"];
    var amount = parseFloat(amountStr);

    sub +=
      invoiceInfo?.items[i]["quantity"] * invoiceInfo?.items[i]["unit_price"];

    tax +=
      (invoiceInfo?.items[i]["quantity"] *
        invoiceInfo?.items[i]["unit_price"] *
        invoiceInfo?.items[i]["tax"]) /
      100;
    var amount = parseFloat(amountStr);

    totalAmount += amount;
  }
  useEffect(() => {
    setSubTotal(totalAmount);
  }, [subTotal]);

  // useEffect(() => {
  //   if (recipient) {
  //     const amount = new BigNumber(totalAmount || 0);
  //     const label = dataInvoice?.from_company || "";
  //     const message = "Thanks for the business!";

  //     const url = encodeURL({
  //       recipient,
  //       amount,
  //       reference,
  //       label,
  //       message,
  //     });

  //     const isBrowser = typeof window !== "undefined";
  //     if (isBrowser) {
  //       const qrCode = createQR(url, 120);
  //       const element = document.getElementById("qr-code");
  //       qrCode.append(element as HTMLElement);
  //     }
  //   }

  //   if (invoiceInfo?.reference) {
  //     setReference(new PublicKey(invoiceInfo?.reference));
  //   } else {
  //     const reference = new Keypair();
  //     setReference(reference.publicKey);
  //   }
  // }, [recipient]);

  useEffect(() => {
    if (invoiceInfo) {
      const wallet = bs58.decode(
        invoiceInfo?.to_wallet ||
          "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
      );
      setRecipient(new PublicKey(wallet || ""));
    }
  }, [invoiceInfo]);

  return (
    <div className="invoice_info mx-auto flex w-fit flex-1 flex-col border-[1.5px] border-[#DEDEDE] bg-[#fff] px-6 py-[28.5px] ">
      <div className="mb-[27px] flex w-[844.5px] flex-row items-start justify-between">
        <div className="flex flex-col items-start gap-[18px]">
          <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-lg font-semibold">
            <h3 className=" text-[#1A1C21]">
              Invoice <span>#{invoiceInfo?.invoice_id}</span>
            </h3>
            {/* <p className="text-[#5E6470]">{`#${invoiceInfo?.invoice_id}`}</p> */}
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-sm font-normal">
              <p className="text-[#98999A]">Issued on {created_time}</p>
            </div>
            <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-sm font-medium">
              <p className="text-text-primary">Payment due by {expired_time}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[90px] w-[90px]">
            <Image
              src={invoiceInfo?.from_company_logo}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-3 rounded-lg border border-[#EBEFF6] px-6 py-[18px]">
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex flex-row items-center justify-start gap-[6px] text-sm font-semibold leading-[150%] text-[#98999A]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M18 9.5C18 14.4703 13.9703 18.5 9 18.5C4.02975 18.5 0 14.4703 0 9.5C0 4.52975 4.02975 0.5 9 0.5C13.9703 0.5 18 4.52975 18 9.5Z"
                fill="#1890FF"
              />
              <path
                d="M13.7633 5.2627L7.65678 11.3764L5.13588 8.8627L3.86328 10.1353L7.65858 13.9216L15.0363 6.53529L13.7633 5.2627Z"
                fill="white"
              />
            </svg>
            <h5 className="text-xs font-medium uppercase leading-3 tracking-[0.48px]">
              Bill FROM:
            </h5>
          </div>
          <div className="flex w-full flex-col items-start gap-[3px] rounded-xl border-[0.9px] border-[#EBEFF6] bg-[#F6F8FC] px-6 py-[18px] text-xs font-normal leading-normal text-text-secondary">
            <div className="flex flex-row items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
              >
                <path
                  d="M8.9997 2.2998C7.0113 2.2998 5.3997 3.9114 5.3997 5.8998V6.4998C5.3997 8.4882 7.0113 10.0998 8.9997 10.0998C10.9881 10.0998 12.5997 8.4882 12.5997 6.4998V5.8998C12.5997 3.9114 10.9881 2.2998 8.9997 2.2998ZM8.99853 11.8998C6.59492 11.8998 3.51093 13.1999 2.62353 14.3537C2.07513 15.0671 2.59717 16.0998 3.49657 16.0998H14.5017C15.4011 16.0998 15.9231 15.0671 15.3747 14.3537C14.4873 13.2005 11.4021 11.8998 8.99853 11.8998Z"
                  fill="#1890FF"
                />
              </svg>
              {(invoiceInfo?.from_first_name ||
                invoiceInfo?.from_last_name) && (
                <p className="font-semibold">
                  {" "}
                  {invoiceInfo?.from_first_name} {invoiceInfo?.from_last_name}
                </p>
              )}
            </div>
            <p> {invoiceInfo?.from_company}</p>
            {(invoiceInfo?.from_address_line_1 ||
              invoiceInfo?.from_address_line_2) && (
              <p>
                {invoiceInfo?.from_address_line_1}{" "}
                {invoiceInfo?.from_address_line_2}{" "}
              </p>
            )}
            {invoiceInfo?.from_city && <p>{invoiceInfo?.from_city}</p>}
            {invoiceInfo?.from_postal_code && (
              <p>{invoiceInfo?.from_postal_code}</p>
            )}
            {invoiceInfo?.from_country && <p>{invoiceInfo?.from_country}</p>}
            {profile?.email_google && <p>{profile?.email_google}</p>}
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex flex-row items-center justify-start gap-[6px] text-sm font-semibold leading-[150%] text-[#98999A]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M18 9.5C18 14.4703 13.9703 18.5 9 18.5C4.02975 18.5 0 14.4703 0 9.5C0 4.52975 4.02975 0.5 9 0.5C13.9703 0.5 18 4.52975 18 9.5Z"
                fill="#1890FF"
              />
              <path
                d="M13.7633 5.2627L7.65678 11.3764L5.13588 8.8627L3.86328 10.1353L7.65858 13.9216L15.0363 6.53529L13.7633 5.2627Z"
                fill="white"
              />
            </svg>
            <h5 className="text-xs font-medium uppercase leading-3 tracking-[0.48px]">
              Bill TO:
            </h5>
          </div>
          <div className="flex w-full flex-col items-start gap-[3px] rounded-xl border-[0.9px] border-[#EBEFF6] bg-[#F6F8FC] px-6 py-[18px] text-xs font-normal leading-normal text-text-secondary">
            <div className="flex flex-row items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
              >
                <path
                  d="M8.9997 2.2998C7.0113 2.2998 5.3997 3.9114 5.3997 5.8998V6.4998C5.3997 8.4882 7.0113 10.0998 8.9997 10.0998C10.9881 10.0998 12.5997 8.4882 12.5997 6.4998V5.8998C12.5997 3.9114 10.9881 2.2998 8.9997 2.2998ZM8.99853 11.8998C6.59492 11.8998 3.51093 13.1999 2.62353 14.3537C2.07513 15.0671 2.59717 16.0998 3.49657 16.0998H14.5017C15.4011 16.0998 15.9231 15.0671 15.3747 14.3537C14.4873 13.2005 11.4021 11.8998 8.99853 11.8998Z"
                  fill="#1890FF"
                />
              </svg>
              {(invoiceInfo?.to_first_name || invoiceInfo?.to_last_name) && (
                <p className="font-semibold">
                  {invoiceInfo?.to_first_name} {invoiceInfo?.to_last_name}
                </p>
              )}
            </div>
            {invoiceInfo?.to_company && <p> {invoiceInfo?.to_company}</p>}
            {(invoiceInfo?.to_address_line_1 ||
              invoiceInfo?.to_address_line_2) && (
              <p>
                {invoiceInfo?.to_address_line_1}{" "}
                {invoiceInfo?.to_address_line_2}
              </p>
            )}
            {invoiceInfo?.to_city && <p>{invoiceInfo?.to_city}</p>}
            {invoiceInfo?.to_postal_code && (
              <p>{invoiceInfo?.to_postal_code}</p>
            )}
            {invoiceInfo?.to_country && <p>{invoiceInfo?.to_country}</p>}
            {invoiceInfo?.to_email && <p>{invoiceInfo?.to_email}</p>}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-3 px-6 pt-6">
        <h5 className="text-[15px] font-semibold leading-[150%] text-text-primary">
          Expected payment method
        </h5>
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center">
            {dataInvoice?.dataChain?.currencies[0].logo && (
              <Image
                loader={({ src }) => src}
                src={dataInvoice?.dataChain?.currencies[0].logo}
                width={24}
                height={24}
                alt="logo"
              />
            )}
          </div>
          <p className="text-[15px] font-normal uppercase leading-normal text-text-primary">
            {invoiceInfo?.chain}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-3 px-6 pt-6">
        <h5 className="text-[15px] font-semibold leading-[150%] text-text-primary">
          Payment address
        </h5>
        <p className="text-[15px] font-normal leading-normal text-text-primary">
          {invoiceInfo?.to_wallet}
        </p>
      </div>
      <div className="bill w-full px-6 pt-6">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit price</th>
              <th>Tax</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceInfo?.items?.map((item: any, index: any) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item?.quantity}</td>
                <td>SOL {item?.unit_price || 1}</td>
                {/* <td>{`${Number(item?.tax * 100)}%`}</td> */}
                <td>{item?.tax}%</td>
                <td>{Math.round(item?.amount * 1000000) / 1000000}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-end justify-end gap-[1.5px] ">
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Subtotal</h6>
              <p>SOL {sub}</p>
            </div>
          </div>
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Tax</h6>
              <p>SOL {Math.round(tax * 1000000) / 1000000}</p>
            </div>
          </div>
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Total</h6>
              <p> SOL {Math.round(totalAmount * 1000000) / 1000000}</p>
            </div>
          </div>
          <div className="w-[450px] bg-[#1890FF] px-6 py-[6px] text-lg font-semibold leading-[150%] text-[#fff]">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Amount due</h6>
              <p> SOL {Math.round(totalAmount * 1000000) / 1000000}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-[18px] pt-6">
        <div className="h-[1px] w-full bg-[rgba(0,0,0,0.12)]"></div>
        <div className="flex flex-row items-center justify-end">
          {/* <div className="flex flex-col items-start justify-start gap-[6px] text-sm font-normal leading-[21px] text-text-primary">
            <p className="font-semibold text-[#1890FF]">Terms</p>
            <p>Thank you for the business!</p>
          </div> */}
          {invoiceInfo &&
            String(invoiceInfo?.chain).toLowerCase() === "solana" && (
              <div className="flex flex-col items-center justify-center gap-[9px] text-sm font-medium leading-[21px] text-[#202124]">
                <QRCodeCanvas value={invoiceInfo?.qr} />
                {/* <Image
              src="/images/invoices/qr.png"
              width={120}
              height={120}
              alt=""
            /> */}
                {/* <canvas></canvas> */}

                <p>Scan here to pay</p>
              </div>
            )}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center gap-6 text-sm font-medium leading-[21px] text-[#5E6470]">
            <a href="bitlink.work">bitlink.work</a>
            <div className="h-[18px] w-[0.75px] bg-[rgba(0,0,0,0.12)]"></div>
            <a href="mailto:support@bitlink.work">support@bitlink.work</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewInvoiceInfo;
