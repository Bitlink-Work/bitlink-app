import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/pagination";
import Card from "./Card";
import Graph from "./Graph";
SwiperCore.use([Pagination]);

type Props = {};

const DATA_1 = [
  {
    title: "Paid this month",
    value: "$5.000",
    type: "CHECK",
  },
  {
    title: "To pay this month",
    value: "$5.000",
    type: "NOTI",
  },
  {
    title: "Bills to pay",
    value: "3",
    type: "WARNING",
  },
  {
    title: "Your Top Vendors",
    value: "Esol Labs",
    type: "BAG",
  },
  {
    title: "Your Top Currencies",
    value: "USDT",
    type: "COIN",
  },
];

const DATA_2 = [
  {
    title: "Received this month",
    value: "$5.000",
    type: "CHECK",
  },
  {
    title: "To received this month",
    value: "$5.000",
    type: "NOTI",
  },
  {
    title: "Invoices to get paid",
    value: "2",
    type: "WARNING",
  },
  {
    title: "Your Top Clients",
    value: "ATOM",
    type: "BAG",
  },
  {
    title: "Your Top Currencies",
    value: "ETH",
    type: "COIN",
  },
];

const Content = (props: Props) => {
  return (
    <div className="flex h-fit w-full flex-col items-start gap-6 font-poppins">
      <div className="flex flex-col items-start gap-[6px] text-sm leading-[150%]">
        <h4 className="font-semibold text-text-primary">Overview</h4>
        <p className="font-normal text-text-secondary">
          Here is the information about all your invoices.
        </p>
      </div>
      <Graph />
      <div className="flex flex-col items-start gap-[6px] text-sm leading-[150%]">
        <h4 className="font-semibold text-text-primary">Received Invoices️</h4>
        <p className="font-normal text-text-secondary">
          Invite your partners to invoice you and save time when paying them in
          crypto.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("down", 0, 0, 1)}
        className="flex flex-row items-start justify-center gap-3"
      >
        {DATA_1.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </motion.div>

      <div className="flex flex-col items-start gap-[6px] text-sm leading-[150%]">
        <h4 className="font-semibold text-text-primary">Sent Invoices️</h4>
        <p className="font-normal text-text-secondary">
          Create invoices and get paid in crypto by your clients.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("up", 0, 0, 1)}
        className="flex w-full flex-row items-start justify-center gap-3"
      >
        <Swiper slidesPerView="auto" spaceBetween={12}>
          {DATA_2.map((item, index) => (
            <SwiperSlide key={index}>
              <Card {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* {DATA_2.map((item, index) => (
          <Card key={index} {...item} />
        ))} */}
      </motion.div>
    </div>
  );
};

export default Content;
