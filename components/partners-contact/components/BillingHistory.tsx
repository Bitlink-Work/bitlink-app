import Pagination from "@/components/pagination/Pagination";
import { Status } from "@/constants";
import { getPartnerBilling } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { selectListBillingOfPartners } from "@/public/reducers/partnerSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

type Props = {
  partner: any;
  setShowHistory: (showHistory: boolean) => void;
};

const BillingHistory = ({ partner, setShowHistory }: Props) => {
  const router = useRouter();
  const currencies = useAppSelector(selectCurrency);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useAppDispatch();
  const listBillingOfPartners = useAppSelector(selectListBillingOfPartners);
  const [bills, setBills] = useState<any>({});
  const fetchListBilling = useCallback(async () => {
    dispatch(
      getPartnerBilling({
        page,
        page_size: pageSize,
        partner_id: partner?.partner_id,
      }),
    );
  }, [dispatch, page, pageSize, partner]);

  useEffect(() => {
    if (partner?.partner_id) {
      fetchListBilling();
    }
  }, [fetchListBilling, partner]);

  useEffect(() => {
    if (partner?.partner_id) {
      setBills({
        items: listBillingOfPartners[partner?.partner_id] || [],
        total_item: 10,
        num_of_page: 1,
      });
    }
  }, [listBillingOfPartners, partner]);

  return (
    <div className="flex h-fit w-fit max-w-[1200px] flex-col gap-4 rounded-xl border border-[#DEDEDE] bg-[#fff] p-6 shadow-[0px_4px_15px_0px_rgba(0,0,0,0.06)]">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <h4 className="text-sm font-semibold leading-[150%] text-text-primary">
            Billing History
          </h4>
          <div className="leading-[150%} h-fit w-fit rounded-lg bg-primary px-[6px] py-[2px] text-xs font-medium text-white">
            <span>{bills?.items?.length}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setShowHistory && setShowHistory(false);
          }}
          className="h-fit w-fit p-[5px]"
        >
          <Image
            src="/images/partner/close.svg"
            width={14}
            height={14}
            alt=""
          />
        </button>
      </div>
      <div className="history bill max-h-[400px] overflow-auto">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills?.items?.map((item: any) => {
              const createTime = new Date(item.created_time * 1000);
              let currency = currencies
                ?.find(
                  (n: any) =>
                    String(n?.chain_name).toLowerCase() ===
                    String(item?.chain).toLowerCase(),
                )
                ?.currencies?.find(
                  (c: any) => c?.currency_symbol === item?.currency,
                );
              return (
                <tr key={item}>
                  <td>#{item?.invoice_id}</td>
                  <td className="w-fit">
                    {createTime.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="flex flex-row items-center justify-start gap-[6px]">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <Image
                          className="h-full w-full object-contain"
                          loader={({ src }) => src}
                          src={currency?.logo || ""}
                          width={24}
                          height={24}
                          alt=""
                        />
                      </div>
                      <p className="whitespace-nowrap">
                        {item?.currency} ({item?.chain})
                      </p>
                    </div>
                  </td>
                  <td
                    className={`${
                      item.status === "COMPLETED"
                        ? "text-[#12B347]"
                        : "text-[#202124]"
                    } whitespace-nowrap`}
                  >
                    {item.status === "COMPLETED" ? "+" : ""}
                    {item?.currency}{" "}
                    {Number(item.total_value) > 0.000001
                      ? Number(Number(item.total_value).toFixed(6))
                      : `<0.000001`}
                  </td>
                  <td>
                    <div
                      className={`flex h-fit w-[179px] flex-row items-center justify-start gap-1 rounded border-l-[1.5px] px-3 py-2`}
                      style={{
                        background: Status[item?.status].background,
                        borderLeft: `1.5px solid ${
                          Status[item?.status].border
                        }`,
                      }}
                    >
                      <Image
                        src={Status[item?.status].icon}
                        width={12}
                        height={12}
                        alt=""
                      />
                      {/* <p className="text-sm font-normal leading-[150%] text-[#19213D]">
                        {Status[item?.status].icon}
                      </p> */}
                      <p className="whitespace-nowrap text-xs font-medium leading-[18px] text-text-secondary">
                        {Status[item?.status].text}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {bills && bills?.items?.length > 0 && (
        <Pagination
          totalItems={bills?.total_item}
          numOfPages={bills?.num_of_page}
          currentPage={1}
          setCurrentPage={() => {}}
          selectedOption={5}
          setSelectedOption={() => {}}
        />
      )}
    </div>
  );
};

export default BillingHistory;
