import React, { useEffect, useRef, useState } from "react";
import close from "@/images/kyc/Close.svg";
import Image from "next/image";

const AddressDocument = ({ setShowPopup, url }: any) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      onClick={() => setShowPopup && setShowPopup(false)}
      ref={popupRef}
      style={{ top: scrollPosition }}
      className="fixed flex h-fit w-[972px] flex-col items-start gap-8 rounded-xl 
      bg-[#fff] px-10 pb-8 pt-6"
    >
      <div className="text-[24px] font-semibold leading-[36px] text-[#202124]">
        Proof of address
      </div>
      <div className="absolute right-4 top-4 cursor-pointer">
        <Image src={close} alt="close" />
      </div>
      <div className="flex w-full  flex-col">
        <iframe src={url} title="Address Document" height={600}></iframe>
      </div>
    </div>
  );
};

export default AddressDocument;
