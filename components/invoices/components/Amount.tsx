"use client";
import MainButton from "@/components/button/MainButton";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { useAppSelector } from "@/public/hook/hooks";

type Props = {
  setShowPopup: (value: boolean) => void;
};

const fixNumber = (x: any) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

const Amount = ({
  setShowPopup,
  items,
  setShowPopupAmount,
  step8Data,
  setTotalAmountData,
}: any) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const router = useRouter();
  const [subTotal, setSubTotal] = useState<any>();

  var totalAmount = 0;
  var sub = 0;
  var tax = 0;

  for (var i = 0; i < items.length; i++) {
    var amountStr = Number(items[i]["amount"]);
    sub += Number(items[i]["quantity"]) * Number(items[i]["unit_price"]);

    tax +=
      Number(items[i]["quantity"]) *
      Number(items[i]["unit_price"]) *
      (Number(items[i]["tax"]) / 100);

    totalAmount += amountStr;
  }

  setTotalAmountData(totalAmount);

  const handleAcceptValue = () => {
    setInvoiceToLocalStorage({
      ...dataInvoice,
      items: items as Array<TItemAmount>,
    });
    router.push("/home?step=11");
  };
  const currencies = useAppSelector(selectCurrency);

  const backNetwork = currencies.find(
    (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
  );
  const backCurrency = backNetwork?.currencies.find(
    (item: any) => item?.currency_symbol === dataInvoice?.currency,
  );

  return (
    <div className="flex w-[600px] flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10">
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        Total amount
      </h3>
      <div className="flex w-full  flex-col ">
        <div className="border-b-solid flex justify-between border-b border-b-[#FFFFFF] bg-[#1890FF0A] px-[16px] py-[6px]">
          <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
            Subtotal
          </div>
          <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
            {backCurrency?.currency_symbol}{" "}
            {Math.round(sub * 1000000) / 1000000}
          </div>
        </div>
        <div className="border-b-solid flex justify-between border-b border-b-[#FFFFFF] bg-[#1890FF0A] px-[16px] py-[6px]">
          <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
            Tax
          </div>
          <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
            {backCurrency?.currency_symbol} {tax}
          </div>
        </div>
        <div className="border-b-solid flex justify-between border-b border-b-[#FFFFFF] bg-[#1890FF0A] px-[16px] py-[6px]">
          <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
            Total
          </div>
          <div className="text-[14px] font-normal leading-[21px] text-text-secondary">
            {backCurrency?.currency_symbol}{" "}
            {Math.round(totalAmount * 1000000) / 1000000}
          </div>
        </div>
        <div className=" flex justify-between  bg-[#1890FF] px-[16px] py-[6px]">
          <div className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF]">
            Amount due
          </div>
          <div className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF]">
            {backCurrency?.currency_symbol}{" "}
            {Math.round(totalAmount * 1000000) / 1000000}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
        <button
          onClick={() => setShowPopup && setShowPopup(false)}
          className="w-fit rounded-lg bg-[#fff] px-6 py-3"
        >
          Cancel
        </button>
        <MainButton title="Agree" onClick={handleAcceptValue} />
      </div>
    </div>
  );
};

export default Amount;
