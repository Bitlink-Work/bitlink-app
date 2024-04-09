"use client";
import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { getProfile, updateProfile } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRight.png";
import iconUpload from "@/public/images/procedure/upload.png";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import MainButton from "../button/MainButton";

const LogoUpload = ({ setStepPro, step4Data, setStep4Data }: any) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const [image, setImage] = useState<any>(false);
  const [disable, setDisable] = useState(true);
  const [logo, setLogo] = useState<any>(dataInvoice?.from_company_logo);
  const onChangeImage = async (e: any) => {
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

    const res = await invoiceServices.uploadLogo(fd).then((value) => {
      setInvoiceToLocalStorage({
        ...dataInvoice,
        from_company_logo: value?.data?.url,
      });
      return value;
    });
    if (res) {
      setLogo(res?.data?.url);
      step4Data = { ...step4Data, img: res?.data?.url };
      setStep4Data(step4Data);
      setImage(res?.data?.url);
      setDisable(false);
      localStorage.setItem("logoUrl", res?.data?.url);
    }
  };
  const handleRemoveLogo = () => {
    setLogo(null);
    setInvoiceToLocalStorage({
      ...dataInvoice,
      from_company_logo: "",
    });
    step4Data = { ...step4Data, img: null };
    setStep4Data(step4Data);
    setImage(null);
    setDisable(true);
  };

  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const router = useRouter();
  useEffect(() => {}, [step4Data]);
  useEffect(() => {
    setDisable(!image);
  }, [image]);

  const handleUpdateProfile = async () => {
    try {
      const res = await dispatch(updateProfile({ ...profile, logo: logo }));
      if (res) {
        router.push("/home?step=7");
      }
    } catch (error) {
      toast.error("Error updating profile", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
      });
    }
  };

  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[63%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-between text-[#98999A]">
            <div className="text-[16px] font-normal leading-[24px]">
              Step 4/9
            </div>
            <button
              onClick={() => {
                if (profile) {
                  localStorage.removeItem("dataInvoice");
                  localStorage.removeItem("logoUrl");
                  localStorage.removeItem("dataChain");
                  localStorage.removeItem("dataPaid");
                  router.push("/dashboard");
                }
              }}
              className="text-[14px] font-semibold leading-[21px]"
            >
              Skip the tour
            </button>
          </div>
          <div className="mt-[112.5px] text-[36px] font-semibold leading-[54px] text-[#202124]">
            Upload your company logo
          </div>
          <div
            className={`mt-[24px] flex w-full flex-col items-center ${
              image ? "gap-y-[40px]" : "gap-y-[80px]"
            }`}
          >
            <div className="w-full text-[18px] font-normal leading-[27px] text-[#4D4D50]">
              Personalize your invoices with your company logo. Your invoices
              will contain your logo which will make it easier for clients to
              identify you.
            </div>
            {logo ? (
              <div className="flex flex-col items-center justify-center gap-6">
                <div
                  // onClick={() => setImage(false)}
                  className="relative h-[240px] w-[240px]"
                >
                  <Image
                    loader={({ src }) => src}
                    src={logo}
                    alt="logo upload"
                    objectFit="cover"
                    layout="fill"
                  />
                </div>

                <button
                  onClick={handleRemoveLogo}
                  className="relative text-sm font-medium leading-[21px] text-[#D93F21]"
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <label
                htmlFor="logo"
                className="flex h-[240px] w-[240px] cursor-pointer flex-col items-center justify-center gap-4 rounded-full bg-[#E9E9E9] hover:opacity-80"
              >
                <div className="h-[48px] w-[48px]">
                  <Image src={iconUpload} alt="icon upload" objectFit="cover" />
                </div>
                <div className="text-center text-[16px] font-normal leading-[24px] text-[#444445]">
                  Add your Logo here
                </div>
                <input
                  type="file"
                  id="logo"
                  onChange={(e) => onChangeImage(e)}
                  accept="image/*"
                  className="h-0 w-0"
                />
              </label>
            )}
            <div className="mt-[28px] flex w-full items-center justify-between">
              <button
                onClick={() => {
                  router.push("/home?step=5");
                }}
                className="rounded-lg border border-[#BDC6DE] px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#444445]"
              >
                Back
              </button>
              <MainButton
                title="Continue"
                icon={arrowRight}
                onClick={() => handleUpdateProfile()}
                bold
                disabled={!Boolean(logo)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full justify-center border-l-[24px] border-r-[24px] border-t-[24px] border-solid border-[#DEDEDE] bg-[#fff] p-[60px] md:w-[47%]">
        <div className="flex h-full w-full flex-col items-center pt-[98px] md:w-[571px]">
          <div className="flex w-full justify-end px-[60px]">
            <div className="relative h-[240px] w-[240px]">
              {image ? (
                <Image
                  src={image}
                  alt="logo image"
                  objectFit="cover"
                  layout="fill"
                  objectPosition="center"
                />
              ) : (
                <div className="h-[240px] w-[240px] rounded-full bg-[#E9E9E9]"></div>
              )}
            </div>
          </div>
          <div className="mt-[160px] flex w-full flex-col items-end gap-y-[24px] pr-[60px]">
            <div className="h-[60px] w-[240px] rounded-[12px] bg-[#E9E9E9]"></div>
            <div className="h-[60px] w-[428px] rounded-[12px] bg-[#E9E9E9]"></div>
            <div className="h-[60px] w-full rounded-[12px] bg-[#E9E9E9]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogoUpload;
