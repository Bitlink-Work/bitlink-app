import { useAppDispatch } from "@/public/hook/hooks";
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/pagination";

SwiperCore.use([Pagination]);
type Props = {
  tabs: any;
  searchValue: any;
  setSearchValue: (value: any) => void;
  setCurrentPage: (value: any) => void;
};

const Tabs = ({ tabs, searchValue, setSearchValue, setCurrentPage }: Props) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(searchValue?.status || "All");

  useEffect(() => {
    if (searchValue) {
      setActiveTab(searchValue?.status);
    }
  }, [searchValue]);

  // const fetchListInvoices = async (status: string) => {
  //   if (type === "sent") {
  //     dispatch(
  //       getCreatedInvoice({
  //         page: 1,
  //         page_size: 10,
  //         status: status,
  //       }),
  //     );
  //   } else {
  //     dispatch(
  //       getReceivedInvoice({
  //         page: 1,
  //         page_size: 10,
  //         status: status,
  //       }),
  //     );
  //   }
  // };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn("left", 0, 0, 0.5)}
      className="tabs my-6 flex w-full flex-row items-center justify-start gap-8 overflow-x-auto py-3"
    >
      <Swiper
        slidesPerView="auto"
        slidesPerGroup={1}
        spaceBetween={24}
        pagination={{ el: null }}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        loop={false}
        style={{ margin: 0 }}
      >
        {tabs.map((tab: any) => {
          return (
            <SwiperSlide className="custom" key={tab.id}>
              <div
                onClick={async () => {
                  setActiveTab(tab.title);
                  setSearchValue((prev: any) => {
                    return { ...prev, status: tab.value };
                  });
                  setCurrentPage(1);
                }}
                key={tab.id}
                className={` flex cursor-pointer flex-row items-center justify-center gap-2 rounded-3xl ${
                  activeTab === tab.value ? "bg-primary" : "bg-[#E9E9E9]"
                } px-5 py-3`}
              >
                <Image src={tab.icon} width={16} height={16} alt="" />
                <p
                  className={`whitespace-nowrap text-sm font-medium leading-[150%] ${
                    activeTab === tab.value ? "text-white" : "text-text-primary"
                  } `}
                >
                  {tab.title}
                </p>
                <p
                  className={`text-xs font-medium leading-[150%] ${
                    activeTab === tab.value ? "text-white" : "text-[#D93F21]"
                  } `}
                >
                  {tab.count}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </motion.div>
  );
};

export default Tabs;
