import { kybServices } from "@/public/api/kybService";
import { kycServices } from "@/public/api/kycService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import MainButton from "../button/MainButton";

import {
  saveStep,
  updateKybData,
  updateKybFile,
} from "@/public/reducers/kybSlices";

import {
  prevStep,
  saveStepKYC,
  updateKycData,
  updateStatusStepKyc,
} from "@/public/reducers/kycSlices";
import { nextStep } from "@/public/reducers/kybSlices";

type Props = {
  setShowConfirmModal: (show: boolean) => void;
};

const ModalConfirm = ({ setShowConfirmModal }: Props) => {
  const profile = useAppSelector(selectProfile);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { kycData } = useAppSelector((state) => state.kyc);
  const { kybData } = useAppSelector((state) => state.kyb);

  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVerifyInfo = async () => {
    if (profile?.type === EnumTypeProfile.Freelancer) {
      try {
        const res = await kycServices.getKYC(profile?.user_id);
        if (res) {
          setDescription(
            "You need to wait for KYC confirmation to send this invoice.",
          );
          setIsSubmitting(true);
        }
      } catch (error) {
        console.error("Error fetching KYC:", error);
        setDescription(
          "You have successfully made the payment. Your invoice will be saved in Drafts. If you wish to send it, please verify your KYC.",
        );
        setIsSubmitting(false);
      }
    } else {
      try {
        const res = await kybServices.getInfoKyb(profile?.user_id);
        if (res) {
          setDescription(
            "You need to wait for KYB confirmation to send this invoice.",
          );
          setIsSubmitting(true);
        }
      } catch (error) {
        console.error("Error fetching KYB:", error);
        setDescription(
          "You have successfully made the payment. Your invoice will be saved in Drafts. If you wish to send it, please verify your KYB.",
        );
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    fetchVerifyInfo();
  }, []);

  return (
    <div
      onClick={(event: any) => {
        event.stopPropagation();
      }}
      className="flex h-fit w-[494px] flex-col items-start justify-start gap-8 rounded-xl bg-white px-[60px] py-10"
    >
      <h2 className="text-2xl font-semibold leading-9 text-[#202124]">
        Please {!isSubmitting ? "confirm" : "wait"}
      </h2>
      <p>
        {/* Your invoice will be saved in
        Drafts. If you wish to send it, please verify your{" "}
        <span>
          {profile?.type === EnumTypeProfile.Freelancer ? "KYC" : "KYB"}
        </span>
        . */}
        {description}
      </p>
      {!isSubmitting ? (
        <div className="grid w-full grid-cols-2 items-center gap-6">
          <button
            onClick={() => {
              toast.info("Your invoice is saved as draft!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                transition: Bounce,
              });
              setShowConfirmModal(false);
              router.push("/home?step=13");
              localStorage.removeItem("dataInvoice");
              localStorage.removeItem("logoUrl");
              localStorage.removeItem("dataChain");
              localStorage.removeItem("dataPaid");
            }}
            className="px- w-full6 cursor-pointer rounded-lg border border-[#BDC6DE] bg-transparent py-3 text-sm font-semibold leading-[21px] text-[#444445] outline-none focus:outline-none active:outline-none"
          >
            Skip
          </button>
          <MainButton
            title="Complete now"
            bold
            onClick={async () => {
              setShowConfirmModal(false);
              if (profile?.type === EnumTypeProfile.Freelancer) {
                dispatch(
                  updateKycData({
                    ...kycData,
                    first_name: "",
                    last_name: "",
                    email: "",
                    country: "",
                    card_type: "",
                    card_first_name: "",
                    card_last_name: "",
                    card_number: "",
                    dob: "",
                    front_card: "",
                    back_card: "",
                    verify_image: "",
                    verified_link: "",
                  }),
                );

                await dispatch(saveStepKYC());
              } else {
                dispatch(
                  updateKybData({
                    ...kybData,
                    company_name: "",
                    registration_number: "",
                    registered_country: "",
                    company_email: "",

                    company_website: "",
                    company_phone_number: "",
                    registered_address: "",
                    registered_person: "",

                    tax_id: "",

                    city: "",
                    postcode: "",
                    address_document: "",
                    certificate_document: "",
                    address_document_type: "",
                    certificate_document_type: "",
                    address_document_name: "",
                    certificate_document_name: "",

                    first_name: "",
                    last_name: "",
                    email: "",
                    type_number: "",
                    phone_number: "",
                    card_type: "",
                    card_first_name: "",
                    card_last_name: "",
                    dob: "",
                    representative_country: "",
                    front_card: "",
                    back_card: "",

                    verified_link: "",
                  }),
                );
                dispatch(
                  updateKybFile({
                    ...kybData,
                    address_document: {},
                    certificate_document: {},
                  }),
                );
                await dispatch(saveStep());
              }

              router.push(
                profile?.type === EnumTypeProfile.Freelancer ? "/kyc" : "/kyb",
              );
            }}
          />
        </div>
      ) : (
        <div className="w-full">
          <MainButton
            title="Next"
            className={"w-full"}
            bold
            onClick={() => {
              toast.info("Your invoice is saved as draft!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                transition: Bounce,
              });
              setShowConfirmModal(false);
              router.push("/home?step=13");
              localStorage.removeItem("dataInvoice");
              localStorage.removeItem("logoUrl");
              localStorage.removeItem("dataChain");
              localStorage.removeItem("dataPaid");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ModalConfirm;
