"use client";
import { getProfile } from "@/public/actions";

import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import arrowDown from "@/images/procedure/arrowDown.png";
import { getChainCurrency } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import icDai from "@/public/images/procedure/icDai.png";
import icEth from "@/public/images/procedure/icEth.png";
import icNzd from "@/public/images/procedure/icNzd.png";
import icUsd from "@/public/images/procedure/icUsd.png";
import icUsdt from "@/public/images/procedure/icUsdt.png";
import search from "@/public/images/procedure/search.png";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import MainButton from "../button/MainButton";

const currencies = [
  {
    icon: icUsd,
    id: 1,
    title: "USD",
    value: "USD",
  },
  {
    icon: icNzd,
    id: 2,
    title: "NZD",
    value: "NZD",
  },
  {
    icon: icUsdt,
    id: 3,
    title: "USDT",
    value: "USDT",
  },
  {
    icon: icDai,
    id: 4,
    title: "DAI",
    value: "DAI",
  },
  {
    icon: icEth,
    id: 5,
    title: "ETH",
    value: "ETH",
  },
];
const InvoiceCurency = ({ setStepPro, step6Data, setStep6Data }: any) => {
  const [currentCurrency, setCurrentCurrency] = useState<any>();
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();

  const router = useRouter();
  const profile = useAppSelector(selectProfile);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const currencies = useAppSelector(selectCurrency);
  const fetchCurrency = useCallback(async () => {
    try {
      await dispatch(getChainCurrency({}));
    } catch (error) {
      console.error("Error fetching currency:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  // useEffect(() => {
  //   setDisable(!data);
  // }, [data]);

  // useEffect(() => {
  //   if (dataInvoice?.dataChain?.currencies[0]) {
  //     setData(dataInvoice?.dataChain?.currencies[0]);
  //   }
  // }, [dataInvoice]);

  const [filterListCurrency, setFilterListCurrency] = useState<any>();
  const [searchValue, setSearchValue] = useState("");
  const [searchList, setSearchList] = useState<any>();

  useEffect(() => {
    if (filterListCurrency) {
      setInvoiceToLocalStorage({
        ...dataInvoice,
        dataChain: filterListCurrency,
      });
    }
  }, [filterListCurrency]);

  useEffect(() => {
    setFilterListCurrency(
      currencies.find(
        (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
      ),
    );
    setSearchList(filterListCurrency?.currencies);
  }, [currencies]);

  const handleContinue = () => {
    if (currentCurrency) {
      setInvoiceToLocalStorage({
        ...dataInvoice,
        currency: currentCurrency?.currency_symbol,
      });
    } else {
      setInvoiceToLocalStorage({
        ...dataInvoice,
        currency: dataInvoice?.dataChain?.currencies[0]
          .currency_symbol as string,
      });
    }

    router.push("/home?step=10");
  };

  const backNetwork = currencies.find(
    (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
  );
  const backCurrency = backNetwork?.currencies.find(
    (item: any) => item?.currency_symbol === dataInvoice?.currency,
  );

  useEffect(() => {
    setCurrentCurrency(backCurrency);
  }, [backCurrency]);

  useEffect(() => {
    if (searchValue === "") {
      setSearchList(
        currencies.find(
          (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
        )?.currencies,
      );
    } else {
      setOpenModal(true);
      setSearchList(
        backNetwork?.currencies?.filter(
          (item: any) =>
            item?.currency_symbol.includes(searchValue.toUpperCase()),
        ),
      );
    }
  }, [searchValue, currencies]);

  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[63%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-between text-[#98999A]">
            <div className="text-[16px] font-normal leading-[24px]">
              Step 7/9
            </div>
            <button
              onClick={() => {
                if (profile) {
                  localStorage.removeItem("dataInvoice");
                  localStorage.removeItem("logoUrl");
                  localStorage.removeItem("dataChain");
                  localStorage.removeItem("dataPaid");
                  router.push("/dashboard");
                }
              }}
              className="text-[14px] font-semibold leading-[21px]"
            >
              Skip the tour
            </button>
          </div>
          <div className="mt-[172.5px] w-full">
            <div className="text-[36px] font-semibold leading-[54px]">
              Set your invoice currency (labeling)
            </div>
            <div className="mt-[24px] w-[320px]">
              <div className="relative z-[2] flex h-[56px] w-full items-center justify-between rounded-[4px] border-[1px] border-solid border-[rgba(222,222,222,1)] bg-white px-[16px]">
                {currentCurrency ? (
                  <div className="flex flex-row items-center justify-start gap-[10px]">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Image
                        className="h-full w-full object-contain"
                        loader={() => currentCurrency?.logo}
                        src={currentCurrency?.logo}
                        width={24}
                        height={24}
                        alt=""
                      />
                    </div>
                    <p className="text-sm font-normal leading-[21px] text-text-primary">
                      {currentCurrency?.currency_symbol}
                    </p>
                  </div>
                ) : (
                  <>
                    {dataInvoice?.dataChain?.currencies[0] ? (
                      <>
                        <div className="flex flex-row items-center justify-start gap-[10px]">
                          <div className="flex h-6 w-6 items-center justify-center">
                            <Image
                              className="h-6 w-6 object-contain"
                              loader={({ src }) => src}
                              src={dataInvoice?.dataChain?.currencies[0]?.logo}
                              width={24}
                              height={24}
                              alt=""
                            />
                          </div>
                          <p className="text-sm font-normal leading-[21px] text-text-primary">
                            {
                              dataInvoice?.dataChain?.currencies[0]
                                ?.currency_symbol
                            }
                          </p>
                        </div>
                      </>
                    ) : (
                      <p>--</p>
                    )}
                  </>
                )}

                <button
                  onClick={() => setOpenModal(!openModal)}
                  className="h-[24px] w-[24px]"
                >
                  <Image
                    src={arrowDown}
                    alt="icon arrow down"
                    objectFit="cover"
                  />
                </button>
                {openModal && (
                  <div className="absolute left-0 top-[103%] z-[1] w-full rounded-[4px] bg-[#fff]">
                    <div className="p-[12px]">
                      <div className="flex w-full items-center gap-x-[10px] rounded-[4px] bg-[rgba(233,233,233,1)] p-[12px]">
                        <div className="h-[24px] w-[24px]">
                          <Image
                            src={search}
                            alt="search icon"
                            objectFit="cover"
                          />
                        </div>
                        <input
                          className="w-full border-none bg-transparent text-[14px] font-normal leading-[21px] outline-none"
                          placeholder="Type a Currency"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <ul className="flex max-h-[300px] flex-col items-start justify-start overflow-y-auto">
                      {searchList?.map((item: any, index: number) => {
                        //const option = item.currencies[0];

                        return (
                          <li
                            key={index}
                            className={`flex w-full cursor-pointer  flex-row items-center justify-start gap-3 rounded-b-[4px] bg-[#fff] p-3 text-base font-normal leading-[24px] text-text-primary hover:bg-[#EAEDF5]`}
                            onClick={() => {
                              //setData(item);

                              setCurrentCurrency(item);

                              setSearchValue("");
                              setOpenModal(false);
                            }}
                          >
                            <Image
                              src={item?.logo}
                              alt="icon"
                              width={24}
                              height={24}
                              className=" h-6 w-6 object-contain"
                            />
                            {item?.currency_symbol}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-[80px] text-[18px] font-normal leading-[27px] text-[#4D4D50]">
              This is the currency that your invoice will be issued in.
            </div>
          </div>
          <div className="mt-[80px] flex w-full items-center justify-between">
            <button
              onClick={() => {
                router.push("/home?step=8");
              }}
              className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
            >
              Back
            </button>
            <MainButton
              title="Continue"
              icon={arrowRight}
              onClick={handleContinue}
              bold
            />
          </div>
        </div>
      </div>
      <div className=" flex h-full w-full justify-center border-l-[24px] border-solid border-[#DEDEDE] bg-[#fff] md:w-[47%]">
        <div className="flex h-full w-full flex-col p-[60px] md:w-[595px]">
          <div className="w-full border-b-[1px] border-dashed border-[#DEDEDE] py-[60px]">
            <div className="text-[16px] font-semibold leading-[24px]">
              Billed to
            </div>
            <div className="flex flex-col gap-y-[12px]">
              <div className="mt-[24px] text-[14px] font-normal leading-[21px]">
                {step6Data?.client.email}
              </div>
              <div className="h-[40px] w-[268px] rounded-[8px] bg-[#E9E9E9]"></div>
              <div className="h-[40px] w-[268px] rounded-[8px] bg-[#E9E9E9]"></div>
            </div>
          </div>
          <div className="flex w-full flex-col justify-start gap-6 py-[60px]">
            <div className="text-[16px] font-semibold leading-[24px]">
              Invoice Currency (labeling)
            </div>
            {/* () || */}
            <div className="flex h-[56px] w-fit items-center gap-2.5 rounded-lg border-[2px] border-[#DEDEDE] bg-[#F9F7F1] p-4">
              <div className="relative flex h-6 w-6 items-center justify-center">
                {currentCurrency?.logo === undefined ? (
                  <>
                    {dataInvoice?.dataChain?.currencies[0]?.logo ===
                    undefined ? (
                      <> </>
                    ) : (
                      <>
                        {" "}
                        <Image
                          loader={({ src }) => src}
                          src={
                            (dataInvoice?.dataChain?.currencies[0]
                              ?.logo as any) || ""
                          }
                          width={24}
                          height={24}
                          className="h-full w-full object-contain"
                          alt="icon"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {" "}
                    <Image
                      src={currentCurrency?.logo}
                      loader={() => currentCurrency?.logo}
                      fill
                      alt="icon"
                    />
                  </>
                )}
              </div>
              <span>
                {currentCurrency?.currency_symbol !== undefined
                  ? currentCurrency?.currency_symbol
                  : dataInvoice?.dataChain?.currencies[0]?.currency_symbol}
              </span>
              {/* <div className="relative h-[20px] w-[20px]">
                <Image src={arrowDown} alt="arrow down icon" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceCurency;
