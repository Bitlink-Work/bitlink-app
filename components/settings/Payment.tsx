import { fadeIn, zoomIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import { useState } from "react";

import MainButton from "../button/MainButton";
import Popup from "../popup/Popup";
import SessionTitle from "../title/SessionTitle";
import PopupCreate from "./PopupCreate";
import PopupSelectPayment from "./PopupSelectPayment";

const Payment = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState("crypto");

  return (
    <div className="">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("up", 0, 0, 0.5)}
        className="flex items-center justify-between"
      >
        <SessionTitle title="Payment Methods" small />
        <MainButton
          title="Add a New Payment Method"
          bold
          hideBorder
          onClick={
            () => setShowPopup(true)
            // toast.info("Coming soon!", {
            //   position: "bottom-right",
            //   autoClose: 3000,
            //   hideProgressBar: false,
            //   closeOnClick: true,
            //   transition: Bounce,
            // })
          }
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-6 text-sm font-medium">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={zoomIn(0, 0.5)}
          className="relative w-full rounded-xl border border-[#DEDEDE] bg-white p-8"
        >
          <svg
            className="absolute right-4 top-4 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              className="fill-[#98999A] transition-all hover:fill-[#D93F21]"
              d="M20.25 6H17.25V4.125C17.25 3.29766 16.5773 2.625 15.75 2.625H8.25C7.42266 2.625 6.75 3.29766 6.75 4.125V6H3.75C3.33516 6 3 6.33516 3 6.75V7.5C3 7.60313 3.08437 7.6875 3.1875 7.6875H4.60312L5.18203 19.9453C5.21953 20.7445 5.88047 21.375 6.67969 21.375H17.3203C18.1219 21.375 18.7805 20.7469 18.818 19.9453L19.3969 7.6875H20.8125C20.9156 7.6875 21 7.60313 21 7.5V6.75C21 6.33516 20.6648 6 20.25 6ZM15.5625 6H8.4375V4.3125H15.5625V6Z"
            />
          </svg>

          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#43A048]"></div>
            <p className="mr-6 border-r border-[#DEDEDE] pl-2 pr-6 text-[#43A048]">
              Wallet Ethereum
            </p>
            <p className="text-text-primary">Phuc Ha’s Wallet 1</p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-text-primary">
              0xe597a8d46FD2429FD2720fbD734F5d6A86AB662b
            </p>
            <p className="cursor-pointer text-[#1890FF]">Edit</p>
          </div>
        </motion.div>
      </div>

      {showPopup && (
        <Popup showPopup={showPopup}>
          <PopupSelectPayment
            setShowPopup={setShowPopup}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            setShowPopupForm={setShowPopupForm}
          />
        </Popup>
      )}
      {showPopupForm && (
        <Popup showPopup={showPopupForm}>
          <PopupCreate
            selectedForm={selectedForm}
            setShowPopup={setShowPopupForm}
          />
        </Popup>
      )}
    </div>
  );
};

export default Payment;
