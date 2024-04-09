import { invoiceServices } from "@/public/api/invoiceServices";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
type Props = {
  setStep: (value: number) => void;
  edit?: boolean;
  invoiceInfo?: any;
  currencies: any;
  receiver: any;
  currency: any;
  currentNetwork: any;
  setCurrency: (value: any) => void;
  setCurrentNetwork: (value: any) => void;
  items: any;
  setFormValues: (value: any) => void;
};

const schema = z.object({
  public_address: z.string().trim().min(1, { message: "Enter wallet address" }),
});
const PaymentNetwork = ({
  setStep,
  edit,
  invoiceInfo,
  currencies,
  receiver,
  currency,
  currentNetwork,
  setCurrency,
  setCurrentNetwork,
  items,
  setFormValues,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      public_address: invoiceInfo?.to_wallet || "",
    },
    resolver: zodResolver(schema),
  });
  const [network, setNetwork] = useState("");

  useEffect(() => {
    setNetwork(currentNetwork?.chain_name);
  }, [currentNetwork]);

  // useEffect(() => {
  //   if (network !== "") {
  //     if (wallet !== "") {
  //       setWallet(wallet);
  //     }
  //   }
  // }, [wallet, network, setWallet]);

  // useEffect(() => {
  //   if (receiver) {
  //     if (currencies && currency) {
  //       const network = currencies?.find(
  //         (item: any) => item?.chain_name === "SOLANA",
  //       );
  //       setNetwork(network?.chain_name);
  //       setCurrentNetwork(network);
  //     }
  //   } else {
  //     setNetwork("");
  //     setCurrentNetwork(currencies[0]);
  //   }
  // }, [
  //   currencies,
  //   currency,
  //   edit,
  //   invoiceInfo,
  //   receiver,
  //   setCurrentNetwork,
  //   setValue,
  //   setWallet,
  // ]);

  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <h5 className="flex flex-row items-center gap-[6px] text-sm font-medium leading-[150%] text-text-primary">
        Your payment network ⭐
      </h5>
      <div className="flex flex-row items-center justify-start gap-3">
        {currencies?.map((item: any, index: any) => (
          <div
            onClick={() => {
              setNetwork(item?.chain_name);
              setCurrency(item?.currencies[0]?.currency_symbol);
              setFormValues((prev: any) => {
                return {
                  ...prev,
                  currency: item?.currencies[0].currency_symbol,
                  chain: item?.chain_name,
                };
              });
              setCurrentNetwork(item);
            }}
            key={index}
            className={`flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium leading-[150%] text-text-primary ${
              network === item?.chain_name
                ? "border-primary bg-[#EAEDF5]"
                : "border-[#DEDEDE] bg-[#fff]"
            }`}
          >
            <div className="flex h-6 w-6 items-center justify-center">
              <Image
                className="h-full w-full object-contain"
                src={item?.currencies[0]?.logo}
                width={24}
                height={24}
                alt=""
              />
            </div>
            <p>{item?.chain_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentNetwork;
