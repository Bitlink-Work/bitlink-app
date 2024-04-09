import { getChainCurrency } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
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

const ISOInvoiceSkeleton = () => {
  return (
    <div className="invoice_info mx-auto flex w-full flex-1 flex-col border-[2px] border-[#DEDEDE] bg-[#fff] px-8 pb-6 pt-3 shadow-[0px_8px_16px_0px_rgba(37,49,76,0.15)]">
      <div className="mb-[27px] flex w-full flex-row items-start justify-between">
        <div className="flex flex-col items-start gap-[18px]">
          <div className="flex flex-col items-start justify-start gap-[6px]">
            <h3 className="text-[48px] font-semibold leading-[72px] text-[#202124] ">
              Invoice
            </h3>
            <div className="flex flex-col gap-[6.75px]">
              <h4 className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></h4>
              <div className="flex flex-col items-start justify-start gap-[3px] text-sm font-normal leading-[21px] text-[#444445]">
                <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
                <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
                <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
                <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
                <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[90px] w-[90px] animate-pulse rounded-full bg-[#DEDEDE]"></div>
      </div>
      <div className="flex w-full flex-row items-start justify-between rounded-[18px] border border-[#EBEFF6] px-6 py-4">
        <div className="flex flex-col items-start justify-start gap-[12px] text-sm font-normal leading-[21px] text-[#444445]">
          <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
            BILL TO
          </h5>
          <div className="flex flex-col items-start gap-[3px] ">
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[24px] text-sm font-normal leading-[21px] text-[#444445]">
          <div className="flex flex-col items-start gap-[12px]">
            <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
              Date Issued
            </h5>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
          </div>
          <div className="flex flex-col items-start gap-[12px]">
            <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
              Due Date
            </h5>
            <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[12px] text-sm font-normal leading-[21px] text-[#444445]">
          <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
            INVOICE NUMBER
          </h5>
          <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
        </div>
        <div className="flex flex-col items-start justify-start gap-[12px] text-sm font-normal leading-[21px] text-[#444445]">
          <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
            AMOUNT DUE
          </h5>
          <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[18px] px-6 pt-6">
        <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
          Expected payment method
        </h5>
        <div className="flex flex-row items-center gap-[18px]">
          <div className="flex h-6 w-6 items-center justify-center">
            <Image
              className="h-full w-full object-contain"
              src=""
              width={24}
              height={24}
              alt=""
            />
          </div>
          <p className="h-4 w-[50px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[18px] px-6 pt-6">
        <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
          Payment address
        </h5>
        <p className="h-4 w-[100px] animate-pulse rounded-xl bg-[#DEDEDE]"></p>
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

const ISOInvoice = ({ invoiceInfo, fetchInvoiceInfo }: Props) => {
  const [currency, setCurrency] = useState<any>(null);
  const profile = useAppSelector(selectProfile);
  const created_time = new Date(
    invoiceInfo?.created_time * 1000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expired_time =
    invoiceInfo?.expired_time !== 0
      ? new Date(invoiceInfo?.expired_time * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Upon receipt";

  const dispatch = useAppDispatch();

  const currencies = useAppSelector(selectCurrency);

  useEffect(() => {
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
  }, [invoiceInfo, currencies]);

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
    dispatch(getChainCurrency({}));
  }, []);

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
  //     const label = invoiceInfo?.from_company || "";
  //     const message = "Thanks for the business!";
  //     const memo = invoiceInfo?.invoice_id || "";
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

  if (!invoiceInfo) return <ISOInvoiceSkeleton />;

  return (
    <div className="invoice_info mx-auto flex w-full flex-1 flex-col border-[2px] border-[#DEDEDE] bg-[#fff] px-10 pb-8 pt-4 shadow-[0px_8px_16px_0px_rgba(37,49,76,0.15)]">
      <div className="mb-[27px] flex w-full flex-row items-start justify-between">
        <div className="flex flex-col items-start gap-[18px]">
          <div className="flex flex-col items-start justify-start gap-[6px]">
            <h3 className="text-[48px] font-semibold leading-[72px] text-[#202124] ">
              Invoice
            </h3>
            <div className="flex flex-col gap-[6.75px]">
              <h4 className="text-start text-[15px] font-semibold uppercase leading-6 text-[#202124]">
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
              </h4>
              <div className="flex flex-col items-start justify-start gap-[3px] text-[12px] font-normal leading-[21px] text-[#444445]">
                <p>{invoiceInfo?.from_email}</p>
                <p>{invoiceInfo?.from_address_line_1}</p>
                <p>{invoiceInfo?.from_address_line_2}</p>
                <p>
                  {invoiceInfo?.from_postal_code} {invoiceInfo?.from_city}
                </p>
                <p>{invoiceInfo?.from_country}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex h-full max-h-[249px] items-center justify-center overflow-hidden p-8">
          <Image
            loader={({ src }) => src}
            src={invoiceInfo?.from_company_logo || ""}
            alt={""}
            width={185}
            height={185}
            objectFit="cover"
            className="h-full object-contain"
          />
        </div>
      </div>
      <div className="flex w-full flex-row items-start justify-start gap-[180px]">
        <div className="flex flex-col items-start justify-start gap-[12px] rounded-[18px] py-4 text-sm font-normal leading-[21px] text-[#444445]">
          <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
            BILL TO
          </h5>
          <div className="flex flex-col items-start gap-[3px] ">
            <p className="text-start">
              {invoiceInfo?.to_company
                ? invoiceInfo?.to_company
                : invoiceInfo?.to_first_name &&
                    invoiceInfo?.to_last_name &&
                    invoiceInfo?.to_first_name !== "" &&
                    invoiceInfo?.to_last_name !== ""
                  ? `${invoiceInfo?.to_first_name} ${invoiceInfo?.to_last_name}`
                  : ""}
            </p>
            <p className="text-start">{invoiceInfo?.to_email}</p>
            <p className="text-start">{invoiceInfo?.to_address_line_1}</p>
            <p className="text-start">{invoiceInfo?.to_address_line_2}</p>
            <p className="text-start">
              {invoiceInfo?.to_postal_code} {invoiceInfo?.to_city}
            </p>
            <p className="text-start">{invoiceInfo?.to_country}</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[18px] px-6 py-4 text-sm font-normal leading-[21px] text-[#444445]">
          <div className="flex flex-col items-start gap-[8px]">
            <h5 className="whitespace-nowrap text-sm font-semibold uppercase leading-[15px] tracking-[0.42px] text-[#2B4896]">
              INVOICE NO
            </h5>
            <p className="text-end text-sm font-normal leading-[21px]">
              {invoiceInfo?.invoice_id}
            </p>
          </div>
          <div className="flex flex-col items-start gap-[8px]">
            <h5 className="whitespace-nowrap text-sm font-semibold uppercase leading-[15px] tracking-[0.42px] text-[#2B4896]">
              Date Issued
            </h5>
            <p className="text-end text-sm font-normal leading-[21px]">
              {created_time}
            </p>
          </div>
          <div className="flex flex-col items-start gap-[8px]">
            <h5 className="whitespace-nowrap text-sm font-semibold uppercase leading-[15px] tracking-[0.42px] text-[#2B4896]">
              Due Date
            </h5>
            <p className="text-end text-sm font-normal leading-[21px]">
              {expired_time}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col items-start justify-start gap-[12px] text-sm font-normal leading-[21px] text-[#444445]">
        <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
          INVOICE NUMBER
        </h5>
        <p className="text-start">
          {addressWalletCompact(invoiceInfo?.invoice_id)}
        </p>
      </div> */}
      {/* <div className="flex flex-col items-start justify-start gap-[12px] text-sm font-normal leading-[21px] text-[#444445]">
        <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
          AMOUNT DUE
        </h5>
        <p className="text-start">
          {invoiceInfo?.currency} {invoiceInfo?.total_value}
        </p>
      </div> */}
      <div className="flex w-full flex-col items-start gap-[18px] pt-6">
        <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
          Expected payment method
        </h5>
        <div className="flex flex-row items-center gap-[9px]">
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
          <p className="text-[15px] font-normal leading-[22.5px] text-[#202124]">
            {invoiceInfo?.currency} <span>({invoiceInfo?.chain})</span>
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[18px] pt-6">
        <h5 className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
          Payment address
        </h5>
        <p className="text-[15px] font-semibold leading-[22.5px] text-[#202124]">
          {invoiceInfo?.to_wallet}
        </p>
      </div>
      <div className="bill w-full pt-6">
        <table>
          <thead>
            <tr>
              <th className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
                Description
              </th>
              <th className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
                Quantity
              </th>
              <th className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
                Unit price
              </th>
              <th className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
                Tax
              </th>
              <th className="whitespace-nowrap text-[15px] font-semibold uppercase leading-[11.25px] tracking-[0.42px] text-[#2B4896]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceInfo?.items?.map((item: any) => (
              <tr key={item?.id}>
                <td className="text-[15px] font-normal leading-[22.5px] text-[#202124]">
                  {item?.description}
                </td>
                <td className="text-[15px] font-normal leading-[22.5px] text-[#202124]">
                  {item?.quantity}
                </td>
                <td className="text-[15px] font-normal leading-[22.5px] text-[#202124]">
                  {invoiceInfo?.currency} {item?.unit_price}
                </td>
                <td className="text-[15px] font-normal leading-[22.5px] text-[#202124]">{`${Number(
                  item?.tax,
                )}%`}</td>
                <td className="text-[15px] font-normal leading-[22.5px] text-[#202124]">
                  {invoiceInfo?.currency} {item?.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-end justify-end gap-[1.5px] ">
          <div className="w-[450px] bg-transparent px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Subtotal</h6>
              <p>
                {invoiceInfo?.currency} {invoiceInfo?.sub_total}
              </p>
            </div>
          </div>
          <div className="w-[450px] bg-transparent px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Tax</h6>
              <p>
                {invoiceInfo?.currency} {invoiceInfo?.total_tax}
              </p>
            </div>
          </div>
          <div className="w-[450px] bg-transparent px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
            <div className="flex h-9 w-full items-center justify-between">
              <h6>Total</h6>
              <p>
                {invoiceInfo?.currency}{" "}
                {Math.round(invoiceInfo?.total_value * 1000000) / 1000000}
              </p>
            </div>
          </div>
          <div className="w-[450px] border-t-[2px] border-[#98999A] bg-transparent px-6 py-[6px] text-lg font-semibold leading-[27px] text-[#202124]">
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

export default ISOInvoice;
