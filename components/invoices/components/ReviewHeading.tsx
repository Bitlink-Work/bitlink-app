import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { invoiceServices } from "@/public/api/invoiceServices";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
type Props = {
  expiredDate: Date;
  setShowEditExpired: (value: boolean) => void;
};

const ReviewHeading = ({
  expiredDate,
  setShowEditExpired,
  step9Data,
  setStep9Data,
  setFromLogo,
  setValidLogo,
}: any) => {
  const currentDate = new Date();
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const [logo, setLogo] = useState<any>(null);
  useEffect(() => {
    setLogo(dataInvoice.from_company_logo);
  }, [dataInvoice.from_company_logo]);

  const handleUploadLogo = async (e: any) => {
    // setLogo(e.target.files[0]);
    e.preventDefault();
    const file = e.target.files[0];

    if (file.size > 1024 * 1024) {
      toast.error(
        "File is too large! Please select a file smaller than or equal to 1MB.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          transition: Bounce,
        },
      );
      return;
    }
    const fd = new FormData();
    fd.append("img_file", e.target.files[0]);
    const res = await invoiceServices.uploadLogo(fd);

    if (res) {
      setLogo(res?.data?.url);
      setFromLogo(res?.data?.url);
      setInvoiceToLocalStorage({
        ...dataInvoice,
        from_company_logo: res?.data?.url,
      });
      var datainvoice = localStorage.getItem("dataInvoice");
      if (datainvoice !== null) {
        var invoiceData = JSON.parse(datainvoice);

        invoiceData.from_company_logo = res?.data?.url;

        localStorage.setItem("dataInvoice", JSON.stringify(invoiceData));
      } else {
        console.error("Can't find logo!");
      }

      var newData = { ...step9Data, img: res?.data?.url };
      setStep9Data(newData);
    }
  };
  useEffect(() => {
    if (logo === "") {
      setValidLogo(false);
    } else {
      setValidLogo(true);
    }
  }, [logo]);

  return (
    <div className="flex w-full flex-row items-start justify-between">
      <div className="flex flex-col items-start gap-[18px] px-6">
        <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-lg font-semibold">
          <div className="w-1"></div>
          <h3 className=" text-[#1A1C21]">Invoice</h3>
          <p className="text-[#5E6470]"></p>
          {/* <p className="text-[#5E6470]">#AB2324-01</p> */}
          {/* <div className="flex h-6 w-6 cursor-pointer items-center justify-center">
            <Image
              src="/images/invoices/edit.svg"
              width={18}
              height={18}
              alt=""
            />
          </div> */}
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-sm font-normal">
            {/* <div className="flex h-[14px] w-[14px] cursor-pointer items-center justify-center">
              <Image
                src="/images/invoices/edit.svg"
                width={10.5}
                height={10.5}
                alt=""
              />
            </div> */}
            <p className="text-[#98999A]">
              Issued on{" "}
              {currentDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-sm font-medium">
            <div className="flex flex-row items-center gap-1 text-text-primary">
              <span>Payment due by</span>
              <button className="relative">
                <span>
                  {expiredDate !== 0
                    ? expiredDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Upon receipt"}
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowEditExpired && setShowEditExpired(true)}
              className="flex h-[12px] w-[12px] cursor-pointer items-center justify-center"
            >
              <Image
                src="/images/invoices/edit.svg"
                width={12}
                height={12}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="group relative flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-lg">
          {logo && (
            <Image src={logo ? logo : ""} alt="logo" width={90} height={90} />
          )}

          <div
            className={`absolute inset-0 h-full w-full ${
              logo && "hidden group-hover:block"
            }`}
          >
            <div
              className={`relative flex h-full w-full items-center justify-center rounded-lg bg-[#00000099]`}
            >
              <label
                className="flex h-full w-full cursor-pointer items-center justify-center"
                htmlFor="file-upload"
              >
                <input
                  id="file-upload"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  type="file"
                  onChange={(e) => handleUploadLogo(e)}
                  accept=".png, .jpg, .jpeg"
                />
                <Image
                  className="absolute h-6 w-6"
                  src="/images/invoices/camera.svg"
                  alt={""}
                  width={24}
                  height={24}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewHeading;
