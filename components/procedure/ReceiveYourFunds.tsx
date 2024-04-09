"use client";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import arrowDown from "@/images/procedure/arrowDown.png";
import { getChainCurrency, updateProfile } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import { selectProfile } from "@/public/reducers/profileSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  public_address: z
    .string()
    .trim()
    .min(1, { message: "Please enter wallet address" }),
});
type TypeFormFiled = {
  public_address: string;
};

const ReceiveYourFunds = ({ setStepPro, step7Data, setStep7Data }: any) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
    clearErrors,
  } = useForm<TypeFormFiled>({
    values: {
      public_address: dataInvoice.to_wallet,
    },
    resolver: zodResolver(schema),
  });
  const [current, setCurrent] = useState<any>();
  const [network, setNetwork] = useState<any>(
    dataInvoice?.dataNetwork?.chain_id,
  );

  const [dataPayment, setDataPayment] = useState<any>();
  const [dataCurrency, setDataCurrency] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [wallet, setWallet] = useState<any>();
  const [isValidWallet, setIsValidWallet] = useState(false);
  const [refundWallet, setRefundWallet] = useState<any>();
  const [disable, setDisable] = useState(true);
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  const [networks, setNetworks] = useState<any>([]);

  useEffect(() => {
    const getNetworks = async () => {
      const { payload }: any = await dispatch(getChainCurrency({}));

      setNetworks(payload);
    };
    getNetworks();
  }, []);

  const router = useRouter();

  useEffect(() => {
    var newdata = { ...step7Data, dataCurrency };
    newdata = { ...newdata, dataPayment };
    newdata = { ...newdata, wallet };
    newdata = { ...newdata, refundWallet };
    if (wallet !== "") {
      setDisable(false);
    }

    setStep7Data(newdata);
  }, [step7Data, current, network, wallet, refundWallet]);

  const onVerifyWalletAddress = async (data: TypeFormFiled) => {
    if (data?.public_address === "") {
      setDisable(true);
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
          setDisable(true);
          setIsValidWallet(false);
        } else {
          setInvoiceToLocalStorage({
            ...dataInvoice,
            to_wallet: data.public_address,
          });
          clearErrors("public_address");
          setDisable(false);
          setIsValidWallet(true);
        }
      } else {
        setInvoiceToLocalStorage({
          ...dataInvoice,
          to_wallet: data.public_address,
        });
        clearErrors("public_address");
        setDisable(false);
        setIsValidWallet(true);
      }
    }
  };

  useEffect(() => {
    if (dataInvoice && dataInvoice?.to_wallet !== "") {
      if (watch("public_address") === "") {
        setDisable(true);
      } else {
        setDisable(false);
      }
    } else {
      if (
        dataPayment &&
        dataCurrency &&
        dataPayment &&
        wallet !== "" &&
        isValidWallet
      ) {
        setDisable(false);
      } else {
        if (!isValidWallet || watch("public_address") === "") {
          setDisable(true);
        }
      }
    }
  }, [
    dataCurrency,
    dataPayment,
    isValidWallet,
    wallet,
    watch("public_address"),
    dataInvoice,
  ]);

  const handleUpdateProfile = async () => {
    try {
      const res = await dispatch(
        updateProfile({
          ...profile,
          public_address: wallet,
        }),
      );
      if (res) {
        router.push("/home?step=9");
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    if (dataInvoice?.dataNetwork?.chain_id === undefined) {
      setNetwork(networks[0]?.chain_id);
      setDataPayment(networks[0]);

      setInvoiceToLocalStorage({
        ...dataInvoice,
        dataNetwork: networks[0],
      });
    } else {
      setNetwork(dataInvoice?.dataNetwork?.chain_id);
      setDataPayment(dataInvoice?.dataNetwork);
    }
  }, [network, dataInvoice, networks]);

  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[63%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-between text-[#98999A]">
            <div className="text-[16px] font-normal leading-[24px]">
              Step 6/9
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("dataInvoice");
                localStorage.removeItem("logoUrl");
                localStorage.removeItem("dataChain");
                localStorage.removeItem("dataPaid");
                router.push("/dashboard");
              }}
              className="text-[14px] font-semibold leading-[21px]"
            >
              Skip the tour
            </button>
          </div>
          <div className="mt-[51px] w-full">
            <div className="text-[36px] font-semibold leading-[54px]">
              Select how you want to receive your funds.
            </div>
            <div className="mt-[60px]">
              <div className="text-[14px] font-medium leading-[21px] text-text-primary">
                Choose your payment network ⭐
              </div>
              <div className="mt-[16px] flex items-center gap-x-[12px]">
                {networks?.map((item: any, index: number) => {
                  return (
                    <button
                      onClick={() => {
                        setNetwork(item.chain_id);
                        setDataPayment(item);
                        setInvoiceToLocalStorage({
                          ...dataInvoice,
                          dataNetwork: item,
                        });
                      }}
                      key={index}
                      className={`flex items-center gap-2 rounded-[6px] border px-3 py-2 ${
                        network && network == item.chain_id
                          ? "border-primary bg-[#EAEDF5]"
                          : "border-[#DEDEDE]"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center">
                        <Image
                          src={item.currencies[0].logo}
                          alt="icon"
                          width={24}
                          height={24}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="text-[12px] font-medium capitalize leading-[18px] text-text-primary">
                        {item.chain_name.toLowerCase()}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-[24px] text-[14px] font-medium leading-[21px] text-text-primary">
                Where do you want to receive your payment? ⭐
              </div>
            </div>
            <div className="mt-[16px]">
              <form
                onSubmit={handleSubmit(onVerifyWalletAddress)}
                className={`relative h-fit w-[320px] rounded border ${
                  Object.keys(errors).length === 0
                    ? "border-[#DEDEDE]"
                    : "border-[#EF4444]"
                }  bg-[#fff] p-4`}
              >
                <input
                  {...register("public_address", {
                    required: "This field is required",
                  })}
                  className="h-6 w-full text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary focus:outline-none active:outline-none"
                  type="text"
                  placeholder="Find or add new wallet"
                  onChange={(e) => setValue("public_address", e.target.value)}
                  onBlur={handleSubmit(onVerifyWalletAddress)}
                  defaultValue={wallet}
                />
                <input type="submit" hidden />
                {errors?.public_address && (
                  <p className="absolute left-0 top-[calc(100%+4px)] text-xs text-red-500">
                    {errors?.public_address?.message
                      ? errors?.public_address?.message.toString()
                      : ""}
                  </p>
                )}
              </form>
            </div>
            <div className="mt-[40px] text-[18px] font-normal leading-[27px] text-[#4D4D50]">
              Use Request Finance effortlessly with various networks and
              currencies. Create a unique wallet name and address in this step.
            </div>
          </div>
          <div className="mt-[60px] flex w-full items-center justify-between">
            <button
              onClick={() => router.push("/home?step=7")}
              className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
            >
              Back
            </button>
            <button
              onClick={handleUpdateProfile}
              className={`flex h-[48px] w-[148px] items-center justify-center gap-x-[10px] rounded-[8px] bg-primary text-[14px] font-semibold leading-[21px] text-white hover:bg-btn-hover 
              disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                `}
              disabled={disable}
            >
              Continue
              <div className="h-[24px] w-[24px]">
                <Image
                  src={arrowRight}
                  alt="arrow right icon"
                  objectFit="cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className=" flex h-full w-full justify-center border-l-[24px] border-solid border-[#DEDEDE] bg-[#fff] md:w-[47%]">
        <div className="flex h-full w-full flex-col p-[60px] md:w-[595px]">
          <div className="flex flex-col gap-6 py-[48px]">
            <div className="text-[14px] font-medium leading-[21px]">
              Choose your payment network ⭐
            </div>
            {network && (
              <div className="flex h-fit w-fit items-center gap-2 rounded-md border border-[#2B4896] bg-[#EAEDF5] px-3 py-2 text-[16px] font-medium capitalize leading-[24px]">
                <div className="flex h-6 w-6 items-center justify-center">
                  <Image
                    src={dataPayment?.currencies[0]?.logo}
                    alt="icon"
                    width={24}
                    height={24}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="capitalize">
                  {dataPayment?.chain_name.toLowerCase()}
                </p>
              </div>
            )}
          </div>
          <div className="py-[48px]">
            <div className="text-[14px] font-semibold leading-[21px]">
              Choose your currency ⭐
            </div>
            <div className="mt-[40px] h-[68px] w-full rounded-[12px] bg-[#E9E9E9]"></div>
          </div>
          <div className="py-[48px]">
            <div className="text-[14px] font-medium leading-[21px]">
              Where do you want to receive your payment? ⭐
            </div>
            <div className="mt-[40px] h-[68px] w-full rounded-[12px] bg-[#E9E9E9]"></div>
          </div>
        </div>
      </div>
      {/* {openModal && (
        <ModalReceive
          setRefundWallet={setRefundWallet}
          setOpenModal={setOpenModal}
        />
      )} */}
    </div>
  );
};
export default ReceiveYourFunds;
