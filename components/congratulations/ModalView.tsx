import ellipse1 from "@/images/congratulations/ellipse1.png";
import ellipse2 from "@/images/congratulations/ellipse2.png";
import ellipse3 from "@/images/congratulations/ellipse3.png";
import Image from "next/image";
import { useRouter } from "next/router";

const ModalView = ({ idInvoice, setReview, step11Data }: any) => {
  const router = useRouter();
  const currentDate = new Date();
  const handleViewInvoice = () => {
    router.push(`/invoices?invoice_id=${idInvoice}`);
  };
  return (
    <div
      onClick={() => setReview(false)}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-[701px] flex-col gap-y-[40px] overflow-hidden rounded-[12px] bg-primary px-[80px] py-[60px] text-[#4D4D50]"
      >
        <div className="text-center text-[36px] font-semibold leading-[54px] text-white">
          Payment comfirmation
        </div>
        <div className=" text-[24px] font-normal leading-[36px] text-white ">
          You have received an invoice from{" "}
          <span className="font-semibold">
            {step11Data?.address} {step11Data?.address1} for{" "}
            {step11Data?.totalAmountData} {step11Data?.invoiceCurrency?.title}.
          </span>
        </div>
        <div className=" text-[24px] font-normal leading-[36px] text-white">
          Payment is due to{" "}
          <span className="font-semibold">
            {" "}
            {currentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="text-[18px] font-normal leading-[27px] text-white">
          📌 Please note that, your invoice has been updated to be an NFT
          invoice, by this we ensure that your data cannot be altered by or
          accessed by any unauthorized party.
        </div>
        <button
          onClick={handleViewInvoice}
          className="mx-auto max-w-[165px] rounded-[8px] bg-[#FEF9EE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-text-primary"
        >
          View my invoice
        </button>
        <div className="absolute bottom-0 left-0 h-[80px] w-[80px]">
          <Image src={ellipse2} alt="ellipse1" objectFit="cover" />
        </div>
        <div className="absolute right-0 top-0 h-[870px] w-[80px]">
          <Image src={ellipse1} alt="ellipse1" objectFit="cover" />
        </div>
        <div className="absolute bottom-0 right-0 h-[136px] w-[140px]">
          <Image src={ellipse3} alt="ellipse1" objectFit="cover" />
        </div>
      </div>
    </div>
  );
};
export default ModalView;
