import { getProfile } from "@/public/actions";
import { authService } from "@/public/api/authService";
import { kybServices } from "@/public/api/kybService";
import { kycServices } from "@/public/api/kycService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { LocalStorage } from "@/public/utils/LocalStorage";
import { EnumTypeProfile } from "@/public/utils/constants";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const ButtonConnectWallet = ({ title }: { title: string }) => {
  const dispatch = useAppDispatch();

  const profile = useAppSelector(selectProfile);

  useEffect(() => {}, []);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const getkybInfo = async () => {
    localStorage.removeItem("isSubmit");
    localStorage.setItem("isSubmit", "0");
    const res = await kybServices.getInfoKyb(profile?.user_id);

    localStorage.setItem("isSubmit", res ? "1" : "0");
  };

  const getkycInfo = async () => {
    localStorage.removeItem("isSubmit");
    localStorage.setItem("isSubmit", "0");

    const res = await kycServices.getKYC(profile?.user_id);

    localStorage.setItem("isSubmit", res ? "1" : "0");
  };

  useEffect(() => {
    if (profile?.type === EnumTypeProfile.Business) {
      getkybInfo();
    } else if (profile?.type === "FREELANCER") {
      getkycInfo();
    }
  }, [profile]);

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined") {
        if ("phantom" in window) {
          const provider = (window.phantom as any)?.solana;

          if (provider?.isPhantom) {
            const sign = await authService.getSignMessage();
            const wallet = await provider.connect();
            const encodedMessage = new TextEncoder().encode(
              sign?.data?.sign_message,
            );
            const signature = await provider.signMessage(encodedMessage);
            let decodedSignature = Buffer.from(
              signature.signature || "",
            ).toString("hex");
            const res = await authService.signIn({
              signature: decodedSignature,
              public_address: wallet.publicKey.toString(),
              nonce: sign?.data?.nonce,
              chain_id: 123124,
            });

            if (res) {
              let result: any = { ...res };
              LocalStorage.setToken(result?.access_token);

              dispatch(getProfile({}));
            }
          }
        } else {
          window.open("https://phantom.app/", "_blank");
        }
      }
    } catch (err) {
      toast.error("Connect wallet failed", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (profile) {
      localStorage.setItem(
        "step-instructions",
        JSON.stringify(profile?.is_new ? 0 : 5),
      );
    }
  }, [profile]);

  return (
    <button
      onClick={() => {
        connectWallet();
        // toast.info("Coming soon!", {
        //   position: "bottom-right",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   transition: Bounce,
        // });
      }}
      className="flex w-full items-center justify-center rounded-[6px] border-[1px] border-solid border-[#DEDEDE] px-6 py-3 hover:bg-[#DEDEDE] active:bg-[#EAEDF5]"
    >
      <div className="mr-[8px] h-[24px] w-[24px]">
        <Image
          src="/images/register/icWallet.png"
          alt="icon"
          width={24}
          height={24}
        />
      </div>
      <div className="whitespace-nowrap text-[12px] font-medium leading-[18px] text-[#000]">
        {title}
      </div>
    </button>
  );
};

export default ButtonConnectWallet;
