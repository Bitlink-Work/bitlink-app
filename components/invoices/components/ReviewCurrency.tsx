" use client";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import Image from "next/image";
import { useEffect, useState } from "react";

const ReviewCurrency = ({ step9Data }: any) => {
  const currencies = useAppSelector(selectCurrency);

  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();

  const [currentCurrency, setCurrentCurrency] = useState<any>();
  const [isSidePopupVisible, setIsSidePopupVisible] = useState(false);
  const toggleSidePopup = () => {
    setIsSidePopupVisible(!isSidePopupVisible);
  };

  const [filterListCurrency, setFilterListCurrency] = useState<any>();

  const [searchValue, setSearchValue] = useState("");
  const [searchList, setSearchList] = useState<any>();

  useEffect(() => {
    setFilterListCurrency(
      currencies?.find(
        (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
      ),
    );
    setSearchList(filterListCurrency?.currencies);
  }, [currencies, dataInvoice]);

  useEffect(() => {
    if (filterListCurrency) {
      setInvoiceToLocalStorage({
        ...dataInvoice,
        dataChain: filterListCurrency,
      });
    }
  }, [filterListCurrency]);

  const backNetwork = currencies.find(
    (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
  );
  const backCurrency = backNetwork?.currencies.find(
    (item: any) => item?.currency_symbol === dataInvoice?.currency,
  );

  useEffect(() => {
    if (dataInvoice?.dataNetwork) {
      const backNetwork = currencies.find(
        (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
      );
      if (backNetwork) {
        const defaultCurrency =
          backCurrency?.currency_symbol ||
          backNetwork?.currencies[0]?.currency_symbol;
        setCurrentCurrency(defaultCurrency);
        setInvoiceToLocalStorage({
          ...dataInvoice,
          currency: defaultCurrency,
        });
      }
    }
  }, [dataInvoice?.dataNetwork]);

  useEffect(() => {
    if (searchValue === "") {
      setSearchList(
        currencies.find(
          (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
        )?.currencies,
      );
    } else {
      setSearchList(
        backNetwork?.currencies?.filter(
          (item: any) =>
            item?.currency_symbol.includes(searchValue.toUpperCase()),
        ),
      );
    }
  }, [searchValue, currencies]);

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
              src={
                currentCurrency?.logo ||
                backCurrency?.logo ||
                backNetwork?.currencies[0]?.logo
              }
              width={24}
              height={24}
              alt=""
            />
          </div>
          <p className="text-sm font-normal leading-[21px] text-text-primary">
            {currentCurrency?.currency_symbol ||
              backCurrency?.currency_symbol ||
              backNetwork?.currencies[0]?.currency_symbol}
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
            <ul className="flex max-h-[300px] flex-col items-start justify-start overflow-y-auto">
              {searchList?.map(
                (item: any, index: any) => (
                  <li
                    onClick={() => {
                      setCurrentCurrency(item);
                      // setInvoiceToLocalStorage({
                      //   ...dataInvoice,
                      //   dataChain: item,
                      //   dataNetwork: item,
                      // });

                      setInvoiceToLocalStorage({
                        ...dataInvoice,
                        currency: item?.currency_symbol,
                      });

                      setSearchValue("");
                      toggleSidePopup();
                    }}
                    key={index}
                    className={`flex w-full cursor-pointer flex-row items-center justify-start gap-2 rounded-b-[4px] bg-[#fff] p-3 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#EAEDF5]`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Image
                        className="h-full w-full object-contain"
                        loader={({ src }) => src}
                        src={item?.logo || backNetwork?.currencies[0]?.logo}
                        width={24}
                        height={24}
                        alt=""
                      />
                    </div>
                    <p>
                      {item?.currency_symbol ||
                        backNetwork?.currencies[0]?.currency_symbol}
                    </p>
                  </li>
                ),
                // ),
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCurrency;
