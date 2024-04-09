import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {};

const Banner = (props: Props) => {
  return (
    <div className="flex w-full flex-row gap-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("right", 0, 0, 0.5)}
        className="relative flex h-fit w-full flex-row items-start justify-between rounded-[20px] bg-text-primary px-6 py-5"
      >
        <div className="absolute right-[17px] top-1/2 z-0 flex h-[306px] w-[221px] -translate-y-1/2 items-center justify-center">
          <Image
            src="/images/dashboard/star.svg"
            width={221}
            height={306}
            alt=""
          />
        </div>
        <div className="relative flex flex-col items-start justify-between gap-[12px]">
          <p className="font-poppins text-xs font-medium leading-[150%] text-[#fff]">
            E-INVOICE PLATFORM
          </p>
          <div className="font-poppins text-2xl font-semibold leading-[150%] text-[#FFFFFF]">
            <p>Bridging Web2 and Web3 era,</p>
            <p>Let’s get you started!</p>
          </div>
          <button className="w-fit rounded-lg bg-primary px-4 py-2 font-poppins text-sm font-semibold leading-[21px] text-white hover:bg-btn-hover">
            <p>Join Now</p>
          </button>
        </div>
        <div className="relative flex h-6 w-6 cursor-pointer items-center justify-center">
          <Image
            src="/images/dashboard/close.svg"
            width={24}
            height={24}
            alt=""
          />
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("left", 0, 0, 0.5)}
        className="relative w-fit rounded-xl bg-primary p-6"
      >
        <div className="relative z-0 flex flex-col items-center justify-between gap-[15px]">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              src="/images/dashboard/chat-bot.svg"
              width={40}
              height={40}
              alt=""
            />
          </div>
          <p className="w-[287px] text-center font-poppins text-xs font-normal leading-[18px] text-white">
            Stay up to date on the newest financial trend in stock, crypto and
            foreign exchange markets
          </p>
          <button className="w-full rounded-lg bg-[#FDFCFB] px-3 py-2 font-poppins text-xs font-medium leading-[150%] text-text-primary">
            <p>Subscribe</p>
          </button>
          <div className="absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center">
            <Image
              src="/images/dashboard/close.svg"
              width={24}
              height={24}
              alt=""
            />
          </div>
        </div>
        <Image
          className="absolute left-[50%] top-[19px] z-0 -translate-x-1/2"
          src="/images/dashboard/subscribe_bg.png"
          width={246}
          height={145.45}
          alt=""
        />
      </motion.div>
    </div>
  );
};

export default Banner;
