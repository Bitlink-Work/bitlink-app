"use client";
import { createQR, encodeURL } from "@solana/pay";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { useEffect, useState } from "react";
type Props = {
  invoiceInfo?: any;
  reference?: any;
};

const Footer = ({ invoiceInfo, reference }: Props) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  // const recipient = new PublicKey(
  //   "C19Be7heTmJdR1YAviPULCmDN7dFy6AdjFPk6UQ71Tp3",
  // );
  const [recipient, setRecipient] = useState<PublicKey>();
  // const reference = invoiceInfo?.reference || "";

  useEffect(() => {
    if (invoiceInfo && recipient) {
      const amount = new BigNumber(invoiceInfo?.total_value || 0);
      const label = invoiceInfo?.from_company || "";
      const message = "Thanks for the business!";
      const url = encodeURL({
        recipient,
        amount,
        reference,
        label,
        message,
      });

      const isBrowser = typeof window !== "undefined";
      if (isBrowser) {
        const qrCode = createQR(url, 120);
        const element = document.getElementById("qr-code");
        qrCode.append(element as HTMLElement);
      }
    }
  }, [recipient, reference]);

  useEffect(() => {
    if (invoiceInfo && String(invoiceInfo?.chain).toLowerCase() === "solana") {
      const wallet = bs58.decode(
        invoiceInfo?.to_wallet ||
          "7BKkjkJaT4KWvRA9nJrDeCaLrrECK7ynMGFLcbPU4fSi",
      );
      setRecipient(new PublicKey(wallet || ""));
    }
  }, [invoiceInfo]);

  return (
    <div className="flex w-full flex-col gap-6 pt-[30px]">
      <div className="h-[1px] w-full bg-[rgba(0,0,0,0.12)]"></div>
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col items-start justify-start gap-[6px] text-sm font-normal leading-[21px] text-text-primary">
          <p className="font-semibold text-[#1890FF]">Note</p>
          <p>Thank you for the business!</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-6 text-sm font-medium leading-[21px] text-[#5E6470]">
          <a href="bitlink.work">bitlink.work</a>
          <div className="h-[18px] w-[0.75px] bg-[rgba(0,0,0,0.12)]"></div>
          <a href="mailto:support@bitlink.work">support@bitlink.work</a>
        </div>
        {/* {invoiceInfo && (
          <div className="flex flex-col items-center justify-center gap-[9px] text-sm font-medium leading-[21px] text-[#202124]">
            <div
              id="qr-code"
              className="flex h-[120px] w-[120px] items-center justify-center"
            > */}
        {/* <Image
              src="/images/invoices/qr.png"
              width={120}
              height={120}
              alt=""
            /> */}
        {/* <canvas></canvas> */}
        {/* </div>
            <p>Scan here to pay</p>
          </div>
        )} */}
      </div>
      {/* <div className="flex flex-row items-center justify-between"> */}
      {/* <div className="flex h-9 w-9 items-center justify-center">
          {logo && <Image src={logo} width={36} height={36} alt="" />}
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default Footer;
