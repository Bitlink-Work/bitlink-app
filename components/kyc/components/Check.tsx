import MainButton from "@/components/button/MainButton";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import face from "@/public/images/kyc/face.svg";

import { getProfile } from "@/public/actions";
import { kycServices } from "@/public/api/kycService";
import { nextStep, prevStep, updateKycData } from "@/public/reducers/kycSlices";
import { selectProfile } from "@/public/reducers/profileSlice";
import Image from "next/image";
import * as React from "react";

const containerStyle = {
  display: "flex",
  position: "absolute",
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
  justifyContent: "center",
  alignItems: "center",
} as React.CSSProperties;

const buttonStyle = {
  padding: "10px 30px",
  color: "white",
  fontSize: "16px",
  borderRadius: "2px",
  backgroundColor: "#bd7dff",
  border: "1px solid #bd7dff",
  cursor: "pointer",
} as React.CSSProperties;

function loadFaceLivenessComponent(callback: () => void) {
  import("@regulaforensics/vp-frontend-face-components").then((module) => {
    callback();
  });
}

function Check() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [image, setImage] = React.useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const componentRef = React.useRef<any>(null);
  const dispatch = useAppDispatch();
  const { kycData } = useAppSelector((state) => state.kyc);

  const [readOnly, setReadOnly] = React.useState(false);
  const [kycInfo, setKycInfo] = React.useState<any>();
  const profile = useAppSelector(selectProfile);

  const fetchProfile = React.useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const getkycInfo = async () => {
    const res = await kycServices.getKYC(profile?.user_id);
    setKycInfo(res);
  };

  React.useEffect(() => {
    getkycInfo();
  }, [profile]);

  React.useEffect(() => {
    if (kycInfo) {
      setReadOnly(true);
    }
  }, [kycInfo]);

  const listener = async (data: CustomEvent<any>) => {
    if (data.detail.action === "PROCESS_FINISHED") {
      if (data.detail.data?.status === 1 && data.detail.data.response) {
        if (data.detail.data.response.status === 0) {
          var file = dataURLtoFile(
            `data:image/jpeg;base64,${data.detail.data.response.images[0]}`,
            "img.jpg",
          );
          const fd = new FormData();
          fd.append("img_file", file);
          const res = await invoiceServices.uploadLogo(fd).then((value) => {
            return value;
          });

          if (res) {
            dispatch(
              updateKycData({
                ...kycData,
                verify_image: res?.data?.url,
              }),
            );
          }

          setTimeout(function () {
            dispatch(nextStep(7));
          }, 2000);
        }
        setImage(data.detail.data.response.images[0]);
      }
    }

    if (
      data.detail?.action === "CLOSE" ||
      data.detail?.action === "RETRY_COUNTER_EXCEEDED"
    ) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && componentRef.current) {
      loadFaceLivenessComponent(() => {
        componentRef.current.settings = {
          headers: {
            Test: self.crypto.randomUUID(),
          },
          tag: self.crypto.randomUUID(),
          customization: {
            onboardingScreenStartButtonBackground: "#5b5050",
          },
        };
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const containerCurrent = containerRef.current;

    if (!containerCurrent) return;

    containerCurrent.addEventListener("face-liveness", listener);

    return () => {
      containerCurrent.removeEventListener("face-liveness", listener);
    };
  }, []);

  return (
    <div className="px-10" ref={containerRef}>
      {isOpen ? (
        <face-liveness id="face_id" ref={componentRef}></face-liveness>
      ) : (
        <div>
          <div className="my-[24px]">
            <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
              Face check
            </div>
            <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
              Face check is the process of verifying identity through facial
              recognition of an individual.
            </div>
          </div>

          <div className="flex h-[400px] w-full flex-col items-center rounded-[12px] border border-solid border-[#DEDEDE] px-[24px] py-[32px] ">
            <div className={`mb-[24px]`}>
              <div>
                {" "}
                <div className="flex items-center justify-center">
                  <Image src={face} alt="face" />
                </div>
                <div className="mt-[12px]">
                  <div className="text-center ">
                    Use the camera on your device to test the Face Liveness
                    technology.
                  </div>

                  <div className="text-center ">
                    You will need to give permission to use.
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-[24px]">
              {" "}
              <button
                onClick={() => setIsOpen(true)}
                className="flex  items-center justify-center  rounded-lg border border-solid border-[#2B4896] px-[24px] py-[12px]"
              >
                <div className="text-[14px] font-semibold leading-[21px] text-[#6A6A6C]">
                  Grant access
                </div>
              </button>
            </div>

            {/* <div>
              {" "}
              <Image
                src={`data:image/jpeg;base64,${kycData?.verify_image}`}
                alt="ffff"
                width={400}
                height={400}
              />
            </div> */}

            <div className="mb-2 flex w-full justify-end gap-4">
              <button
                onClick={() => {
                  dispatch(prevStep(4));
                }}
                className="flex items-center justify-center px-[24px] py-[12px] "
              >
                <div className=" text-[14px] font-semibold leading-[21px] opacity-50">
                  Back
                </div>
              </button>
              <MainButton
                disabled={!kycInfo?.verify_image}
                title="Next"
                onClick={() => {
                  dispatch(nextStep(7));
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Check;
