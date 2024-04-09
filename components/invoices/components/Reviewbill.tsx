import React, { useEffect, useState } from "react";
import TrashIcon from "@/images/received-invoices/trash.svg";
import Image from "next/image";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { useAppSelector } from "@/public/hook/hooks";

const ReviewBill = ({
  setCreateData,
  step9Data,
  setStep9Data,
  setIsValidBill,
}: any) => {
  const [subTotal, setSubTotal] = useState<any>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const [inputErrors, setInputErrors] = useState<any[]>([]);
  const [inputErrorQuantity, setInputErrorQuanity] = useState<any[]>([]);
  const [inputErrorUnitPrice, setInputErrorUnitPrice] = useState<any[]>([]);
  const [inputErrorTax, setInputErrorTax] = useState<any[]>([]);

  const [inputValid, setInputValid] = useState<any[]>([]);

  const [items, setItems] = useState(step9Data?.items || []);

  useEffect(() => {
    let subTotal = 0;
    let totalAmount = 0;
    let taxTotal = 0;
    items.forEach((item: any) => {
      let amount =
        parseFloat(item.quantity) * parseFloat(item.unit_price) +
        (parseFloat(item.quantity) *
          parseFloat(item.unit_price) *
          parseFloat(item.tax)) /
          100;

      taxTotal +=
        (parseFloat(item.quantity) *
          parseFloat(item.unit_price) *
          parseFloat(item.tax)) /
        100;
      totalAmount += amount;
    });

    subTotal = totalAmount - taxTotal;
    isNaN(subTotal) ? setSubTotal(0) : setSubTotal(subTotal);

    isNaN(totalAmount) ? setTotalAmount(0) : setTotalAmount(totalAmount);
    isNaN(taxTotal) ? setTax(0) : setTax(taxTotal);
  }, [items]);

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

    setIsValidBill(isValid);
  }, [items]);

  useEffect(() => {
    setItems(dataInvoice.items);
  }, [dataInvoice.items]);

  useEffect(() => {
    if (items?.length === 0) {
      handleAddNewItem();
      setInputErrors([]);
      setInputErrorQuanity([]);
      setInputErrorUnitPrice([]);
      setInputErrorTax([]);
      setInputValid([]);
    }
  }, [items]);

  const handleAddNewItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        tax: 0,
        amount: "",
        id: Math.random() + 1,
      },
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    let newValue = value;

    let newInputErrors = [...inputErrors];
    let newInputQuantityErrors = [...inputErrorQuantity];
    let newInputUnitPriceErrors = [...inputErrorUnitPrice];
    let newInputTaxErrors = [...inputErrorTax];
    let newInputValids = [...inputValid];

    if (field === "description") {
      if (value === "") {
        newInputErrors[index] = true;
        setIsValidBill(false);
      } else {
        newInputErrors[index] = false;
      }
      if (value.length > 50) {
        newInputValids[index] = true;
        setIsValidBill(false);
      } else {
        newInputValids[index] = false;
      }
    }

    setInputErrors(newInputErrors);
    setInputValid(newInputValids);

    if (field === "quantity") {
      const numericValue = parseFloat(value);
      if (value === "") {
        setIsValidBill(false);
      }
      if (numericValue < 0 || isNaN(numericValue)) {
        newValue = "";

        setIsValidBill(false);
      }
      if (value === "") {
        newInputQuantityErrors[index] = true;
        setIsValidBill(false);
      } else {
        newInputQuantityErrors[index] = false;
      }
    }
    if (field === "unit_price") {
      const numericValue = parseFloat(value);
      if (numericValue < 0) {
        newValue = "";
        setIsValidBill(false);
      }
      if (value === "") {
        newInputUnitPriceErrors[index] = true;
        setIsValidBill(false);
      } else {
        newInputUnitPriceErrors[index] = false;
      }
    }
    if (field === "tax") {
      const numericValue = parseFloat(value);
      if (numericValue < 0) {
        newValue = "";
        setIsValidBill(false);
      }
      if (value === "") {
        newInputTaxErrors[index] = true;
        setIsValidBill(false);
      } else {
        newInputTaxErrors[index] = false;
      }
    }

    setInputErrorQuanity(newInputQuantityErrors);
    setInputErrorTax(newInputTaxErrors);
    setInputErrorUnitPrice(newInputUnitPriceErrors);

    newItems[index][field] = newValue;
    if (newItems[index]?.quantity === undefined) {
      newItems[index] = { ...newItems[index], ["quantity"]: 1 };
    }
    if (newItems[index]?.unit_price === undefined) {
      newItems[index] = { ...newItems[index], ["unit_price"]: 0 };
    }
    if (newItems[index]?.tax === undefined) {
      newItems[index] = { ...newItems[index], ["tax"]: 0 };
    }
    if (field === "quantity" || field === "unit_price" || field === "tax") {
      const quantity = Number.isNaN(parseFloat(newItems[index].quantity))
        ? 1
        : parseFloat(newItems[index].quantity);

      const unit_price = Number.isNaN(parseFloat(newItems[index].unit_price))
        ? 0
        : parseFloat(newItems[index].unit_price);

      const tax = Number.isNaN(parseFloat(newItems[index].tax))
        ? 0
        : parseFloat(newItems[index].tax);

      let amount =
        Number(quantity * unit_price) +
        Number((quantity * unit_price * tax) / 100);
      newItems[index]["amount"] = ` ${isNaN(amount) ? 0 : amount}`;

      amount = Math.round(amount * 1000000) / 1000000;

      let subTotal = 0;
      let totalAmount = 0;
      let taxTotal = 0;
      newItems.forEach((item: any) => {
        subTotal += parseFloat(item.quantity) * parseFloat(item.unit_price);
        subTotal = Math.round(subTotal * 1000000) / 1000000;
        taxTotal +=
          (parseFloat(item.quantity) *
            parseFloat(item.unit_price) *
            parseFloat(item.tax)) /
          100;
      });

      setSubTotal(subTotal);
      setTotalAmount(totalAmount);
      setTax(Math.round(taxTotal * 1000000) / 1000000);
    }
    setItems(newItems);
    setInvoiceToLocalStorage({
      ...dataInvoice,
      items: newItems,
    });
  };
  const removeItem = (id: number) => {
    const newItemsList = items.filter((item: any) => item.id !== id);
    setItems(newItemsList);
  };

  useEffect(() => {
    var newdata = { ...step9Data, items };

    setStep9Data(newdata);
    setCreateData(newdata);
  }, [items]);

  const currencies = useAppSelector(selectCurrency);

  const backNetwork = currencies.find(
    (item: any) => item?.chain_id === dataInvoice?.dataNetwork?.chain_id,
  );
  const backCurrency = backNetwork?.currencies.find(
    (item: any) => item?.currency_symbol === dataInvoice?.currency,
  );

  return (
    <div className=" w-full px-6 ">
      <div className=" flex w-full items-center  border-b-[1.5px] border-solid border-b-[#BABABB] text-text-primary">
        <div className="w-1/5  ">
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

      {items.map((item: any, index: number) => (
        <tr
          key={index}
          className=" flex w-full items-center justify-between gap-3 border-b border-solid border-b-[#E9E9E9] py-[24px]"
        >
          {items.length > 0 ? (
            <Image
              src={TrashIcon}
              alt=""
              className="-ml-10 cursor-pointer"
              onClick={() => removeItem(item.id)}
            />
          ) : (
            ""
          )}
          <>
            <div className="relative ml-8 w-full">
              <input
                className=" h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none  "
                value={item.description}
                maxLength={50}
                type="text"
                onChange={(e) =>
                  handleInputChange(index, "description", e.target.value)
                }
              />
              {inputErrors[index] && (
                <div className="absolute left-0 top-[calc(100%+4px)] text-[11px] text-red-500">
                  Required
                </div>
              )}
              {inputValid[index] && (
                <div className="absolute left-0 top-[calc(100%+4px)] text-[11px] text-red-500">
                  Exceed 50 characters!
                </div>
              )}
            </div>
          </>
          <>
            <div className="relative ml-2 w-full">
              <input
                type="number"
                className=" h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none  "
                defaultValue={item.quantity || 1}
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
                onChange={(e: any) => {
                  if (e.target.value.length > 12) {
                    e.target.value = e.target.value.slice(0, 12);
                  }
                  handleInputChange(index, "quantity", e.target.value);
                }}
              />
              {inputErrorQuantity[index] && (
                <div className="absolute left-0 top-[calc(100%+4px)] text-[11px] text-red-500">
                  Required
                </div>
              )}
            </div>
          </>
          <>
            <div className="relative ml-2 w-full">
              <div className="flex items-center gap-1">
                <span className="absolute left-4 top-1/2 flex -translate-y-1/2">
                  {backCurrency?.currency_symbol}
                </span>
                <input
                  type="number"
                  className=" h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] pl-16 text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none  "
                  defaultValue={item.unit_price || 0}
                  onKeyPress={handleKeyPress}
                  onInput={(e: any) => {
                    if (e.target.value.length > 12) {
                      e.target.value = e.target.value.slice(0, 12);
                    }
                    handleInputChange(index, "unit_price", e.target.value);
                  }}
                />
              </div>
              {inputErrorUnitPrice[index] && (
                <div className="absolute left-0  top-[calc(100%+4px)] text-[11px] text-red-500">
                  Required
                </div>
              )}
            </div>
          </>
          <>
            <div className="relative ml-2 w-full  ">
              <div className=" relative flex items-center gap-2 ">
                <input
                  type="number"
                  className=" h-[56px] w-full rounded-[4px] border border-solid border-[#DEDEDE] bg-[#F9F7F1] p-[16px] text-[14px] font-normal leading-[21px] text-text-secondary focus:border-none focus:outline-none  "
                  defaultValue={item.tax || 0}
                  onKeyPress={handleKeyPress}
                  onInput={(e: any) => {
                    if (e.target.value.length > 12) {
                      e.target.value = e.target.value.slice(0, 12);
                    }
                    handleInputChange(index, "tax", e.target.value);
                  }}
                />

                <p className="">%</p>
              </div>
              {inputErrorTax[index] && (
                <div className="absolute left-0 top-[calc(100%+4px)] text-[11px] text-red-500">
                  Required
                </div>
              )}
            </div>
          </>

          <>
            <div className="relative flex w-full items-center gap-4 ">
              <span className="ml-8">{backCurrency?.currency_symbol}</span>
              <div className="  ">
                {Math.round(item.amount * 1000000) / 1000000}
              </div>
            </div>
          </>
        </tr>
      ))}

      <div className="w-full py-3 text-start">
        <button
          onClick={handleAddNewItem}
          className="text-sm font-medium leading-[150%] text-[#1890FF] outline-none hover:outline-none active:outline-none"
        >
          + Add an item
        </button>
      </div>
      <div className="flex flex-col items-end justify-end gap-[1.5px] ">
        <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Subtotal</h6>
            <p>
              {" "}
              {backCurrency?.currency_symbol}{" "}
              {Math.round(subTotal * 1000000) / 1000000}
            </p>
          </div>
        </div>
        <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Tax</h6>

            <p>
              {backCurrency?.currency_symbol}{" "}
              {Math.round(tax * 1000000) / 1000000}
            </p>
          </div>
        </div>
        <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Total</h6>
            <p>
              {" "}
              {backCurrency?.currency_symbol}{" "}
              {Math.round(totalAmount * 1000000) / 1000000}
            </p>
          </div>
        </div>
        <div className="w-[450px] bg-[#1890FF] px-6 py-[6px] text-lg font-semibold leading-[150%] text-[#fff]">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Amount due</h6>
            <p>
              {" "}
              {backCurrency?.currency_symbol}{" "}
              {Math.round(totalAmount * 1000000) / 1000000}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBill;
