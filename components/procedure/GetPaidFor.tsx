"use client";
import { getChainCurrency, getProfile } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Amount from "@/components/invoices/components/Amount";
import Popup from "@/components/popup/Popup";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import TrashIcon from "@/images/received-invoices/trash.svg";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import check from "@/public/images/procedure/check.png";
import { useRouter } from "next/navigation";

const GetPaidFor = ({ setStepPro, step8Data, setStep8Data }: any) => {
  const { dataInvoice } = useInvoiceContext();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    description: "",
    quantity: 0.0,
    unit_price: 0.0,
    tax: 0.0,
    amount: "",
  });

  const [items, setItems] = useState<any[]>([{ id: 1 }]);
  const [disable, setDisable] = useState(true);
  const [inputErrors, setInputErrors] = useState<any[]>([]);
  const [inputErrorQuantity, setInputErrorQuanity] = useState<any[]>([]);
  const [inputErrorUnitPrice, setInputErrorUnitPrice] = useState<any[]>([]);
  const [inputErrorTax, setInputErrorTax] = useState<any[]>([]);

  const [inputValid, setInputValid] = useState<any[]>([]);

  const [checked, setChecked] = useState(false);
  const [showPopupAmount, setShowPopupAmount] = useState(false);
  const [dataChain, setDataChain] = useState<any>();
  const [totalAmountData, setTotalAmountData] = useState<any>();
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    let isValid = true;
    items.forEach((item: any, index: number) => {
      if (
        item.description === "" ||
        item.quantity === "" ||
        item.unit_price === "" ||
        item.tax === "" ||
        isNaN(parseInt(item.quantity)) ||
        parseFloat(item.quantity) <= 0 ||
        isNaN(parseFloat(item.unit_price)) ||
        parseFloat(item.unit_price) < 0 ||
        isNaN(parseFloat(item.tax)) ||
        parseFloat(item.tax) < 0 ||
        item.description.length > 50
      ) {
        isValid = false;
      }
    });

    setDisable(!isValid);
  }, [items]);

  // useEffect(() => {
  //   console.log(">>>>items", items);
  //   const allItemsFilled = items.every(
  //     (item) =>
  //       item.description &&
  //       (item.quantity || item?.quantity === undefined) &&
  //       (item.unit_price || item?.unit_price === undefined) &&
  //       (item.tax || item?.tax === undefined),
  //   );

  //   console.log(" >>>>bbb", allItemsFilled);

  //   setDisable(!allItemsFilled);
  // }, [items]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleLeftInputChange = (e: any, index: number) => {
    const { name, value } = e.target;
    let newValue = value;
    let newInputErrors = [...inputErrors];
    let newInputQuantityErrors = [...inputErrors];
    let newInputUnitPriceErrors = [...inputErrors];
    let newInputTaxErrors = [...inputErrors];
    let newInputValids = [...inputValid];

    if (name === "description") {
      if (value === "") {
        newInputErrors[index] = true;
      } else {
        newInputErrors[index] = false;
      }
      if (value.length > 50) {
        newInputValids[index] = true;
      } else {
        newInputValids[index] = false;
      }
    }

    setInputErrors(newInputErrors);
    setInputValid(newInputValids);

    if (name === "quantity" || name === "unit_price" || name === "tax") {
      const numericValue = parseFloat(value);
      if (numericValue < 0) {
        newValue = "";
      }
      if (name === "quantity") {
        if (value === "") {
          newInputQuantityErrors[index] = true;
        } else {
          newInputQuantityErrors[index] = false;
        }
      }
      if (name === "unit_price") {
        if (value === "") {
          newInputUnitPriceErrors[index] = true;
        } else {
          newInputUnitPriceErrors[index] = false;
        }
      }
      if (name === "tax") {
        if (value === "") {
          newInputTaxErrors[index] = true;
        } else {
          newInputTaxErrors[index] = false;
        }
      }

      setInputErrorQuanity(newInputQuantityErrors);
      setInputErrorTax(newInputTaxErrors);
      setInputErrorUnitPrice(newInputUnitPriceErrors);
    }

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], [name]: newValue };

      if (updatedItems[index]?.quantity === undefined) {
        updatedItems[index] = { ...updatedItems[index], ["quantity"]: 1 };
      }
      if (updatedItems[index]?.tax === undefined) {
        updatedItems[index] = { ...updatedItems[index], ["tax"]: 0 };
      }
      if (updatedItems[index]?.unit_price === undefined) {
        updatedItems[index] = { ...updatedItems[index], ["unit_price"]: 0 };
      }

      const quantity = Number.isNaN(parseFloat(updatedItems[index].quantity))
        ? 1
        : parseFloat(updatedItems[index].quantity);

      const unit_price = Number.isNaN(
        parseFloat(updatedItems[index].unit_price),
      )
        ? 0
        : parseFloat(updatedItems[index].unit_price);
      const tax = Number.isNaN(parseFloat(updatedItems[index].tax))
        ? 0
        : parseFloat(updatedItems[index].tax);

      // if (quantity && unit_price) {
      //   setDisable(false);
      // }

      let amount =
        Number(quantity * unit_price) +
        Number(quantity * unit_price * tax) / 100;

      updatedItems[index].amount = ` ${isNaN(amount) ? 0 : amount}`;

      return updatedItems;
    });
  };

  const addNewItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: Math.random() + 1,
        description: "",
        quantity: 1,
        unit_price: 0,
        tax: 0,
      },
    ]);
  };

  useEffect(() => {
    if (items?.length === 0) {
      addNewItem();
      setInputErrors([]);
      setInputErrorQuanity([]);
      setInputErrorUnitPrice([]);
      setInputErrorTax([]);
      setInputValid([]);
    }
  }, [items]);

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    var newdata = { ...step8Data, items };
    newdata = { ...newdata, totalAmountData };
    if (items) {
      localStorage.setItem("dataPaid", JSON.stringify(items));
    }
    if (typeof window !== "undefined") {
      const data = localStorage?.getItem("dataChain");
      setDataChain(data && JSON.parse(data));
    }
    setStep8Data(newdata);
  }, [step8Data, items, totalAmountData]);
  const [filterListCurrency, setFilterListCurrency] = useState<any>();

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

  useEffect(() => {
    setFilterListCurrency(
      currencies.find(
        (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
      ),
    );
  }, [currencies]);

  const backNetwork = currencies.find(
    (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
  );
  const backCurrency = backNetwork?.currencies.find(
    (item: any) => item?.currency_symbol === dataInvoice?.currency,
  );

  return (
    <>
      <div className="flex w-full justify-between md:h-[100vh] md:min-h-[900px]">
        <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[63%]">
          <div className="w-full p-[60px] md:max-w-[821px]">
            <div className="flex w-full items-center justify-between text-[#98999A]">
              <div className="text-[16px] font-normal leading-[24px]">
                Step 8/9
              </div>
              <div
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
              </div>
            </div>
            <form>
              <div className="mt-[60.5px] w-full">
                <div className="text-[36px] font-semibold leading-[54px] text-[#202124]">
                  List all items to get paid for
                </div>
              </div>
              <div className="mt-[48px] w-full">
                <div className=" flex w-full items-center  border-b-[1.5px] border-solid border-b-[#BABABB] text-text-primary">
                  <div className="w-[140.2px]  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Description
                    </div>
                  </div>
                  <div className="w-[140.2px]  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Quantity
                    </div>
                  </div>
                  <div className="w-[140.2px]  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Unit Price
                    </div>
                  </div>
                  <div className="w-[140.2px]  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Tax
                    </div>
                  </div>
                  <div className="w-[140.2px]  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Amount
                    </div>
                  </div>
                </div>

                {items && items.length > 0 ? (
                  <>
                    {items.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className=" flex w-full items-center justify-between gap-3 border-b border-solid border-b-[#E9E9E9] py-[24px] "
                        >
                          <Image
                            src={TrashIcon}
                            alt=""
                            className="-ml-10 cursor-pointer"
                            onClick={() => removeItem(item.id)}
                          />
                          <div className="relative w-full">
                            <input
                              type="text"
                              onChange={(e) => handleLeftInputChange(e, index)}
                              name="description"
                              maxLength={50}
                              value={item.description || ""}
                              className=" h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none  "
                            />
                            {inputErrors[index] && (
                              <div className="absolute top-[calc(100%+4px)] text-sm text-red-500">
                                Required
                              </div>
                            )}
                            {inputValid[index] && (
                              <div className="absolute top-[calc(100%+4px)] text-[11px] text-red-500">
                                Exceed 50 characters!
                              </div>
                            )}
                          </div>

                          <div className="relative w-full">
                            <input
                              name="quantity"
                              type="number"
                              onKeyPress={handleKeyPress}
                              onKeyDown={(e: any) => {
                                if (e.key === "." || e.key === ",") {
                                  e.preventDefault();
                                }

                                if (
                                  e.target.value.length >= 12 &&
                                  e.key !== "Backspace" &&
                                  e.key !== "Delete" &&
                                  e.key !== "ArrowLeft" &&
                                  e.key !== "ArrowRight"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                handleLeftInputChange(e, index);
                              }}
                              defaultValue={item.quantity || 1}
                              className="h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none "
                            />
                            {inputErrorQuantity[index] && (
                              <div className="absolute top-[calc(100%+4px)] text-sm text-red-500">
                                Required
                              </div>
                            )}
                          </div>
                          <div className="relative w-full">
                            <input
                              name="unit_price"
                              type="number"
                              min="0"
                              onKeyPress={handleKeyPress}
                              onInput={(e: any) => {
                                if (e.target.value.length > 12) {
                                  e.target.value = e.target.value.slice(0, 12);
                                }
                                handleLeftInputChange(e, index);
                              }}
                              defaultValue={item.unit_price || 0}
                              className="relative h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] pl-16 text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none "
                            />
                            <span className="absolute left-4 top-1/2 flex -translate-y-1/2">
                              {backCurrency?.currency_symbol}
                            </span>
                            {inputErrorUnitPrice[index] && (
                              <div className="absolute  top-[calc(100%+4px)] text-sm text-red-500">
                                Required
                              </div>
                            )}
                          </div>

                          <div className="relative w-full">
                            <input
                              name="tax"
                              type="number"
                              min="0"
                              onKeyPress={handleKeyPress}
                              onInput={(e: any) => {
                                if (e.target.value.length > 12) {
                                  e.target.value = e.target.value.slice(0, 12);
                                }
                                handleLeftInputChange(e, index);
                              }}
                              defaultValue={item.tax || 0}
                              className="relative h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] pr-8 text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2">
                              %
                            </span>

                            {inputErrorTax[index] && (
                              <div className="absolute top-[calc(100%+4px)] text-sm text-red-500">
                                Required
                              </div>
                            )}
                          </div>
                          <div className={`relative  w-full  `}>
                            <div className="flex items-center justify-center">
                              <span className="ml-8">
                                {backCurrency?.currency_symbol}
                              </span>
                              <input
                                name="amount"
                                readOnly
                                value={
                                  Math.round(item.amount * 1000000) / 1000000 ||
                                  0
                                }
                                className="flex h-[56px] w-full flex-nowrap  rounded-[4px] border-0 border-solid border-[#DEDEDE] p-[16px] px-1 text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </form>

            <div className="mt-[24px]">
              <button
                onClick={addNewItem}
                className="text-[14px] font-medium leading-[21px] text-text-primary"
              >
                + Add an item
              </button>
            </div>

            <div className=" w-full">
              <div className="py-[48px]">
                <div className="flex w-full justify-start gap-4">
                  <div className="h-6 w-6 rounded-[4px] bg-[#98999A]">
                    <button
                      onClick={handleCheck}
                      className="h-[24px] w-[24px] p-1"
                    >
                      {checked && (
                        <Image src={check} alt="check icon" objectFit="cover" />
                      )}
                    </button>
                  </div>
                  <div className="text-[16px] font-normal leading-6 text-[#98999A]">
                    Gas fee paid by purchaser
                  </div>
                </div>
              </div>
              <div className="text-[18px] font-normal leading-[27px] text-[#4D4D50]">
                Choose the items and services you want to get paid for. You can
                set taxes or discounts for each item before sending the invoice.
                It&apos;s optional.
              </div>
              <div className="mt-[48px] flex w-full  items-center justify-between">
                <button
                  onClick={() => router.push("/home?step=9")}
                  className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setShowPopupAmount(true);
                  }}
                  className={`flex h-[48px] w-[148px] items-center justify-center gap-x-[10px] rounded-[8px] bg-primary text-[14px] font-semibold leading-[21px] text-white hover:bg-btn-hover ${
                    disable ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={items.length === 0 || disable}
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
        </div>
        <div className="flex h-full w-full justify-center border-l-[24px] border-solid border-[#DEDEDE] bg-[#fff] md:w-[47%]">
          <div className="flex w-full flex-col ">
            <div className="flex w-full flex-col border-b border-dashed border-[#DEDEDE] pb-[24px] ">
              <div className="flex w-full flex-col px-[60px] pt-[24px] md:w-[595px]">
                <div className="text-[14px] font-medium leading-[21px] text-text-primary ">
                  Your payment network ⭐
                </div>
                <div
                  className={`mt-[24px] flex h-fit w-fit items-center justify-center gap-2 rounded-[6px] border-[1px] border-solid border-primary bg-[#EAEDF5] px-[12px] py-[8px]`}
                >
                  <div className="flex h-full w-fit  items-center gap-2 text-[12px] font-medium leading-[18px]">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Image
                        src={
                          dataInvoice?.dataChain?.currencies[0] &&
                          (dataInvoice?.dataChain?.currencies[0]?.logo as any)
                        }
                        alt="icon"
                        width={24}
                        height={24}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-medium leading-[18px] text-text-primary">
                      {dataInvoice?.dataChain &&
                        dataInvoice?.dataChain?.currencies[0]?.currency_name}
                    </p>
                  </div>
                </div>
                <div className="mt-[48px] text-[14px] font-medium leading-[21px] text-text-primary ">
                  Your currency ⭐
                </div>
                <div
                  className={`mt-[24px] h-fit w-fit rounded-[6px] border-[1px] border-solid border-primary bg-[#EAEDF5] px-[12px] py-[8px]`}
                >
                  <div className="flex h-full w-fit  items-center gap-2 text-[12px] font-medium leading-[18px]">
                    <div className="flex h-[24px] w-[24px] items-center justify-center">
                      <Image
                        src={
                          backCurrency?.logo ||
                          (dataInvoice?.dataChain &&
                            (dataInvoice?.dataChain?.currencies[0]
                              ?.logo as any))
                        }
                        alt="icon"
                        width={24}
                        height={24}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-medium leading-[18px] text-text-primary">
                      {backCurrency?.currency_symbol ||
                        (dataInvoice?.dataChain &&
                          dataInvoice?.dataChain?.currencies[0]
                            ?.currency_symbol)}
                    </p>
                  </div>
                </div>
                <div className={`mt-[48px] `}>
                  <div className="text-[14px] font-medium leading-[21px] text-text-primary">
                    Where do you want to receive your payment? ⭐
                  </div>
                  <div className="mt-[24px] text-[14px] font-normal leading-[21px] text-[#4D4D50]">
                    {dataInvoice?.to_wallet}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col border-b border-dashed border-[#DEDEDE] pb-[24px] ">
              <div className="flex w-full flex-col pl-[60px] pt-[24px] md:w-[595px]">
                <div className="my-1 flex w-full items-center  border-b-[1.5px] border-solid border-b-[#BABABB] text-text-primary">
                  <div className=" w-1/5 ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Description
                    </div>
                  </div>
                  <div className="w-1/5  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Quantity
                    </div>
                  </div>
                  <div className="w-1/5  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Unit Price
                    </div>
                  </div>
                  <div className="w-1/5  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Tax
                    </div>
                  </div>
                  <div className="w-1/5  ">
                    <div className="px-[8px] py-[16px] text-center text-[14px] font-medium leading-[21px]">
                      Amount
                    </div>
                  </div>
                </div>
                {items.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className=" flex w-full items-center justify-between  border-b border-solid border-b-[#E9E9E9]  "
                    >
                      <div className="flex h-[56px] w-1/5 items-center justify-center rounded-[4px]">
                        <div className="w-full overflow-hidden overflow-ellipsis px-[2px]  text-center text-sm font-normal leading-[21px] text-text-secondary ">
                          {item.description}
                        </div>
                      </div>

                      <div className=" flex h-[56px] w-1/5 rounded-[4px]  ">
                        <div className="flex w-full items-center  justify-center overflow-hidden overflow-ellipsis px-[2px] text-center text-[13px] font-normal leading-[21px] text-text-secondary">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex  h-[56px] w-1/5 items-center justify-center  overflow-hidden  overflow-ellipsis rounded-[4px]  ">
                        <div className="  px-[2px] text-[13px] font-normal leading-[21px] text-text-secondary">
                          {backCurrency?.currency_symbol}
                        </div>
                        <div className="  overflow-hidden overflow-ellipsis px-[2px] text-[13px] font-normal leading-[21px] text-text-secondary">
                          {item.unit_price}
                        </div>
                      </div>
                      <div className="flex h-[56px] w-1/5 items-center justify-center rounded-[4px]  ">
                        <div className="   items-center  overflow-hidden  overflow-ellipsis  px-[2px] text-[13px] font-normal leading-[21px] text-text-secondary">
                          {item.tax} %
                        </div>
                      </div>
                      <div className="flex h-[56px] w-1/5 items-center   justify-center  gap-1 rounded-[4px] ">
                        <div className="   pl-[10px]  text-[13px] font-normal leading-[21px] text-text-secondary">
                          {backCurrency?.currency_symbol}{" "}
                        </div>
                        <div className=" overflow-hidden overflow-ellipsis  text-[13px] font-normal leading-[21px] text-text-secondary">
                          {item.amount !== undefined
                            ? `${Math.round(item.amount * 1000000) / 1000000}`
                            : 0}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-[24px] border-b border-solid border-b-[#E9E9E9]  ">
                  <div className="mb-[24px] h-[40px] w-[168px] rounded-lg bg-[#E9E9E9]"></div>
                </div>
              </div>
            </div>
            <div className="px-[60px]  md:w-[595px]">
              <div className="mt-[24px] flex justify-between ">
                <div className="h-[142px] w-[211px] rounded-lg bg-[#E9E9E9]"></div>
                <div className=" flex flex-col gap-[12px]">
                  <div className="h-[40px] w-[160px] rounded-lg bg-[#E9E9E9]"></div>
                  <div className="h-[40px] w-[240px] rounded-lg bg-[#E9E9E9]"></div>
                  <div className="h-[40px] w-[160px] rounded-lg bg-[#E9E9E9]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popup showPopup={showPopupAmount}>
        <Amount
          step8Data={step8Data}
          items={items}
          setTotalAmountData={setTotalAmountData}
          setShowPopup={setShowPopupAmount}
        />

        {/* <SignPopup
          step8Data={step8Data}
          items={items}
          setTotalAmountData={setTotalAmountData}
          setShowPopup={setShowPopupAmount}
        /> */}
      </Popup>
    </>
  );
};

export default GetPaidFor;
