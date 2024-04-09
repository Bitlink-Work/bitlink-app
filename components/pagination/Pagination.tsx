import Image from "next/image";
import { useEffect, useState } from "react";

import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import ChevronLeft from "./components/ChevronLeft";
import ChevronRight from "./components/ChevronRight";
import First from "./components/First";
import Last from "./components/Last";

type Props = {
  totalItems: number;
  setSearchValue?: any;
  numOfPages: number;
  currentPage: number;
  setCurrentPage: (value: any) => void;
  selectedOption: number;
  setSelectedOption: (value: any) => void;
};

const Pagination = ({
  totalItems,
  setSearchValue,
  numOfPages,
  currentPage,
  setCurrentPage,
  selectedOption,
  setSelectedOption,
}: Props) => {
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (totalItems > selectedOption) {
      setTotalPages(Math.ceil(totalItems / selectedOption));
    } else {
      setTotalPages(numOfPages);
    }
  }, [numOfPages, selectedOption]);
  // const totalPages = numOfPages;
  const [isClick, setIsClick] = useState([false, false, false, false]);

  const [showDropdown, setShowDropdown] = useState(false);

  const row = [5, 10, 15, 20, 25];

  const handleOptionClick = (option: number) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (setSearchValue) {
      setSearchValue((prev: any) => {
        return { ...prev, page: currentPage, page_size: selectedOption };
      });
    }
  }, [currentPage, selectedOption]);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const renderPageNumbers = () => {
    const adjacentPageCount = 1;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - adjacentPageCount);
      const endPage = Math.min(totalPages, currentPage + adjacentPageCount);

      if (currentPage - adjacentPageCount > 3) {
        pages.push(1, "...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage + adjacentPageCount < totalPages - 1) {
        pages.push("...", totalPages);
      }
    }

    const handlePageClick = (page: number | string) => {
      if (typeof page === "number") {
        setCurrentPage(page);
      }
    };

    return pages.map((page, index) => (
      <div
        key={index}
        onClick={() => handlePageClick(page)}
        className={`flex aspect-square h-8 w-fit cursor-pointer items-center justify-center rounded-lg px-3 py-[10px] ${
          currentPage === page
            ? "bg-text-primary text-[#fff]"
            : "bg-[#fff] text-text-primary"
        }`}
      >
        <p>{page}</p>
      </div>
    ));
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn("down", 0, 0, 0.5)}
      className="sticky top-[100%] flex w-full items-center justify-between rounded-b-xl border-[0.6px]  border-[#EBEFF6] bg-[#fff] px-5 py-4 shadow-[0px_1px_3px_0px_rgba(25,33,61,0.05),0px_2px_8px_0px_rgba(25,33,61,0.04)]"
    >
      <div className="flex cursor-pointer flex-row gap-2">
        <div
          className={
            currentPage === 1
              ? "mt-1 cursor-not-allowed "
              : "mt-1 cursor-pointer"
          }
          onClick={() => {
            setIsClick([true, false, false, false]);
            setCurrentPage(1);
          }}
        >
          <First color={currentPage === 1 ? "#ABB2C2" : "#6C6C6C"} />
        </div>

        <div
          className={
            currentPage === 1
              ? "mt-1 cursor-not-allowed"
              : "mt-1 cursor-pointer"
          }
          onClick={() => {
            setIsClick([false, true, false, false]);
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          <ChevronLeft
            color={
              currentPage === 1
                ? "#ABB2C2"
                : isClick[1] === true
                  ? "#202124"
                  : "#6C6C6C"
            }
          />
        </div>

        <div className="flex flex-row gap-1">{renderPageNumbers()}</div>

        <div
          className={
            currentPage === totalPages
              ? "mt-1 cursor-not-allowed"
              : "mt-1 cursor-pointer"
          }
          onClick={() => {
            setIsClick([false, false, true, false]);
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          <ChevronRight
            color={
              currentPage === totalPages
                ? "#ABB2C2"
                : isClick[2] === true
                  ? "#202124"
                  : "#6C6C6C"
            }
          />
        </div>

        <div
          className={
            currentPage === totalPages
              ? "mt-1 cursor-not-allowed"
              : "mt-1 cursor-pointer"
          }
          onClick={() => {
            setIsClick([false, false, false, true]);

            setCurrentPage(pages.length);
          }}
        >
          <Last color={currentPage === totalPages ? "#ABB2C2" : "#6C6C6C"} />
        </div>
      </div>
      <div className="flex w-fit flex-row items-center justify-center gap-2 text-sm font-medium leading-[150%] text-text-secondary   ">
        <p className="font-normal">Rows</p>
        <div
          className="flex cursor-pointer flex-row gap-2 rounded-lg border border-[#E8E8E8] bg-[#fff] px-4 py-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <p>{selectedOption || "5"}</p>
          <Image
            src="/images/received-invoices/arrow.svg"
            width={8}
            height={5}
            alt=""
            className="text-text-secondary"
          />
        </div>

        {showDropdown && (
          <div className="absolute bottom-0 right-0 flex cursor-pointer flex-col rounded-lg border border-[#E8E8E8] bg-[#fff] p-2">
            {row.map((option) => (
              <div
                key={option}
                className="flex cursor-pointer items-center justify-center px-3 py-[10px] hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Pagination;
