"use client";
import { invoiceServices } from "@/public/api/invoiceServices";
import Image from "next/image";
import { useEffect } from "react";
type Props = {
  expiredDate: any;
  setShowEditExpired: (value: boolean) => void;
  edit?: boolean;
  formValues: any;
  deadline?: number;
  setFormValues: (value: any) => void;
};

const Heading = ({
  expiredDate,
  setShowEditExpired,
  edit,
  formValues,
  deadline,
  setFormValues,
}: Props) => {
  const currentDate = new Date();

  const handleUploadLogo = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    if (fd) {
      fd.append("img_file", e.target.files[0]);
      const res = await invoiceServices.uploadLogo(fd);
      if (res) {
        setFormValues({ ...formValues, from_company_logo: res?.data?.url });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      var dataInvoice = JSON.parse(localStorage.getItem("dataInvoice") as any);
      setFormValues({
        ...formValues,
        from_company_logo: dataInvoice?.from_company_logo,
      });
    }
  }, []);

  return (
    <div className="flex w-full flex-row items-start justify-between px-6">
      <div className="flex flex-col items-start gap-[18px]">
        <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-lg font-semibold">
          <h3 className=" text-[#1A1C21]">Invoice</h3>
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="leading-[150%} flex flex-row items-center justify-center  gap-[6px] text-sm font-normal">
            <p className="text-[#98999A]">
              Issued on{" "}
              {edit
                ? new Date(
                    Number(formValues?.created_time) * 1000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : currentDate.toLocaleDateString("en-US", {
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
                  {(deadline === null || (deadline && deadline > 100000))
                    ? "Upon receipt"
                    : expiredDate
                      ? expiredDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : currentDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowEditExpired && setShowEditExpired(true)}
              className="flex h-[14px] w-[14px] cursor-pointer items-center justify-center"
            >
              <Image
                src="/images/invoices/edit.svg"
                width={14}
                height={14}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[90px] w-[90px] items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 h-full w-full `}>
          <div
            className={`relative flex h-full w-full items-center justify-center  ${
              formValues.from_company_logo ? "bg-transparent" : "bg-[#00000099]"
            } `}
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
              {formValues.from_company_logo ? (
                <>
                  <Image
                    loader={({ src }) => src}
                    src={
                      formValues.from_company_logo
                        ? formValues.from_company_logo
                        : ""
                    }
                    alt="logo"
                    width={90}
                    height={90}
                  />
                  <div
                    className={`absolute inset-0 hidden h-full w-full items-center justify-center bg-[#00000099] group-hover:flex`}
                  >
                    <Image
                      className="absolute h-6 w-6"
                      src="/images/invoices/camera.svg"
                      alt={""}
                      width={24}
                      height={24}
                    />
                  </div>
                </>
              ) : (
                <Image
                  className="absolute h-6 w-6"
                  src="/images/invoices/camera.svg"
                  alt={""}
                  width={24}
                  height={24}
                />
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
