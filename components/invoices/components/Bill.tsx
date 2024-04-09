import TrashIcon from "@/images/received-invoices/trash.svg";
import { invoiceServices } from "@/public/api/invoiceServices";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";

type Props = {
  currency: string;
  setStep: (value: number) => void;
  edit?: boolean;
  invoiceInfo?: any;
  items: any;
  setItems: (value: any) => void;
  totalBill: any;
  setTotalBill: any;
  currencies?: any;
  standard?: any;
  receiver?: any;
  wallet?: any;
  isReset?: boolean;
  setFormValues: (value: any) => void;
};

const schema = z.object({
  description: z.string().trim().min(1),
  quantity: z.string().trim().min(1),
  unit_price: z.string().trim().min(1),
  // discount: z.string().trim().min(1, { message: "Enter discount" }),
  tax: z.string().trim().min(1),
});

const Bill = ({
  currency,
  setStep,
  edit,
  invoiceInfo,
  items,
  setItems,
  totalBill,
  setTotalBill,
  currencies,
  standard,
  receiver,
  wallet,
  isReset,
  setFormValues,
}: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      description: "",
      quantity: "",
      unit_price: "",
      // discount: "0",
      tax: "",
    },
    resolver: zodResolver(schema),
  });

  // const initialItem = [
  //   {
  //     description: "tx1",
  //     quantity: "1",
  //     amount: " 1.22",
  //     unit_price: "1",
  //     tax: "22",
  //   },
  // ];

  useEffect(() => {
    if (isReset) {
      setListItems([]);
    }
  }, [isReset]);

  var initialItem: any = [];

  const [listItems, setListItems] = useState<any>([]);

  const [addNewItem, setAddNewItem] = useState<any>(false);

  const handleAddItem = (data: any) => {
    setListItems([
      ...listItems,
      { ...data, discount: 0, id: Math.random() + 1 },
    ]);
    setAddNewItem(false);
    reset();
  };
  const handleDescription = (e: any) => {
    if (e.target.value === "") {
      setError(`description`, {
        message: `Required`,
      });
    } else {
      const rex = new RegExp("^(?:(?!^s*$).|\n){0,50}$");

      if (!rex.test(e.target.value)) {
        setError(`${"description"}`, {
          message: `Invalid description `,
        });
      } else {
        clearErrors("description");
      }
    }
  };

  const handleChangeQuanity = (e: any) => {
    const input = e.target.value;

    const sanitizedInput = input.replace(/[^\d]/g, "");

    if (sanitizedInput === "") {
      setError(`quantity`, {
        message: `Required`,
      });
    } else {
      if (/^\d+$/.test(sanitizedInput) && parseInt(sanitizedInput) > 0) {
        setValue("quantity", sanitizedInput);
        clearErrors("quantity");
      } else {
        setValue("quantity", "");
      }
    }
  };

  const handleChangeUnitPrice = (e: any) => {
    const input = e.target.value;

    if (e.target.value === "") {
      setError(`unit_price`, {
        message: `Required`,
      });
    } else {
      if (/^\d*\.?\d*$/.test(input)) {
        setValue("unit_price", input);
        clearErrors("unit_price");
      } else {
        setValue("unit_price", "");
      }
    }
  };

  const handleChangeTax = (e: any) => {
    const input = e.target.value;

    if (e.target.value === "") {
      setError(`tax`, {
        message: `Required`,
      });
    } else {
      if (/^\d*\.?\d*$/.test(input)) {
        setValue("tax", input);
        clearErrors("tax");
      } else {
        setValue("tax", "");
      }
    }
  };

  const handleAddNewItem = () => {
    if (
      watch("description") !== "" &&
      watch("quantity") !== "" &&
      watch("unit_price") !== "" &&
      watch("tax") !== ""
    ) {
      setListItems([
        ...listItems,
        {
          description: watch("description"),
          quantity: watch("quantity"),
          unit_price: watch("unit_price"),
          tax: watch("tax"),
          discount: 0,
          id: Math.random() + 1,
        },
      ]);
      reset();
      setAddNewItem(true);
    } else {
      if (
        watch("description") === "" &&
        watch("quantity") === "" &&
        watch("unit_price") === "" &&
        watch("tax") === ""
      ) {
        if (listItems?.length === 0) {
          setAddNewItem(false);
        } else {
          setAddNewItem(true);
        }
      }
    }
  };

  const removeItem = async (id: number) => {
    if (edit) {
      const item = invoiceInfo?.items?.find((item: any) => item.id === id);
      if (item) {
        const res = await invoiceServices.deleteInvoiceItem({
          invoice_id: invoiceInfo.invoice_id,
          item_id: item.id,
        });
        if (res) {
          toast.success("Delete item successfully!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            transition: Bounce,
          });
        }
      }
    }
    const newItemsList = listItems?.filter((item: any) => item.id !== id);
    if (newItemsList.length === 0) {
      setAddNewItem(false);
    }
    setListItems(newItemsList);
  };

  const [sub_total, setSubTotal] = useState<any>(() => {
    if (listItems && listItems?.length > 0) {
      listItems?.reduce((acc: any, item: any) => {
        return acc + item.unit_price * item.quantity;
      }, 0);
    } else {
      return 0;
    }
  });
  const [total_tax, setTotalTax] = useState<any>(() => {
    if (listItems && listItems?.length > 0) {
      listItems?.reduce((acc: any, item: any) => {
        return (
          acc +
          (Number(item.tax) / 100) *
            Number(item.unit_price) *
            Number(item.quantity)
        );
      }, 0);
    } else {
      return 0;
    }
  });
  useEffect(() => {
    if (edit) {
      setListItems(invoiceInfo?.items);
    }
  }, [edit, invoiceInfo]);

  useEffect(() => {
    if (listItems && listItems?.length > 0) {
      const newSubTotal = listItems?.reduce((acc: any, item: any) => {
        return acc + Number(Number(item.unit_price) * Number(item.quantity));
      }, 0);
      setSubTotal(newSubTotal);

      const newTotalTax = listItems?.reduce((acc: any, item: any) => {
        return (
          acc +
          Number(
            (Number(item.tax) / 100) *
              Number(item.unit_price) *
              Number(item.quantity),
          )
        );
      }, 0);
      setTotalTax(newTotalTax);
    } else {
      setSubTotal(0);
      setTotalTax(0);
    }
  }, [listItems, setStep]);

  useEffect(() => {
    setTotalBill(sub_total + total_tax);
  }, [sub_total, total_tax]);

  useEffect(() => {
    if (invoiceInfo?.items && invoiceInfo?.items?.length > 0) {
      setListItems(invoiceInfo?.items);
    }
  }, [invoiceInfo]);

  useEffect(() => {
    const newItems = listItems?.map((item: any) => {
      return invoiceInfo?.items?.includes(item)
        ? item
        : {
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount: item.discount,
            tax: item.tax,
            id: "",
            amount: Number(
              Number(item.unit_price) *
                Number(item.quantity) *
                (1 + Number(item.tax) / 100),
            ),
          };
    });
    setItems(newItems);
    setFormValues((prev: any) => {
      return {
        ...prev,
        items: newItems,
      };
    });
  }, [listItems, setItems]);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  return (
    <div className="bill w-full px-6 pt-6">
      {listItems && listItems?.length > 0 ? (
        <table>
          <thead>
            <tr className={`${listItems?.length > 0 ? "py-[6px]" : "py-0"} `}>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit price</th>
              {/* <th>Discount</th> */}
              <th>Tax</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {listItems?.map((item: any, index: any) => (
              <tr key={index} className="relative py-[6px]">
                <Image
                  src={TrashIcon}
                  alt=""
                  className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => removeItem(item.id)}
                />

                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unit_price}</td>
                {/* <td>{item.discount ? item.discount : "--"}</td> */}
                <td>{item.tax} %</td>
                <td>
                  {Math.round(
                    Number(
                      Number(item.unit_price) *
                        Number(item.quantity) *
                        (1 + Number(item.tax) / 100),
                    ) * 1000000,
                  ) / 1000000}{" "}
                  {invoiceInfo ? invoiceInfo?.currency : currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full">
          <div className="w-full">
            <ul className="grid w-full grid-cols-5 py-[6px] text-center">
              <li className="border-b-[2.25px] border-[#BABABB] py-3 text-sm font-medium leading-[150%] text-text-primary">
                Description
              </li>
              <li className="border-b-[2.25px] border-[#BABABB] py-3 text-sm font-medium leading-[150%] text-text-primary">
                Quantity
              </li>
              <li className="border-b-[2.25px] border-[#BABABB] py-3 text-sm font-medium leading-[150%] text-text-primary">
                Unit price
              </li>
              {/* <li className="border-b-[2.25px] border-[#BABABB] py-3 text-sm font-medium leading-[150%] text-text-primary">
                Discount
              </li> */}
              <li className="border-b-[2.25px] border-[#BABABB] py-3 text-sm font-medium leading-[150%] text-text-primary">
                Tax
              </li>
              <li className="border-b-[2.25px] border-[#BABABB] py-3 text-sm font-medium leading-[150%] text-text-primary">
                Amount
              </li>
            </ul>
          </div>
          <form
            onSubmit={handleSubmit(handleAddItem)}
            className="grid w-full grid-cols-5 border-b-[1.5px] border-[#E9E9E9] py-[6px] text-sm font-normal leading-[21px] text-[#444445]"
          >
            <div className="relative">
              <input
                {...register("description")}
                className={`mx-0 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"description"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
                type="text"
                onChange={handleDescription}
              />
              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`description`] && errors[`description`]?.message
                  ? `${errors[`description`]?.message}`
                  : ""}
              </p>
            </div>
            <div className="relative">
              <input
                {...register("quantity")}
                className={`mx-1 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"quantity"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
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
                onChange={handleChangeQuanity}
              />
              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`quantity`] && errors[`quantity`]?.message
                  ? `${errors[`quantity`]?.message}`
                  : ""}
              </p>
            </div>
            <div className="relative">
              <input
                {...register("unit_price")}
                className={`mx-2 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"unit_price"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
                type="text"
                onChange={handleChangeUnitPrice}
              />
              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`unit_price`] && errors[`unit_price`]?.message
                  ? `${errors[`unit_price`]?.message}`
                  : ""}
              </p>
            </div>
            <div className="relative">
              <input
                {...register("tax")}
                className={`mx-3 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"tax"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
                type="text"
                onChange={handleChangeTax}
              />
              <p className="absolute right-4 top-[calc(20%)]">%</p>

              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`tax`] && errors[`tax`]?.message
                  ? `${errors[`tax`]?.message}`
                  : ""}
              </p>
            </div>

            <input type="submit" hidden />
          </form>
        </div>
      )}
      {addNewItem && (
        <div className="w-full">
          <form
            onSubmit={handleSubmit(handleAddItem)}
            className="grid w-full grid-cols-5 border-b-[1.5px] border-[#E9E9E9] py-[6px] text-sm font-normal leading-[21px] text-[#444445]"
          >
            <div className="relative">
              <input
                {...register("description")}
                className={`mx-0 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"description"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
                type="text"
                onChange={handleDescription}
              />
              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`description`] && errors[`description`]?.message
                  ? `${errors[`description`]?.message}`
                  : ""}
              </p>
            </div>
            <div className="relative">
              <input
                {...register("quantity")}
                className={`mx-1 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"quantity"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
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
                onChange={handleChangeQuanity}
                // onKeyDown={(e) =>
                //   exceptThisSymbols.includes(e.key) && e.preventDefault()
                // }
              />
              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`quantity`] && errors[`quantity`]?.message
                  ? `${errors[`quantity`]?.message}`
                  : ""}
              </p>
            </div>

            <div className="relative">
              <input
                {...register("unit_price")}
                className={`mx-2 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"unit_price"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
                type="text"
                onKeyPress={handleKeyPress}
                onInput={(e: any) => {
                  if (e.target.value.length > 12) {
                    e.target.value = e.target.value.slice(0, 12);
                  }
                }}
                onChange={handleChangeUnitPrice}
              />
              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`unit_price`] && errors[`unit_price`]?.message
                  ? `${errors[`unit_price`]?.message}`
                  : ""}
              </p>
            </div>

            <div className="relative">
              <input
                {...register("tax")}
                className={`mx-3 h-[36px] w-full rounded bg-[#F9F7F1] text-center outline-none hover:outline-none  ${
                  errors && errors[`${"tax"}`]?.message
                    ? "focus:outline-red-500 active:outline-red-500"
                    : "focus:outline-none active:outline-none"
                } `}
                type="text"
                onChange={handleChangeTax}
              />
              <p className="absolute right-4 top-[calc(20%)]">%</p>

              <p className=" absolute top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
                {errors[`tax`] && errors[`tax`]?.message
                  ? `${errors[`tax`]?.message}`
                  : ""}
              </p>
            </div>
            {/* <input
              {...register("unit_price", {
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: "Please enter a valid float number",
                },
              })}
              className="mx-3 h-[36px] rounded bg-[#F9F7F1] text-center outline-none hover:outline-none focus:outline-none active:outline-none"
              type="text"
              onKeyDown={(e) => invalidKeyFloat(e.key) && e.preventDefault()}
            /> */}

            {/* <input
              {...register("discount")}
              className="mx-3 h-[36px] rounded bg-[#F9F7F1] text-center outline-none hover:outline-none focus:outline-none active:outline-none"
              type="text"
              defaultValue={""}
            /> */}

            {/* <div className="mx-3 flex h-[36px] w-full items-center gap-1 rounded bg-[#F9F7F1] px-3">
              <input
                {...register("tax")}
                className="w-full flex-1 bg-transparent text-center outline-none hover:outline-none focus:outline-none active:outline-none"
                type="text"
                onKeyDown={(e) => invalidKeyFloat(e.key) && e.preventDefault()}
              />
              <p className="">%</p>
            </div> */}

            {/* <input
              {...register("amount")}
              className="mx-3 h-[36px] rounded bg-[#F9F7F1] text-center outline-none hover:outline-none focus:outline-none active:outline-none"
              type="text"
              defaultValue={""}
            /> */}

            <input type="submit" hidden />
          </form>
        </div>
      )}
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
              {currency} {sub_total}
            </p>
          </div>
        </div>
        <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Tax</h6>
            <p>
              {invoiceInfo ? invoiceInfo?.currency : currency}{" "}
              {(total_tax * 1000000) / 1000000}
            </p>
          </div>
        </div>
        <div className="w-[450px] bg-[rgba(24,144,255,0.04)] px-6 py-[6px] text-sm font-normal leading-[150%] text-text-secondary">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Total</h6>
            <p>
              {invoiceInfo ? invoiceInfo?.currency : currency}{" "}
              {Math.round(totalBill * 1000000) / 1000000}
            </p>
          </div>
        </div>
        <div className="w-[450px] bg-[#1890FF] px-6 py-[6px] text-lg font-semibold leading-[150%] text-[#fff]">
          <div className="flex h-9 w-full items-center justify-between">
            <h6>Amount due</h6>
            <p>
              {invoiceInfo ? invoiceInfo?.currency : currency}{" "}
              {Math.round(totalBill * 1000000) / 1000000}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
