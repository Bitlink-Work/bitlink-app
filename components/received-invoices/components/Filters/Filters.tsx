import SelectField from "@/components/fields/SelectField";
import { getChainCurrency } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  type: string;
  setSearchValue: (value: any) => void;
  setFilterValue: (value: any) => void;
  isReset: boolean;
  setIsReset: (value: boolean) => void;
  handleReset: () => void;
};

const Wrapper = (props: any) => {
  const { title } = props;
  return (
    <div className="flex w-fit min-w-[215px] cursor-pointer flex-row items-center justify-between gap-3 rounded border-[0.6px] border-[#EBEFF6] p-4">
      <p className="text-sm font-normal leading-[150%] text-text-primary">
        {title}
      </p>
      <div className="flex h-6 w-6 items-center justify-center px-[5px]">
        <Image
          src="/images/received-invoices/arrow-down.svg"
          width={14.001}
          height={7}
          alt=""
        />
      </div>
    </div>
  );
};

const Filters = ({
  type,
  setSearchValue,
  setFilterValue,
  isReset,
  setIsReset,
  handleReset,
}: Props) => {
  const { handleSubmit, register, setValue, control, watch } = useForm({
    defaultValues: {
      payment_method: "",
      search: "",
      network: "",
      currency: "",
    },
  });
  const [createDate, setCreateDate] = useState<any>(null);
  const currencies = useAppSelector(selectCurrency);
  const [listCurrency, setListCurrency] = useState<any>([]);
  const [listNetwork, setListNetwork] = useState<any>([]);

  const dispatch = useAppDispatch();

  const fetchListCurrencies = async () => {
    dispatch(getChainCurrency({}));
  };

  useEffect(() => {
    fetchListCurrencies();
  }, []);

  useEffect(() => {
    if (currencies) {
      setListNetwork(
        currencies?.map((item: any) => {
          const { logo } = item.currencies[0];
          const chain_name = item.chain_name;
          return { icon: logo, label: chain_name, value: chain_name };
        }),
      );
    }
  }, [currencies]);

  useEffect(() => {
    if (watch("network") && watch("network").length > 0) {
      const currentNetwork = currencies?.find(
        (item: any) => item.chain_name === watch("network"),
      );
      if (currentNetwork) {
        setValue("currency", "");
        setListCurrency(
          currentNetwork?.currencies?.map((item: any) => {
            const { currency_symbol, logo } = item;
            return {
              label: currency_symbol,
              value: currency_symbol,
              icon: logo,
            };
          }),
        );
      }
    } else {
      setValue("currency", "");
      setListCurrency([]);
    }
  }, [watch("network")]);

  const onSubmit = async (data: any) => {
    if (type === "sent") {
      setSearchValue((prev: any) => {
        return { ...prev, receiver: data.search };
      });
    } else {
      setSearchValue((prev: any) => {
        return { ...prev, sender: data.search };
      });
    }
  };

  useEffect(() => {
    if (watch("search").length === 0) {
      if (type === "sent") {
        setSearchValue((prev: any) => {
          return { ...prev, receiver: "" };
        });
      } else {
        setSearchValue((prev: any) => {
          return { ...prev, sender: "" };
        });
      }
    }
  }, [watch("search")]);

  useEffect(() => {
    setFilterValue({
      network: watch("network"),
      currency: watch("currency"),
    });
  }, [watch("network"), watch("currency")]);

  useEffect(() => {
    if (isReset) {
      setCreateDate(null);
      setValue("search", "");
      setValue("network", "");
      setValue("currency", "");
      setIsReset(false);
    }
  }, [isReset]);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn("left", 0, 0, 0.5)}
      className="mb-6 flex flex-row items-center gap-[16px]"
    >
      {/* <SelectField
        data={[
          [
            // { label: "VND", value: "VND" },
            // { label: "USD", value: "USD" },
          ],
          // [
          //   { label: "ETH", value: "ETH" },
          //   { label: "BTC", value: "BTC" },
          // ],
          listCurrency
        ]}
        listTitle={["Fiat Money", "Crypto"]}
        placeholder="All Payment Methods"
        formField="payment_method"
        control={control}
        setValue={setValue}
        className="w-[216px]"
      /> */}
      {/* <div className="h-6 w-[1px] bg-[#DEDEDE]"></div> */}
      <SelectField
        data={listNetwork}
        placeholder="All Networks"
        formField="network"
        control={control}
        setValue={setValue}
        className="w-[229px]"
        searchPlaceholder="Type a Network"
        initialValue={false}
      />
      <div className="h-6 w-[1px] bg-[#DEDEDE]"></div>
      <SelectField
        data={listCurrency}
        placeholder="All Currencies"
        formField="currency"
        control={control}
        setValue={setValue}
        className="w-[229px]"
        searchPlaceholder="Type a Currency"
        initialValue={false}
      />
      <div className="h-6 w-[1px] bg-[#DEDEDE]"></div>
      <div className="flex h-14 w-[229px] flex-row items-center justify-between rounded border border-[#DEDEDE] bg-[#fff] p-4 text-sm font-normal leading-[150%] text-text-primary ">
        <p className="flex-1">{createDate ? createDate : "Creation Date"}</p>
        <input
          className="customDatePicker hover:outline-none focus:outline-none active:outline-none"
          type="date"
          onChange={(e) => {
            if (e.target.value === "") {
              setCreateDate(null);
              return setSearchValue((prev: any) => {
                return { ...prev, created_time: 0 };
              });
            } else {
              setCreateDate(e.target.value);
              setSearchValue((prev: any) => {
                return {
                  ...prev,
                  created_time: new Date(e.target.value).valueOf() / 1000,
                };
              });
            }
            // fetchListInvoices(new Date(e.target.value).valueOf() / 1000);
          }}
          placeholder="Creation Date"
          max={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="h-6 w-[1px] bg-[#DEDEDE]"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-14 w-[229px] flex-1 items-center gap-2 rounded border-[0.6px] border-[rgba(235,239,246,1)] bg-white p-4"
      >
        <input
          {...register("search")}
          className="h-full w-full border-none text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-[#98999A] focus:outline-none active:outline-none"
          type="text"
          placeholder={
            type === "sent" ? "Type receiver email" : "Type sender email"
          }
          onChange={(e) => {
            setValue("search", e.target.value);
          }}
        />
        <button onClick={handleSubmit(onSubmit)}>
          <Image
            src="/images/fields/search.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>
        <button type="submit" hidden></button>
      </form>
      {/* <SelectDateField /> */}
      <button
        onClick={() => {
          handleReset();
        }}
        className="rounded-full bg-[rgba(234,237,245,1)] p-4"
      >
        <Image
          src="/images/invoices/reload.svg"
          width={24}
          height={24}
          alt=""
        />
      </button>
    </motion.div>
  );
};

export default Filters;
