import {
  getAllReceivedInvoice,
  getReceivedData,
  getReceivedInvoice,
} from "@/public/actions/invoice.action";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import {
  selectAllListReceivedInvoices,
  selectListReceivedInvoices,
  selectReceivedData,
} from "@/public/reducers/invoiceSlice";
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import MainButton from "../button/MainButton";
import Pagination from "../pagination/Pagination";
import More from "../popup-more/More";
import TableComponent from "../table/TableComponent";
import Tabs from "../tabs/Tabs";
import SessionTitle from "../title/SessionTitle";
import Filters from "./components/Filters/Filters";

type Props = {};

const ReceivedInvoices = (props: Props) => {
  const dispatch = useAppDispatch();
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
    // {
    //   id: 3,
    //   title: "Draft",
    //   count: 0,
    //   icon: "/images/invoices/draft.svg",
    //   value: "DRAFT",
    // },
    {
      id: 3,
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
  const [searchValue, setSearchValue] = useState({
    page: 1,
    page_size: 10,
    status: "ALL",
    invoice_id: "",
    created_time: 0,
    sender: "",
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
  const receivedData = useAppSelector(selectReceivedData);

  useEffect(() => {
    if (receivedData) {
      setTabs(
        tabs.map((tab: any) => {
          return { ...tab, count: receivedData[tab.value.toLowerCase()] };
        }),
      );
    }
  }, [receivedData]);

  const listInvoices = useAppSelector(selectListReceivedInvoices);
  const listAllInvoices = useAppSelector(selectAllListReceivedInvoices);
  useEffect(() => {
    dispatch(
      getReceivedInvoice({
        ...searchValue,
      }),
    );
    dispatch(getReceivedData({}));
  }, [searchValue]);

  useEffect(() => {
    if (filterValue.network === "" && filterValue.currency === "") {
      setFilterListInvoices(listInvoices);
    } else {
      const newListInvoices = listInvoices?.items?.filter((item: any) => {
        return (
          item?.chain === filterValue?.network ||
          item?.currency === filterValue?.currency
        );
      });
      setFilterListInvoices({ ...filterListInvoices, items: newListInvoices });
    }
  }, [filterValue, listInvoices]);
  const toggleSidePopup = () => {
    setIsSidePopupVisible(!isSidePopupVisible);
  };

  useEffect(() => {
    dispatch(
      getAllReceivedInvoice({
        page: 1,
        page_size: listInvoices?.total_item,
        status: searchValue?.status,
        invoice_id: searchValue?.invoice_id,
        created_time: searchValue?.created_time,
        receiver: searchValue?.sender,
      }),
    );
  }, [listInvoices, searchValue]);

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

  const handleReset = () => {
    setSearchValue({
      page: 1,
      page_size: 10,
      status: "ALL",
      invoice_id: "",
      created_time: 0,
      sender: "",
    });

    setFilterValue({
      network: "",
      currency: "",
    });
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
            <SessionTitle title="Received invoices" />
          </div>
          <p className="text-sm font-normal leading-[150%] text-text-secondary">
            ⭐️ Manage all the invoices you received from vendors
          </p>
        </div>
        <div className="flex gap-6">
          <MainButton
            title="Batch Payment"
            onClick={() => {
              toast.info("Coming soon", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                transition: Bounce,
              });
            }}
            className="h-[53px]"
          />
          <div className="mt-2 cursor-pointer" onClick={toggleSidePopup}>
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
        type="received"
        isReset={isReset}
        setIsReset={setIsReset}
        handleReset={handleReset}
        setSearchValue={setSearchValue}
        setFilterValue={setFilterValue}
      />
      <TableComponent
        searchValue={searchValue}
        listInvoices={filterListInvoices}
        type="receive"
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
          type="receive"
          toggleSidePopup={toggleSidePopup}
        />
      )}
    </div>
  );
};

export default ReceivedInvoices;
