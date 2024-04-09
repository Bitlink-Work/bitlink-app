import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
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

  setCurrentNetwork: (value: any) => void;
  items: any;
};

const schema = z.object({
  public_address: z.string().trim().min(1, { message: "Enter wallet address" }),
});

const ReviewPaymentNetwork = ({ invoiceInfo, setIsValidWallet }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_address: invoiceInfo?.to_wallet || "",
    },
    resolver: zodResolver(schema),
  });
  const data = localStorage?.getItem("dataChain");
  const dataChain = data && JSON.parse(data);
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const [wallet, setWallet] = useState("");
  const currencies = useAppSelector(selectCurrency);

  useEffect(() => {
    if (dataInvoice) {
      setWallet(dataInvoice?.to_wallet || "");
    }
  }, []);

  const [network, setNetwork] = useState<any>();
  //   step9Data?.dataPayment?.currencies.currency_name,
  // );
  useEffect(() => {
    if (dataInvoice?.dataNetwork) {
      setNetwork(dataInvoice?.dataNetwork);
    }
  }, []);

  const onVerifyWalletAddress = async (data: any) => {
    if (data?.public_address === "") {
      setIsValidWallet(false);
      setError("public_address", {
        type: "manual",
        message: "Please enter wallet address",
      });
    } else {
      setWallet(data?.public_address);
      if (
        String(dataInvoice?.dataChain?.chain_name).toLowerCase() === "solana"
      ) {
        const res = await invoiceServices.verifyWalletAddress({
          public_address: data?.public_address,
        });

        if (!res?.data?.is_valid) {
          setError("public_address", {
            type: "manual",
            message: "Invalid wallet address",
          });

          setIsValidWallet(false);
        } else {
          setInvoiceToLocalStorage({
            ...dataInvoice,
            to_wallet: data.public_address,
          });
          clearErrors("public_address");

          setIsValidWallet(true);
        }
      } else {
        setInvoiceToLocalStorage({
          ...dataInvoice,
          to_wallet: data.public_address,
        });
        clearErrors("public_address");

        setIsValidWallet(true);
      }
    }
  };

  useEffect(() => {
    if (String(dataInvoice?.dataChain?.chain_name).toLowerCase() === "solana") {
      if (wallet) {
        onVerifyWalletAddress({ public_address: wallet });
      }
    } else {
      clearErrors("public_address");
    }
  }, [wallet]);
  useEffect(() => {
    if (watch("public_address") === "") {
      setIsValidWallet(false);
    }
  }, [watch("public_address")]);

  useEffect(() => {
    setNetwork(dataInvoice?.dataNetwork);
  }, [dataInvoice]);

  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <h5 className="flex flex-row items-center gap-[6px] text-sm font-medium leading-[150%] text-text-primary">
        Your payment network ⭐
      </h5>

      <div className="flex flex-row items-center justify-start gap-3">
        {currencies.map((item: any, index: any) => (
          <button
            onClick={() => {
              // setFormValues((prev: any) => ({
              //   ...prev,
              //   chain: item?.chain_name,
              // }));
              setNetwork(item);

              setInvoiceToLocalStorage({
                ...dataInvoice,
                dataNetwork: item,
                currency: "",
              });
            }}
            key={index}
            className={`flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium leading-[150%] text-text-primary ${
              network?.chain_name === item?.chain_name
                ? "border-primary bg-[#EAEDF5]"
                : "border-[#DEDEDE] bg-[#fff]"
            }`}
          >
            <div className="flex h-6 w-6 items-center justify-center">
              <Image
                className="h-full w-full object-contain"
                src={item?.currencies[0]?.logo || ""}
                width={24}
                height={24}
                alt=""
              />
            </div>
            <p className="capitalize">{item?.chain_name.toLowerCase()}</p>
          </button>
        ))}
      </div>
      <h5 className="flex flex-row items-center gap-[6px] text-sm font-medium leading-[150%] text-text-primary">
        Where do you want to receive your payment? ⭐
      </h5>
      <form
        onSubmit={handleSubmit(onVerifyWalletAddress)}
        className="relative h-fit w-[320px] rounded border border-[#DEDEDE] bg-[#fff] p-4"
      >
        <input
          {...register("public_address", {
            required: "This field is required",
          })}
          className="h-6 w-full text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary focus:outline-none active:outline-none"
          type="text"
          placeholder="Wallet address"
          onChange={(e) => {
            setValue("public_address", e.target.value);
            setWallet(e.target.value);
          }}
          value={wallet}
          onBlur={handleSubmit(onVerifyWalletAddress)}
          autoFocus={false}
        />
        <input type="submit" hidden />
        {errors.public_address && (
          <p className="absolute left-0 top-[calc(100%+4px)] text-xs text-red-500">
            {errors.public_address.message
              ? errors.public_address.message.toString()
              : ""}
          </p>
        )}
      </form>
    </div>
  );
};

export default ReviewPaymentNetwork;
