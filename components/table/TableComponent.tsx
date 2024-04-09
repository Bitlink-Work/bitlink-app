import { ACTIONS, Status } from "@/constants";
import { getCreatedData, getCreatedInvoice, sendMail } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import html2canvas from "html2canvas"; // For capturing HTML content
import jsPDF from "jspdf";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";
import CustomPopup from "../invoices/components/CustomPopup";
import ISOInvoice from "../standards/ISOInvoice";

type Props = {
  searchValue?: any;
  listInvoices: any;
  type: string;
  setSelectedId?: (value: any) => void;
  invoiceInfo?: any;
  setInvoiceInfo?: (value: any) => void;
  setShowReminder?: (value: boolean) => void;
  setShowCheckInvoice?: (value: boolean) => void;
  setShowConfirmDelete?: (value: boolean) => void;
};

const STANDARDS = [
  {
    id: 0,
    title: "ISO 19005-3",
  },
  {
    id: 1,
    title: "ebXML",
  },
  {
    id: 2,
    title: "OASIS UBL 2.x",
  },
  {
    id: 3,
    title: "ISO/IEC 19845:2015",
  },
  {
    id: 4,
    title: "UN/CEFACT",
  },
  {
    id: 5,
    title: "PDF/A-3",
  },
  {
    id: 6,
    title: "CEN/PC 434",
  },
  {
    id: 7,
    title: "CEN/PC 440",
  },
  {
    id: 8,
    title: "PEPPOL BIS 3.0",
  },
];

const TableComponent = ({
  searchValue,
  listInvoices,
  type,
  setSelectedId,
  invoiceInfo,
  setInvoiceInfo,
  setShowReminder,
  setShowCheckInvoice,
  setShowConfirmDelete,
}: Props) => {
  const currencies = useAppSelector(selectCurrency);
  const [listItem, setListItem] = useState<any[]>([]);
  const [hidePopup, setHidePopup] = useState(true);
  // const [invoiceInfo, setInvoiceInfo] = useState<any>(null);
  const [invoiceIdSelected, setInvoiceIdSelected] = useState(null);
  useEffect(() => {
    if (listInvoices) {
      setListItem(listInvoices?.items);
    }
  }, [listInvoices]);

  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSentInvoice = async (invoice_id: any) => {
    try {
      await dispatch(
        sendMail({
          invoice_id: invoice_id,
        }),
      );
      toast.success("Send invoice successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    } catch (e) {
      toast.error(e as string, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    }
  };

  const handleAction = async (e: any, action: any, invoiceId: any) => {
    e.stopPropagation();
    switch (action) {
      case "view":
        setHidePopup(false);
        break;
      case "send":
        handleSentInvoice(invoiceId);
        await dispatch(getCreatedInvoice({}));
        await dispatch(getCreatedData({}));
        break;
      case "noti":
        setSelectedId && setSelectedId(invoiceId);
        setShowReminder && setShowReminder(true);
        break;
      case "check":
        setSelectedId && setSelectedId(invoiceId);
        setShowCheckInvoice && setShowCheckInvoice(true);
        break;
      case "delete":
        setSelectedId && setSelectedId(invoiceId);
        setShowConfirmDelete && setShowConfirmDelete(true);
        break;
      case "buy":
        toast.info("Coming soon!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        });
        break;
      default:
        break;
    }
  };

  const fetchInvoiceInfo = useCallback(async (invoiceIdSelected: any) => {
    if (invoiceIdSelected) {
      const res = await invoiceServices.getInvoiceDetail(invoiceIdSelected);
      if (res) {
        setInvoiceInfo && setInvoiceInfo(res);
      } else {
        toast.error("Error fetching invoice info");
      }
    }
  }, []);

  useEffect(() => {
    if (invoiceIdSelected) {
      fetchInvoiceInfo(invoiceIdSelected);
    } else {
      setInvoiceInfo && setInvoiceInfo(null);
    }
  }, [fetchInvoiceInfo, invoiceIdSelected]);

  const tableRef = useRef<HTMLTableElement | null>(null);

  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const downloadPDF = () => {
    const input = contentRef?.current;
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight(),
      );
      pdf.save("download.pdf");
    });
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn("up", 0, 0, 0.5)}
      className="custom_table h-fit w-full"
      id="export-component"
    >
      <table ref={tableRef} className="w-full overflow-hidden">
        <thead>
          <tr>
            <th className="text-white">Creation Date</th>
            <th className="text-white">Invoice #</th>
            <th className="text-white">
              {pathName === "/sent-invoices" ? "Receiver" : "Sender"}
            </th>
            {/* <th className="text-white">Name</th> */}
            <th className="text-white">Amount</th>
            <th className="text-white">Blockchain</th>
            <th className="text-white">Status</th>
            <th
              className={`${
                pathName === "/sent-invoices" ? "table-cell" : "hidden"
              } text-white`}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {listItem?.map((item: any) => {
            let created_time =
              type === "sent"
                ? new Date(item?.created_time * 1000).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )
                : new Date(item?.created_time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
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
              <tr
                key={item.invoice_id}
                onClick={() => {
                  router.push("/invoices", {
                    pathname: "/invoices",
                    query: { invoice_id: item.invoice_id, type: type },
                  });
                }}
              >
                <td>{created_time}</td>
                <td className="max-w-[150px] whitespace-pre-wrap">
                  {String(item?.invoice_id)}
                </td>
                {/* <td>
                  {pathName === "/sent-invoices"
                    ? `${
                        item?.to_first_name !== "" && item?.to_last_name !== ""
                          ? `${String(item?.to_first_name)} ${String(
                              item?.to_last_name,
                            )}`
                          : item?.to_company !== ""
                            ? String(item?.to_company).toUpperCase()
                            : ""
                      }`
                    : `${
                        item?.from_first_name !== "" &&
                        item?.from_last_name !== ""
                          ? `${String(item?.from_first_name)} ${String(
                              item?.from_last_name,
                            )}`
                          : item?.from_company !== ""
                            ? String(item?.from_company).toUpperCase()
                            : ""
                      }`}
                </td> */}
                <td>
                  {/* {String(item?.from_first_name) !== ""
                    ? String(item?.from_first_name)
                    : String(item?.to_first_name)}{" "}
                  {String(item?.from_last_name) !== ""
                    ? String(item?.from_last_name)
                    : String(item?.to_last_name)} */}
                  {pathName === "/sent-invoices"
                    ? `${
                        item?.to_first_name !== "" && item?.to_last_name !== ""
                          ? `${String(item?.to_first_name)} ${String(
                              item?.to_last_name,
                            )}`
                          : item?.to_company !== ""
                            ? String(item?.to_company).toUpperCase()
                            : ""
                      }`
                    : `${
                        item?.from_first_name !== "" &&
                        item?.from_last_name !== ""
                          ? `${String(item?.from_first_name)} ${String(
                              item?.from_last_name,
                            )}`
                          : item?.from_company !== ""
                            ? String(item?.from_company).toUpperCase()
                            : ""
                      }`}
                </td>
                <td
                  className={`${
                    item.status === "COMPLETED"
                      ? type === "sent"
                        ? "text-[#12B347]"
                        : "text-[#D93F21]"
                      : "text-[#202124]"
                  }`}
                >
                  {item.status === "COMPLETED"
                    ? type === "sent"
                      ? "+"
                      : "-"
                    : ""}
                  {item?.currency}{" "}
                  {Number(item?.total_value) > 0.000001
                    ? Number(Number(item?.total_value).toFixed(6))
                    : `<0.000001`}
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
                <td>
                  <div
                    className={`flex h-fit w-[179px] flex-row items-center justify-start gap-[10px] rounded border-l-[1.5px] px-3 py-2`}
                    style={{
                      background: Status[`${item?.status}`].background,
                      borderLeft: `1.5px solid ${
                        Status[`${item?.status}`].border
                      }`,
                    }}
                  >
                    <Image
                      src={Status[`${item?.status}`].icon}
                      alt=""
                      width={14}
                      height={14}
                    />
                    <p className="whitespace-nowrap text-sm font-medium leading-[150%] text-text-secondary">
                      {Status[`${item?.status}`].text}
                    </p>
                  </div>
                </td>
                <td
                  className={`${
                    pathName === "/sent-invoices" ? "table-cell" : "hidden"
                  }`}
                >
                  <div className="flex flex-row items-center gap-3">
                    {ACTIONS[`${item?.status}`].map((action) => (
                      <button
                        key={action}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(e, action, item.invoice_id);
                          setInvoiceIdSelected(item.invoice_id);
                        }}
                        className="flex h-6 w-6 items-center justify-center"
                      >
                        <Image
                          src={`/images/received-invoices/${action}.svg`}
                          alt={""}
                          width={24}
                          height={24}
                        />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <CustomPopup
        className="relative h-full w-[972.5px] transform overflow-visible rounded-xl bg-white px-10 pb-8 pt-6 transition-all"
        hidePopup={hidePopup}
        setHidePopup={setHidePopup}
        setInvoiceIdSelected={setInvoiceIdSelected}
      >
        <div className="flex h-full flex-col space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold leading-6 text-[#202124]">
              Standard formats
            </p>
            <div className="flex items-center gap-3">
              <div className="group relative box-border flex h-[40px] w-[208.57px] cursor-pointer flex-row items-center gap-1 rounded border border-[#DEDEDE] bg-[#fff] px-2">
                <input
                  className="h-6 w-full text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary focus:outline-none active:outline-none "
                  type="text"
                  placeholder={STANDARDS[0]?.title}
                  defaultValue={STANDARDS[0]?.title}
                  readOnly={true}
                />
                <button className="flex h-6 w-6 cursor-pointer items-center justify-center">
                  <Image
                    src="/images/received-invoices/arrow-down.svg"
                    width={14.001}
                    height={7}
                    alt=""
                  />
                </button>

                <div className="absolute inset-0 top-[calc(100%+1px)] z-10 hidden h-fit w-full rounded bg-[#fff] shadow-[0_0_4px_0_rgba(0,0,0,0.25)] group-hover:block">
                  {STANDARDS.map((item: any, index: any) => (
                    <button
                      //   disabled={item?.title !== "ISO 19005-3"}
                      onClick={() => {
                        if (item?.title !== "ISO 19005-3") {
                          toast.info("Coming soon!", {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            // transition: Bounce,
                          });
                        }
                        // else {
                        //   setStandard(item?.title);
                        //   setFormValues((prev: any) => ({
                        //     ...prev,
                        //     standard: item?.title,
                        //   }));
                        // }
                      }}
                      key={index}
                      className={`bg-[]#fff] flex w-full cursor-pointer flex-row items-center justify-start gap-2 p-3 text-xs font-medium leading-[150%] text-text-primary hover:bg-[#FEF9EE] ${
                        item?.title !== "ISO 19005-3"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <p>{item?.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={downloadPDF}
                // onClick={() => {
                //   toast.info("Coming soon!", {
                //     position: "bottom-right",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     transition: Bounce,
                //   });
                // }}
              >
                <Image
                  src="/images/invoices/download.png"
                  width={40}
                  height={40}
                  alt=""
                />
              </button>
            </div>
          </div>

          <div ref={contentRef}>
            <ISOInvoice
              invoiceInfo={invoiceInfo}
              fetchInvoiceInfo={fetchInvoiceInfo}
            />
          </div>
        </div>
        {/* icon top & bottom background */}
        {/* 
        <Image
          src={ic_top_element}
          alt="top"
          className="absolute left-0 top-0"
        />
        <Image
          src={ic_top_element}
          alt="top"
          className="absolute bottom-[190px] right-0 rotate-180"
        /> */}
      </CustomPopup>

      {listItem?.length <= 0 && (
        <div className="flex w-full flex-col items-center justify-center">
          <Image
            src="/images/received-invoices/box.svg"
            width={320}
            height={320}
            alt=""
          />
          {/* {type === "sent" ? (
            <p className="text-center font-poppins text-base font-normal leading-6 text-text-secondary">
              There are no “Draft” invoices. <br /> You can can make invoices
              recurring by setting up the details on the invoice creation page.
            </p>
          ) : (
            <p className="text-center font-poppins text-base font-normal leading-6 text-text-secondary">
              There are no pending payments. <br /> You can start getting
              charged by sharing your business details.
            </p>
          )} */}
          {listInvoices?.items?.length === 0 && (
            <p className="text-center font-poppins text-base font-normal leading-6 text-text-secondary">
              There are no{" "}
              <span className="capitalize">
                {searchValue?.status !== "ALL"
                  ? `“${String(searchValue?.status).toLowerCase()}”`
                  : ""}
              </span>{" "}
              invoices.
              <br />
              You can can make invoices recurring by setting up the details on
              the invoice creation page.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TableComponent;
