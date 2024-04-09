import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { selectProfile } from "@/public/reducers/profileSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import { addressWalletCompact } from "@/public/utils/lib";
import { findReference, validateTransfer } from "@solana/pay";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import bs58 from "bs58";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  invoiceInfo: any;
  fetchInvoiceInfo: (invoice_id: any) => void;
};

const InvoiceSkeleton = () => {
  return (
    <div className="invoice_info mx-auto flex w-fit flex-1 flex-col border-[1.5px] border-[#DEDEDE] bg-[#fff] px-6 py-[28.5px]">
      <div className="mb-[27px] flex w-[844.5px] flex-row items-start justify-between">
        <div className="flex flex-col items-start gap-[18px]">
          <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-lg font-semibold">
            <h3 className=" text-[#1A1C21]">Invoice</h3>
            <div className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE] "></div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE] "></div>
            <div className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE] "></div>
          </div>
        </div>
        <div className="h-[90px] w-[90px] animate-pulse rounded-full bg-[#DEDEDE]"></div>
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
              <div className="h-4 w-[60px] animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            </div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
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
              <div className="h-4 w-[60px] animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            </div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
            <div className="h-4 w-full animate-pulse rounded-xl bg-[#DEDEDE]"></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-3 px-6 pt-6">
        <h5 className="text-[15px] font-semibold leading-[150%] text-text-primary">
          Expected payment method
        </h5>
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-6 w-6 animate-pulse items-center justify-center bg-[#DEDEDE]"></div>
          <div className="h-4 w-[150px] animate-pulse rounded-xl bg-[#DEDEDE]"></div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-3 px-6 pt-6">
        <h5 className="text-[15px] font-semibold leading-[150%] text-text-primary">
          Payment address
        </h5>
        <div className="h-4 w-[150px] rounded-xl bg-[#DEDEDE]"></div>
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
            <tr>
              <td className="text-center">
                <div className="h-4 w-[100px] rounded-xl bg-[#DEDEDE]"></div>
              </td>
              <td className="text-center">
                <div className="h-4 w-[100px] rounded-xl bg-[#DEDEDE]"></div>
              </td>
              <td className="text-center">
                <div className="h-4 w-[100px] rounded-xl bg-[#DEDEDE]"></div>
              </td>
              <td className="text-center">
                <div className="h-4 w-[100px] rounded-xl bg-[#DEDEDE]"></div>
              </td>
              <td className="text-center">
                <div className="h-4 w-[100px] rounded-xl bg-[#DEDEDE]"></div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-col items-end justify-end gap-[1.5px] ">
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Subtotal</h6>
              <div className="h-4 w-[150px] rounded-xl bg-[#DEDEDE]"></div>
            </div>
          </div>
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Tax</h6>
              <div className="h-4 w-[150px] rounded-xl bg-[#DEDEDE]"></div>
            </div>
          </div>
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Total</h6>
              <div className="h-4 w-[150px] rounded-xl bg-[#DEDEDE]"></div>
            </div>
          </div>
          <div className="w-[450px] bg-[#1890FF] px-6 py-[6px] text-lg font-semibold leading-[150%] text-[#fff]">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Amount due</h6>
              <div className="h-4 w-[150px] rounded-xl bg-[#DEDEDE]"></div>
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
          <div className="flex flex-col items-center justify-center gap-[9px] text-sm font-medium leading-[21px] text-[#202124]">
            <div
              id="qr-code"
              className="flex h-[160px] w-[160px] items-center justify-center"
            >
              {/* <Image
              src="/images/invoices/qr.png"
              width={120}
              height={120}
              alt=""
            /> */}
              {/* <canvas></canvas> */}
            </div>
            <p>Scan here to pay</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="h-9 w-9 rounded-full bg-[#DEDEDE]"></div>
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

const InvoiceInfo = ({ invoiceInfo, fetchInvoiceInfo }: Props) => {
  const [currency, setCurrency] = useState<any>(null);
  const profile = useAppSelector(selectProfile);
  const created_time = new Date(
    invoiceInfo?.created_time * 1000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log(
    "first",
    Math.ceil(
      (new Date(invoiceInfo?.expired_time * 1000).getTime() -
        new Date(invoiceInfo?.created_time * 1000).getTime()) /
        (24 * 60 * 60 * 1000),
    ) > 100,
  );

  const expired_time =
    Math.ceil(
      (new Date(invoiceInfo?.expired_time * 1000).getTime() -
        new Date(invoiceInfo?.created_time * 1000).getTime()) /
        (24 * 60 * 60 * 1000),
    ) > 100000
      ? "Upon receipt"
      : new Date(invoiceInfo?.expired_time * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  const currencies = useAppSelector(selectCurrency);
  // const fetchCurrency = useCallback(async () => {
  //   try {
  //     await dispatch(getChainCurrency({}));
  //   } catch (error) {
  //     console.error("Error fetching currency:", error);
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   fetchCurrency();
  // }, [fetchCurrency]);

  const verifyTx = async (
    recipient: PublicKey,
    amount: BigNumber,
    reference: PublicKey,
    memo: string,
  ) => {
    try {
      const found = await findReference(connection, reference, {
        finality: "confirmed",
      });
      if (found) {
        const signature = found.signature;
        const res = await validateTransfer(connection, signature, {
          recipient,
          amount,
        });
        if (res) {
          const status = await invoiceServices.updateInvoiceStatus({
            invoice_id: invoiceInfo?.invoice_id,
          });

          if (status) {
            fetchInvoiceInfo(invoiceInfo?.invoice_id);
          }
        }
      }
    } catch (error) {
      console.error("validate_error:::", error);
    }
  };

  useEffect(() => {
    if (invoiceInfo) {
      if (invoiceInfo) {
        const network = currencies?.find(
          (currency: any) =>
            String(currency?.chain_name).toLowerCase() ===
            String(invoiceInfo?.chain).toLowerCase(),
        );

        setCurrency(
          network?.currencies?.find(
            (item: any) => item?.currency_symbol === invoiceInfo?.currency,
          ),
        );
      }
    }
  }, [invoiceInfo, currencies]);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const [recipient, setRecipient] = useState<PublicKey>();
  const [memo, setMemo] = useState("");
  const amount = useMemo(
    () => new BigNumber(invoiceInfo?.total_value || 0),
    [invoiceInfo],
  );
  const [reference, setReference] = useState<PublicKey>();
  // useEffect(() => {
  //   if (invoiceInfo && recipient) {
  //     const label =
  //       invoiceInfo?.from_company ||
  //       `${invoiceInfo?.from_first_name} ${invoiceInfo?.from_last_name}` ||
  //       "";
  //     const message = "Thanks for the business!";
  //     // const memo = invoiceInfo?.invoice_id || "";
  //     const url = encodeURL({
  //       recipient,
  //       amount,
  //       reference,
  //       label,
  //       message,
  //       memo,
  //     });
  //     const isBrowser = typeof window !== "undefined";
  //     if (isBrowser) {
  //       if (invoiceInfo) {
  //         const qr = createQR(url, 160);
  //         qr._options.image = "/images/received-invoices/solana.svg";
  //         const element = document.getElementById("qr-code");
  //         qr.append(element as HTMLElement);
  //       }
  //     }
  //   }
  // }, [amount, memo, recipient, reference]);

  useEffect(() => {
    if (invoiceInfo && String(invoiceInfo?.chain).toLowerCase() === "solana") {
      setReference(new PublicKey(invoiceInfo?.reference));
      const wallet = bs58.decode(
        invoiceInfo?.to_wallet ||
          "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
      );
      setRecipient(new PublicKey(wallet || ""));
      setMemo(invoiceInfo?.invoice_id || "");
    }
  }, [invoiceInfo]);

  useEffect(() => {
    if (
      String(invoiceInfo?.status).toLowerCase() !== "completed" &&
      String(invoiceInfo?.chain).toLowerCase() === "solana"
    ) {
      if (reference && recipient && amount && memo) {
        const interval = setInterval(() => {
          verifyTx(recipient, amount, reference, memo);
        }, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [invoiceInfo, reference, recipient, amount, memo]);

  if (!invoiceInfo) return <InvoiceSkeleton />;

  return (
    <div className="invoice_info mx-auto flex w-[900px] flex-1 flex-col border-[2px] border-[#DEDEDE] bg-[#fff] px-6 py-[28.5px] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
      <div className="mb-[27px] flex w-[844.5px] flex-row items-start justify-between">
        <div className="flex flex-col items-start gap-[18px]">
          <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-lg font-semibold">
            <h3 className=" text-[#1A1C21]">Invoice</h3>
            <p className="text-[#5E6470]">{`#${invoiceInfo?.invoice_id}`}</p>
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
        <div className="relative flex h-[90px] w-[90px] items-center justify-center overflow-hidden">
          <Image
            loader={({ src }) => src}
            src={invoiceInfo?.from_company_logo || ""}
            alt={""}
            width={90}
            height={90}
            objectFit="cover"
          />
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
              Bill From:
            </h5>
          </div>
          <div className="flex w-full flex-col items-start gap-[3px] rounded-xl border-[0.9px] border-[#EBEFF6] bg-[#F6F8FC] px-6 py-[18px] text-xs font-normal leading-normal text-text-secondary">
            <div className="flex flex-row items-center gap-3">
              {invoiceInfo?.user_type === EnumTypeProfile.Freelancer ? (
                <Image
                  src="/images/invoices/personal.svg"
                  width={24}
                  height={24}
                  alt={""}
                />
              ) : (
                <Image
                  src="/images/invoices/business.svg"
                  width={24}
                  height={24}
                  alt={""}
                />
              )}
              <p className="font-semibold">
                {invoiceInfo?.user_type === EnumTypeProfile.Freelancer
                  ? invoiceInfo?.from_first_name &&
                    invoiceInfo?.from_last_name &&
                    invoiceInfo?.from_first_name !== "" &&
                    invoiceInfo?.from_last_name !== ""
                    ? `${invoiceInfo?.from_first_name} ${invoiceInfo?.from_last_name}`
                    : invoiceInfo?.from_wallet &&
                        invoiceInfo?.from_wallet !== ""
                      ? addressWalletCompact(invoiceInfo?.to_wallet)
                      : ""
                  : invoiceInfo?.from_company
                    ? invoiceInfo?.from_company
                    : invoiceInfo?.from_wallet &&
                        invoiceInfo?.from_wallet !== ""
                      ? addressWalletCompact(invoiceInfo?.to_wallet)
                      : ""}
              </p>
            </div>
            {/* <p>{invoiceInfo?.from_company}</p> */}
            <p>{invoiceInfo?.from_email}</p>
            <p>{invoiceInfo?.from_address_line_1}</p>
            <p>{invoiceInfo?.from_address_line_2}</p>
            <p>
              {invoiceInfo?.from_postal_code} {invoiceInfo?.from_city}
            </p>
            <p>{invoiceInfo?.from_country}</p>
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
              Bill To:
            </h5>
          </div>
          <div className="flex w-full flex-col items-start gap-[3px] rounded-xl border-[0.9px] border-[#EBEFF6] bg-[#F6F8FC] px-6 py-[18px] text-xs font-normal leading-normal text-text-secondary">
            <div className="flex flex-row items-center gap-3">
              {invoiceInfo?.partner_type === EnumTypeProfile.Freelancer ? (
                <Image
                  src="/images/invoices/personal.svg"
                  width={24}
                  height={24}
                  alt={""}
                />
              ) : (
                <Image
                  src="/images/invoices/business.svg"
                  width={24}
                  height={24}
                  alt={""}
                />
              )}
              <p className="font-semibold">
                {invoiceInfo?.partner_type === EnumTypeProfile.Freelancer
                  ? invoiceInfo?.to_first_name &&
                    invoiceInfo?.to_last_name &&
                    invoiceInfo?.to_first_name !== "" &&
                    invoiceInfo?.to_last_name !== ""
                    ? `${invoiceInfo?.to_first_name} ${invoiceInfo?.to_last_name}`
                    : ""
                  : invoiceInfo?.to_company
                    ? invoiceInfo?.to_company
                    : ""}
              </p>
            </div>
            <p>{invoiceInfo?.to_email}</p>
            {/* <p>{invoiceInfo?.to_company}</p>  */}
            <p>{invoiceInfo?.to_address_line_1}</p>
            <p>{invoiceInfo?.to_address_line_2}</p>
            <p>
              {invoiceInfo?.to_postal_code} {invoiceInfo?.to_city}
            </p>
            <p>{invoiceInfo?.to_country}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-3 px-6 pt-6">
        <h5 className="text-[15px] font-semibold leading-[150%] text-text-primary">
          Expected payment method
        </h5>
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center">
            <Image
              className="h-full w-full object-contain"
              loader={({ src }) => src}
              src={currency?.logo || ""}
              width={24}
              height={24}
              alt=""
            />
          </div>
          <p className="text-[15px] font-normal leading-normal text-text-primary">
            {invoiceInfo?.currency} ({invoiceInfo?.chain})
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
            {invoiceInfo?.items?.map((item: any) => (
              <tr key={item?.id}>
                <td>{item?.description}</td>
                <td>{item?.quantity}</td>
                <td>
                  {invoiceInfo?.currency} {item?.unit_price}
                </td>
                <td>{`${Number(item?.tax)}%`}</td>
                <td>
                  {invoiceInfo?.currency} {item?.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-end justify-end gap-[1.5px] ">
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Subtotal</h6>
              <p>
                {invoiceInfo?.currency} {invoiceInfo?.sub_total}
              </p>
            </div>
          </div>
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Tax</h6>
              <p>
                {invoiceInfo?.currency} {invoiceInfo?.total_tax}
              </p>
            </div>
          </div>
          <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Total</h6>
              <p>
                {invoiceInfo?.currency}{" "}
                {Math.round(invoiceInfo?.total_value * 1000000) / 1000000}
              </p>
            </div>
          </div>
          <div className="w-[450px] bg-[#1890FF] px-6 py-[6px] text-lg font-semibold leading-[150%] text-[#fff]">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Amount due</h6>
              <p>
                {invoiceInfo?.currency}{" "}
                {Math.round(invoiceInfo?.total_value * 1000000) / 1000000}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-[18px] pt-6">
        <div className="h-[1px] w-full bg-[rgba(0,0,0,0.12)]"></div>
        <div className="flex flex-row items-end justify-between">
          <div className="flex flex-col items-start justify-start gap-[6px] text-[15px] font-normal leading-[21px] text-[#202124]">
            <p className="font-semibold text-[#2B4896]">Note</p>
            <p>Thank you for the business!</p>
          </div>
          {invoiceInfo &&
            String(invoiceInfo?.chain).toLowerCase() === "solana" &&
            invoiceInfo.status !== "OVERDUE" &&
            invoiceInfo?.status !== "COMPLETED" && (
              <div className="flex flex-col items-center justify-center gap-[6px] text-[15px] font-medium leading-[21px] text-[#202124]">
                <QRCodeCanvas
                  value={invoiceInfo?.qr}
                  imageSettings={{
                    src: "/images/received-invoices/solana.svg",
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
                {/* {qrCode && <QRCode value={qrCode} />} */}
                <p>Scan here to pay</p>
              </div>
            )}
        </div>
        <div className="flex flex-row items-center justify-between text-sm font-medium leading-[21px] text-[#5E6470]">
          <div className="flex flex-row items-center justify-center gap-6">
            <a href="bitlink.work">bitlink.work</a>
            <div className="h-[18px] w-[0.75px] bg-[rgba(0,0,0,0.12)]"></div>
            <a href="mailto:support@bitlink.work">support@bitlink.work</a>
          </div>
          <p className="text-[#202124]">
            According to <b>ISO 19005-3 </b>
            standard format
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfo;
