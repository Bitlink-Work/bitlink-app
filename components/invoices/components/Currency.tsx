" use client";
import { invoiceServices } from "@/public/api/invoiceServices";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  edit?: boolean;
  invoiceInfo: any;
  currency: any;
  currencies: any;
  currentNetwork: any;
  setCurrency: (currency: any) => void;
  setCurrentNetwork: (network: any) => void;
  setStep: (value: number) => void;
  receiver?: any;
  setFormValues: (value: any) => void;
  wallet: any;
  setWallet: (value: any) => void;
  formValues: any;
};

const schema = z.object({
  public_address: z.string().trim().min(1, { message: "Enter wallet address" }),
});
const Currency = ({
  edit,
  currency,
  currencies,
  currentNetwork,
  setCurrency,
  setCurrentNetwork,
  setStep,
  receiver,
  setFormValues,
  invoiceInfo,
  wallet,
  setWallet,
  formValues,
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

  const [currentCurrency, setCurrentCurrency] = useState<any>();
  const [isSidePopupVisible, setIsSidePopupVisible] = useState(false);
  const toggleSidePopup = () => {
    setIsSidePopupVisible(!isSidePopupVisible);
  };
  useEffect(() => {
    if (edit) {
      if (currentNetwork?.currencies) {
        setCurrentCurrency(
          currentNetwork?.currencies.find(
            (item: any) => item?.currency_symbol === currency,
          ),
        );
      }
    } else {
      if (currentNetwork?.currencies) {
        setCurrentCurrency(currentNetwork?.currencies[0]);
      }
    }
  }, [currentNetwork, edit]);

  const [filterListCurrency, setFilterListCurrency] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue === "") {
      setFilterListCurrency(currentNetwork?.currencies || []);
    } else {
      setIsSidePopupVisible(true);
      setFilterListCurrency(
        currentNetwork?.currencies?.filter(
          (item: any) =>
            item?.currency_symbol
              .toLowerCase()
              .includes(searchValue.toLowerCase()),
        ),
      );
    }
  }, [searchValue, currentNetwork]);

  const onVerifyWalletAddress = async (data: any) => {
    setWallet(data?.public_address);
    if (String(formValues?.chain).toLowerCase() === "solana") {
      const res = await invoiceServices.verifyWalletAddress({
        public_address: data?.public_address,
      });

      if (!res?.data?.is_valid) {
        setError("public_address", {
          type: "manual",
          message: "Invalid wallet address",
        });
      } else {
        clearErrors("public_address");
      }
    }
  };

  useEffect(() => {
    setValue("public_address", wallet);
    if (String(formValues?.chain).toLowerCase() === "solana") {
      if (wallet) {
        onVerifyWalletAddress({ public_address: wallet });
      }
    } else {
      clearErrors("public_address");
    }
  }, [wallet, formValues]);

  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <h5 className="flex flex-row items-center gap-[6px] text-sm font-semibold leading-[150%] text-text-primary">
        Invoice Currency
      </h5>
      <div className="group relative flex h-fit w-[320px] flex-row items-center justify-between rounded border border-[#DEDEDE] bg-[#fff] p-4">
        <div className="flex flex-row items-center justify-start gap-[10px]">
          <div className="flex h-6 w-6 items-center justify-center">
            <Image
              className="h-full w-full object-contain"
              loader={({ src }) => src}
              src={currentCurrency?.logo || ""}
              width={24}
              height={24}
              alt=""
            />
          </div>
          <p className="text-sm font-normal leading-[21px] text-text-primary">
            {currentCurrency?.currency_symbol}
          </p>
        </div>
        <button
          onClick={() => toggleSidePopup()}
          className="flex h-6 w-6 cursor-pointer items-center justify-center"
        >
          <Image
            src="/images/received-invoices/arrow-down.svg"
            width={14.001}
            height={7}
            alt=""
          />
        </button>

        {isSidePopupVisible && (
          <div className="absolute inset-0 top-[100%] z-10 h-fit w-full rounded-b-[4px] border-[0.6px] border-[#EBEFF6] bg-[#fff] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
            <div className="w-full p-3">
              <div className="mb-3 flex w-full flex-row items-center gap-[10px] rounded  bg-[#e9e9e9] p-3">
                <Image
                  src="/images/invoices/search.svg"
                  width={24}
                  height={24}
                  alt=""
                />
                <input
                  className="flex-1 bg-transparent text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-[#98999A] hover:outline-none focus:outline-none active:outline-none"
                  type="text"
                  placeholder="Type a Currency"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            {filterListCurrency?.length === 0 && searchValue !== "" ? (
              <p className="p-3 text-sm font-normal leading-[150%] text-text-secondary">
                No results
              </p>
            ) : (
              <ul className="flex max-h-[300px] flex-col items-start justify-start overflow-y-auto">
                {filterListCurrency?.map(
                  (item: any, index: any) => (
                    <li
                      onClick={() => {
                        setCurrency(item?.currency_symbol);
                        setCurrentCurrency(item);
                        setFormValues((prev: any) => {
                          return {
                            ...prev,
                            currency: item?.currency_symbol,
                            chain: currentNetwork?.chain_name,
                          };
                        });
                        setSearchValue("");
                        toggleSidePopup();
                      }}
                      key={index}
                      className={`flex w-full cursor-pointer flex-row items-center justify-start gap-2 rounded-b-[4px] bg-[#fff] p-3 hover:bg-[#EAEDF5]`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center">
                        <Image
                          className="h-full w-full object-contain"
                          loader={({ src }) => src}
                          src={item?.logo || ""}
                          width={24}
                          height={24}
                          alt=""
                        />
                      </div>
                      <p className="text-base font-normal leading-6 text-text-primary">
                        {item?.currency_symbol}
                      </p>
                    </li>
                  ),
                  // ),
                )}
              </ul>
            )}
          </div>
        )}
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
          onBlur={(e) => {
            e.preventDefault();
            handleSubmit(onVerifyWalletAddress);
          }}
          autoFocus={false}
        />
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

export default Currency;
