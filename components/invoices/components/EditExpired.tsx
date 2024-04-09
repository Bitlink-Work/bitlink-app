import MainButton from "@/components/button/MainButton";
import { useEffect, useState } from "react";

type Props = {
  setShowEditExpired: (value: boolean) => void;
  setExpiredDate: (value: Date) => void;
  setDeadline: (value: number) => void;
  edit?: boolean;
  invoiceInfo?: any;
  deadline?: number;
};

const PAYMENT_DUE_OPTIONS = [
  {
    id: 0,
    title: "Upon receipt",
    days: null,
  },
  {
    id: 1,
    title: "7 days",
    days: 7,
  },
  {
    id: 2,
    title: "14 days",
    days: 14,
  },
  {
    id: 3,
    title: "30 days",
    days: 30,
  },
  {
    id: 4,
    title: "60 days",
    days: 60,
  },
  {
    id: 5,
    title: "90 days",
    days: 90,
  },
  {
    id: 6,
    title: "Custom",
    days: 0,
  },
];

const EditExpired = ({
  setShowEditExpired,
  setExpiredDate,
  setDeadline,
  edit,
  invoiceInfo,
  deadline,
}: Props) => {
  const [active, setActive] = useState(false);
  const [expiredOption, setExpiredOption] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [days, setDays] = useState(30);

  const handleChangeDate = (days: number) => {
    setDays(days);
    if (days === null) {
      return;
    } else {
      const result = edit
        ? new Date(invoiceInfo?.created_time * 1000)
        : new Date();
      result.setDate(result.getDate() + days);
      setDate(result);
    }
  };

  useEffect(() => {
    if (deadline) {
      if (deadline === 0) {
        setActive(false);
        setExpiredOption("");
        setDate(new Date());
      } else {
        setActive(true);
        const res = PAYMENT_DUE_OPTIONS.find((item) => item.days === deadline);
        if (res) {
          setExpiredOption(res?.title || "");
        } else {
          if (deadline > 100000) {
            setExpiredOption("Upon receipt");
          } else {
            setExpiredOption("Custom");
          }
        }
      }
    }
  }, [deadline]);

  return (
    <div className="flex h-fit w-[800px] flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10">
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        Edit the payment due
      </h3>
      <div className="flex flex-row flex-wrap items-center gap-6">
        {PAYMENT_DUE_OPTIONS.map((item) => (
          <div key={item.id}>
            <label
              htmlFor="paymentDue"
              className="flex flex-row items-center gap-3"
            >
              <input
                className="h-5 w-5"
                type="radio"
                name="paymentDue"
                value={item.title}
                onClick={() => {
                  setActive(true);
                  setExpiredOption(item.title);
                }}
                checked={expiredOption === item.title}
                onChange={() => {
                  handleChangeDate(item?.days as number);
                }}
              />
              <span>{item.title}</span>
            </label>
          </div>
        ))}
        {expiredOption === "Custom" && (
          <input
            className="w-fit rounded border border-[#DEDEDE] bg-[#fff] p-4 hover:outline-none focus:outline-none active:outline-none"
            type="date"
            onChange={(e) => {
              setDays(
                Math.ceil(
                  (new Date(e.target.value).getTime() - new Date().getTime()) /
                    (24 * 60 * 60 * 1000),
                ),
              );
              setDate(new Date(e.target.value));
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
        <MainButton
          title="Cancel"
          outline
          onClick={() => setShowEditExpired && setShowEditExpired(false)}
          className="w-fit rounded-lg bg-[#fff] px-6 py-3"
        />
        <MainButton
          title="Agree"
          disabled={!active}
          onClick={() => {
            setExpiredDate && setExpiredDate(date);
            setDeadline && setDeadline(days);
            setShowEditExpired && setShowEditExpired(false);
          }}
        />
      </div>
    </div>
  );
};

export default EditExpired;
