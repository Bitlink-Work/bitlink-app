import MainButton from "@/components/button/MainButton";
import InputField from "@/components/fields/InputField";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import iconUpload from "@/public/images/procedure/upload.png";
import { invoiceServices } from "@/public/api/invoiceServices";
import { getProfile } from "@/public/actions";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import { Bounce, toast } from "react-toastify";
import avatar from "@/images/kyc/avatar.png";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { nextStep, prevStep, updateKycData } from "@/public/reducers/kycSlices";
import success from "@/images/kyc/success.gif";
import tick from "@/images/kyc/tick.svg";
import frontCard from "@/images/kyc/front_card.svg";
import backCard from "@/images/kyc/back_card.svg";
import { kycServices } from "@/public/api/kycService";

const Selfie = () => {
  const [isImagesUploaded, setIsImagesUploaded] = useState(false);

  const { kycData } = useAppSelector((state) => state.kyc);
  const [logoFront, setLogoFront] = useState<any>(kycData?.front_card);
  const [logoBack, setLogoBack] = useState<any>(kycData?.back_card);

  const dispatch = useAppDispatch();
  const [kycInfo, setKycInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);
  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onChangeImageFront = async (e: any) => {
    const fd = new FormData();
    fd.append("img_file", e.target.files[0]);

    const res = await invoiceServices.uploadLogo(fd).then((value) => {
      return value;
    });

    if (res) {
      setLogoFront(res?.data?.url);
      dispatch(
        updateKycData({
          ...kycData,
          front_card: res?.data?.url,
        }),
      );
    }
  };
  const onChangeImageBack = async (e: any) => {
    const fd = new FormData();
    fd.append("img_file", e.target.files[0]);
    const res = await invoiceServices.uploadLogo(fd).then((value) => {
      return value;
    });
    if (res) {
      setLogoBack(res?.data?.url);
      dispatch(
        updateKycData({
          ...kycData,
          back_card: res?.data?.url,
        }),
      );
    }
  };

  useEffect(() => {
    if (logoFront && logoBack) {
      setIsImagesUploaded(true);
    } else {
      setIsImagesUploaded(false);
    }
  }, [logoFront, logoBack]);
  const handleRemoveLogoFront = () => {
    setLogoFront(null);
  };
  const handleRemoveLogoBack = () => {
    setLogoBack(null);
  };

  const getkycInfo = async () => {
    const res = await kycServices.getKYC(profile?.user_id);
    setKycInfo(res);
  };

  useEffect(() => {
    getkycInfo();
  }, [profile]);

  useEffect(() => {
    if (kycInfo) {
      setReadOnly(true);
      setLogoFront(kycInfo?.front_card);
      setLogoBack(kycInfo?.back_card);
    }
  }, [kycInfo]);

  return (
    <div className="px-10">
      <div className="my-[24px]">
        <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
          Include a photo
        </div>
        <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
          Fill in the sections inside to complete the interviewer&apos;s ID card
          section.
        </div>
      </div>

      <div
        className={` h-[448px] w-full rounded-[12px]  border border-solid border-[#DEDEDE] bg-white  px-[24px]  py-[32px]`}
      >
        <div className={``}>
          <div
            className={`${
              logoFront && logoBack ? "bg-white" : "bg-[#F4F4F4]"
            } h-[320px] rounded-lg  px-[24px] py-[16px]  `}
          >
            <div className="flex gap-4  ">
              <div className=" w-full">
                <div className="  text-center font-semibold text-[#202124]">
                  Front
                </div>
                <div
                  className={`mt-4 flex h-[200px] items-center justify-center rounded-lg ${
                    logoFront && logoBack
                      ? "bg-white"
                      : "border border-dashed border-[#BDC6DE] bg-[#FBFBFB]"
                  } `}
                  onClick={() =>
                    document?.getElementById("frontLogoInput")?.click()
                  }
                >
                  {logoFront ? (
                    <div
                      className={` ${
                        logoFront && logoBack ? "mt-6" : ""
                      } flex flex-col items-center justify-center gap-6`}
                    >
                      <div
                        // onClick={() => setImage(false)}
                        className={`relative  h-[200px] w-[400px]
                      `}
                      >
                        <Image
                          loader={({ src }) => src}
                          src={logoFront}
                          alt="logo upload"
                          className="object-contain "
                          fill
                        />
                        <Image
                          src={tick}
                          alt="logo upload"
                          className={`absolute  
                              -right-2 -top-[50px]
                          `}
                        />
                      </div>
                      <input
                        type="file"
                        id="frontLogoInput"
                        onChange={(e) => onChangeImageFront(e)}
                        className="h-0 w-0"
                        style={{ display: "none" }}
                        accept=".png, .jpg, .jpeg"
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="logo"
                      className="flex h-full w-full cursor-pointer  items-center justify-center gap-y-[32px] rounded-full  hover:opacity-80"
                    >
                      <div className="h-[140px] w-[140px]">
                        <Image
                          src={frontCard}
                          alt="icon upload"
                          objectFit="cover"
                        />
                      </div>

                      <input
                        type="file"
                        id="logo"
                        onChange={(e) => onChangeImageFront(e)}
                        className="h-0 w-0"
                        accept=".png, .jpg, .jpeg"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="w-full">
                <div className="  text-center font-semibold text-[#202124]">
                  Backside{" "}
                </div>
                <div
                  onClick={() =>
                    document?.getElementById("backLogoInput")?.click()
                  }
                  className={`mt-4 flex h-[200px] items-center justify-center rounded-lg ${
                    logoFront && logoBack
                      ? "bg-white"
                      : "border border-dashed border-[#BDC6DE] bg-[#FBFBFB]"
                  } `}
                >
                  {logoBack ? (
                    <div className="mt-6 flex flex-col items-center justify-center gap-6">
                      <div
                        // onClick={() => setImage(false)}
                        className={`relative   h-[200px]  w-[400px]
                        `}
                      >
                        <Image
                          fill
                          loader={({ src }) => src}
                          src={logoBack}
                          alt="logo upload"
                          objectFit="contain"
                        />
                        <Image
                          src={tick}
                          alt="logo upload"
                          className={`absolute  
                              -right-2 -top-[50px]
                          `}
                        />
                      </div>
                      <input
                        type="file"
                        id="backLogoInput"
                        onChange={(e) => onChangeImageBack(e)}
                        className="h-0 w-0"
                        accept=".png, .jpg, .jpeg"
                        style={{ display: "none" }}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="logo"
                      className="mt-8 flex h-full w-full cursor-pointer  items-center justify-center gap-y-[32px] rounded-full  hover:opacity-80"
                    >
                      <div className="h-[140px] w-[140px]">
                        <Image
                          src={backCard}
                          alt="icon upload"
                          objectFit="cover"
                        />
                      </div>

                      <input
                        type="file"
                        id="logo"
                        onChange={(e) => onChangeImageBack(e)}
                        accept=".png, .jpg, .jpeg"
                        className="h-0 w-0"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`float-right mt-6 flex  gap-4`}>
          <button
            onClick={() => {
              dispatch(prevStep(3));
            }}
            className="flex items-center justify-center px-[24px] py-[12px] "
          >
            <div className=" text-[14px] font-semibold leading-[21px] opacity-50">
              Back
            </div>
          </button>
          <MainButton
            disabled={!isImagesUploaded}
            title="Next"
            onClick={() => {
              if (kycInfo?.verify_image || kycData?.verify_image) {
                dispatch(nextStep(6));
              } else {
                dispatch(nextStep(5));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Selfie;
