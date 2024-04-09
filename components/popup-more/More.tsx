import { getAllCreatedInvoice, getAllReceivedInvoice } from "@/public/actions";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import {
  selectAllListCreatedInvoices,
  selectAllListReceivedInvoices,
  selectListCreatedInvoices,
  selectListReceivedInvoices,
} from "@/public/reducers/invoiceSlice";
import { handleCloseModal } from "@/public/utils/lib";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { Bounce, toast } from "react-toastify";

const More = ({
  type,
  downloadPdf,
  toggleSidePopup,
}: {
  type: string;
  downloadPdf: any;
  toggleSidePopup: any;
}) => {
  const dispatch = useAppDispatch();
  const listCreatedInvoice = useAppSelector(selectListCreatedInvoices);
  const listReceivedInvoice = useAppSelector(selectListReceivedInvoices);
  const listAllCreatedInvoice = useAppSelector(selectAllListCreatedInvoices);
  const listAllReceivedInvoice = useAppSelector(selectAllListReceivedInvoices);
  const fetchCreatedInvoices = async () => {
    if (type === "sent") {
      dispatch(
        getAllCreatedInvoice({
          page: 1,
          page_size: listCreatedInvoice?.total_item,
          status: "ALL",
        }),
      );
    } else {
      dispatch(
        getAllReceivedInvoice({
          page: 1,
          page_size: listReceivedInvoice?.total_item,
          status: "ALL",
        }),
      );
    }
  };
  useEffect(() => {
    fetchCreatedInvoices();
  }, []);
  const [data, setData] = useState<any>([
    [
      "Creation Date",
      "Invoice #",
      "Company",
      "Name",
      "Amount",
      "Blockchain",
      "Status",
    ],
  ]);

  useEffect(() => {
    if (type === "sent") {
      if (listAllCreatedInvoice?.items) {
        listAllCreatedInvoice?.items?.map((item: any) => {
          const date = new Date(item.created_time * 1000).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          );
          setData((prev: any) => [
            ...prev,
            [
              date,
              item.invoice_id,
              item.to_company,
              `${item.to_first_name} ${item.to_last_name}`,
              `${item?.currency} ${item?.total_value}`,
              `${item?.currency} (${item?.chain})`,
              item.status,
            ],
          ]);
        });
      }
    } else {
      if (listAllReceivedInvoice?.items) {
        listAllReceivedInvoice?.items?.map((item: any) => {
          const date = new Date(item.created_time).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setData((prev: any) => [
            ...prev,
            [
              date,
              item.invoice_id,
              item.from_company,
              `${item.from_first_name} ${item.from_last_name}`,
              `${item?.currency} ${item?.total_value}`,
              `${item?.currency} (${item?.chain})`,
              item.status,
            ],
          ]);
        });
      }
    }
  }, [listAllCreatedInvoice, listAllReceivedInvoice]);

  const popupRef = useRef(null);

  useEffect(() => {
    handleCloseModal(popupRef, toggleSidePopup);
  }, []);

  return (
    <div
      ref={popupRef}
      className="border-solidborder-[#DEDEDE] absolute right-4 top-16 z-50 flex h-[112px] flex-col  items-start rounded-lg  border bg-white"
    >
      <button
        onClick={() => {
          // downloadPdf();
          toast.info("Coming soon!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            transition: Bounce,
          });
          toggleSidePopup && toggleSidePopup();
        }}
        className="border-b-solid flex gap-[10px] border-b border-b-[] px-[24px] py-[16px] "
      >
        <div className="text-[14px] font-medium leading-[21px] text-text-primary">
          Batch Download PDF
        </div>
        <div>
          <Image
            src="/images/received-invoices/PDF.svg"
            alt="PDF"
            width={24}
            height={24}
            objectFit="cover"
          />
        </div>
      </button>
      <CSVLink
        onClick={() => {
          toggleSidePopup && toggleSidePopup();
        }}
        data={data}
        filename="invoices.csv"
        className="border-b-solid flex gap-[10px]  px-[24px] py-[16px] "
      >
        <div className="text-[14px] font-medium leading-[21px] text-text-primary">
          Download CSV
        </div>
        <div>
          <Image
            src="/images/received-invoices/CSV.svg"
            alt="CSV"
            width={24}
            height={24}
            objectFit="cover"
          />
        </div>
      </CSVLink>
    </div>
  );
};

export default More;
