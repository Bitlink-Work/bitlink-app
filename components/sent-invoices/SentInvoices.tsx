import {
  getAllCreatedInvoice,
  getCreatedData,
  getCreatedInvoice,
} from "@/public/actions/invoice.action";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import {
  selectAllListCreatedInvoices,
  selectCreatedData,
  selectListCreatedInvoices,
} from "@/public/reducers/invoiceSlice";
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainButton from "../button/MainButton";
import Pagination from "../pagination/Pagination";
import More from "../popup-more/More";
import Filters from "../received-invoices/components/Filters/Filters";
import TableComponent from "../table/TableComponent";
import Tabs from "../tabs/Tabs";
import SessionTitle from "../title/SessionTitle";

type Props = {
  setSelectedId: (value: any) => void;
  invoiceInfo: any;
  setInvoiceInfo?: (value: any) => void;
  setShowReminder?: (value: boolean) => void;
  setShowCheckInvoice?: (value: boolean) => void;
  setShowConfirmDelete?: (value: boolean) => void;
};

const SentInvoices = ({
  setSelectedId,
  invoiceInfo,
  setInvoiceInfo,
  setShowReminder,
  setShowCheckInvoice,
  setShowConfirmDelete,
}: Props) => {
  const [tabs, setTabs] = useState<any>([
    {
      id: 0,
      title: "All",
      count: 0,
      icon: "/images/invoices/all.svg",
      value: "ALL",
    },
    {
      id: 1,
      title: "Completed",
      count: 0,
      icon: "/images/invoices/completed.svg",
      value: "COMPLETED",
    },
    {
      id: 2,
      title: "Awaiting Payment",
      count: 0,
      icon: "/images/invoices/awaiting.svg",
      value: "AWAITING",
    },
    {
      id: 3,
      title: "Draft",
      count: 0,
      icon: "/images/invoices/draft.svg",
      value: "DRAFT",
    },
    {
      id: 4,
      title: "Overdue",
      count: 0,
      icon: "/images/invoices/overdue.svg",
      value: "OVERDUE",
    },
    // {
    //   id: 5,
    //   title: "Paid",
    //   icon: "💵",
    //   value: ''
    // },
    // {
    //   id: 6,
    //   title: "Recurring",
    //   icon: "🔁",
    //   value: ''
    // },
  ]);
  const dispatch = useAppDispatch();
  const createdData = useAppSelector(selectCreatedData);
  const [searchValue, setSearchValue] = useState({
    page: 1,
    page_size: 10,
    status: "ALL",
    invoice_id: "",
    created_time: 0,
    receiver: "",
  });
  const [filterValue, setFilterValue] = useState({
    network: "",
    currency: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState(10);
  const [isReset, setIsReset] = useState(false);
  const [filterListInvoices, setFilterListInvoices] = useState<any>([]);
  const [isSidePopupVisible, setIsSidePopupVisible] = useState(false);
  const toggleSidePopup = () => {
    setIsSidePopupVisible(!isSidePopupVisible);
  };

  useEffect(() => {
    if (createdData) {
      setTabs(
        tabs.map((tab: any) => {
          return { ...tab, count: createdData[tab.value.toLowerCase()] };
        }),
      );
    }
  }, [createdData]);

  const listInvoices = useAppSelector(selectListCreatedInvoices);
  const listAllInvoices = useAppSelector(selectAllListCreatedInvoices);
  useEffect(() => {
    dispatch(
      getCreatedInvoice({
        ...searchValue,
      }),
    );
    dispatch(getCreatedData({}));
  }, [searchValue]);

  useEffect(() => {
    dispatch(
      getAllCreatedInvoice({
        page: 1,
        page_size: listInvoices?.total_item,
        status: searchValue?.status,
        invoice_id: searchValue?.invoice_id,
        created_time: searchValue?.created_time,
        receiver: searchValue?.receiver,
      }),
    );
  }, [searchValue, listInvoices]);

  useEffect(() => {
    if (filterValue.network === "" && filterValue.currency === "") {
      setFilterListInvoices(listInvoices);
    } else {
      const newListInvoices = listAllInvoices?.items?.filter((item: any) => {
        if (filterValue?.currency !== "") {
          return (
            item?.chain === filterValue?.network &&
            item?.currency === filterValue?.currency
          );
        } else {
          return item?.chain === filterValue?.network;
        }
      });

      setFilterListInvoices({
        ...filterListInvoices,
        num_of_page: Math.ceil(newListInvoices?.length / selectedOption),
        page: 1,
        total_item: newListInvoices?.length,
        page_size: selectedOption,
        items: newListInvoices?.slice(
          (currentPage - 1) * selectedOption,
          currentPage * selectedOption,
        ),
      });
    }
  }, [filterValue, listInvoices, listAllInvoices, currentPage, selectedOption]);

  const downloadPDF = () => {
    const pdf = new jsPDF();

    // Add styling or customization here if needed
    pdf.setFontSize(16);
    pdf.text("PDF Export Example", 20, 20);

    // Get the HTML content of the component
    const element = document.getElementById("export-component");

    // Use html2canvas to convert the component to an image
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 20, 30, 150, 100);

        // Save the PDF file
        pdf.save("exported-component.pdf");
      });
    }
  };

  const router = useRouter();

  const handleReset = () => {
    setSearchValue({
      page: 1,
      page_size: 10,
      status: "ALL",
      invoice_id: "",
      created_time: 0,
      receiver: "",
    });

    setFilterValue({
      network: "",
      currency: "",
    });
    setCurrentPage(1);
    setSelectedOption(10);
    setIsReset(true);
  };

  return (
    <div className="relative h-fit w-full">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("left", 0, 0, 0.5)}
        className="flex items-center justify-between"
      >
        <div className="flex flex-col items-start justify-start gap-[6px]">
          <div className="flex flex-row items-center justify-between">
            <SessionTitle title="Sent invoices" />
          </div>
          <p className="text-sm font-normal leading-[150%] text-text-secondary">
            ⭐️ Manage all the invoices you sent to your clients
          </p>
        </div>
        <div className="flex items-center gap-6">
          <MainButton
            title="Create Invoice"
            onClick={() => router.push("/create-invoice")}
            className="h-[53px]"
          />
          <div className="mt-2 cursor-pointer " onClick={toggleSidePopup}>
            <Image
              src="/images/invoices/more.svg"
              width={40}
              height={40}
              alt=""
            />
          </div>
        </div>
      </motion.div>

      <Tabs
        tabs={tabs}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setCurrentPage={setCurrentPage}
      />
      <Filters
        type="sent"
        isReset={isReset}
        setIsReset={setIsReset}
        handleReset={handleReset}
        setSearchValue={setSearchValue}
        setFilterValue={setFilterValue}
      />
      <TableComponent
        searchValue={searchValue}
        listInvoices={filterListInvoices}
        invoiceInfo={invoiceInfo}
        setSelectedId={setSelectedId}
        setInvoiceInfo={setInvoiceInfo}
        setShowReminder={setShowReminder}
        setShowCheckInvoice={setShowCheckInvoice}
        setShowConfirmDelete={setShowConfirmDelete}
        type="sent"
      />
      {filterListInvoices && filterListInvoices?.items?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          totalItems={filterListInvoices?.items?.length}
          numOfPages={filterListInvoices?.num_of_page}
          setSearchValue={setSearchValue}
        />
      )}
      {isSidePopupVisible && (
        <More
          downloadPdf={downloadPDF}
          type="sent"
          toggleSidePopup={toggleSidePopup}
        />
      )}
    </div>
  );
};

export default SentInvoices;
