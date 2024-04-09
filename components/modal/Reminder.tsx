import MainButton from "@/components/button/MainButton";
import { EnumTypeProfile } from "@/public/utils/constants";
import { handleCloseModal } from "@/public/utils/lib";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  invoiceInfo: any;
  setShowPopup: (value: boolean) => void;
  popupRef: any;
};

const Reminder = ({ invoiceInfo, setShowPopup, popupRef }: Props) => {
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    clearErrors,
    register,
    watch,
  } = useForm({
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const [disable, setDisable] = useState(false);
  // const [message, setMessage] = useState("");
  // const [subject, setSubject] = useState("");

  useEffect(() => {
    if (invoiceInfo) {
      setDisable(false);
      setValue(
        "subject",
        `Subject: ${
          invoiceInfo?.user_type === EnumTypeProfile.Freelancer
            ? `${String(invoiceInfo?.from_first_name)} ${String(
                invoiceInfo?.from_last_name,
              )}`
            : `${String(invoiceInfo?.from_company)}`
        } is sending you a reminder for your invoice.`,
      );
      setValue(
        "message",
        `Dear ${
          invoiceInfo?.partner_type === EnumTypeProfile.Freelancer
            ? `${String(invoiceInfo?.to_first_name)} ${String(
                invoiceInfo?.to_last_name,
              )}`
            : `${String(invoiceInfo?.to_company)}`
        },\n\nI forwarded an invoice to you on ${new Date(
          invoiceInfo?.created_time * 1000,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}.\n\nThis is a gentle reminder that the payment is expected to be settled by ${new Date(
          invoiceInfo?.expired_time * 1000,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}. Feel free to reach out if you have any inquiries.\n\nBest regards,\n${
          invoiceInfo?.user_type === EnumTypeProfile.Freelancer
            ? `${String(invoiceInfo?.from_first_name)} ${String(
                invoiceInfo?.from_last_name,
              )}`
            : `${String(invoiceInfo?.from_company)}`
        }`,
      );
    }
  }, [invoiceInfo]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [Object.keys(errors)]);

  const onSubmit = (data: any) => {
    setShowPopup && setShowPopup(false);
  };
  useEffect(() => {
    handleCloseModal(popupRef, () => {
      setShowPopup(false);
    });
  }, []);

  return (
    <div
      ref={popupRef}
      className="flex w-[800px] flex-col items-start gap-8 rounded-xl bg-[#fff] px-[60px] py-10"
    >
      <h3 className="text-2xl font-semibold leading-[150%] text-text-primary">
        Send a reminder
      </h3>
      <div className="relative h-fit w-full">
        <input
          {...register("subject", { required: true })}
          type="text"
          className="w-full rounded-[4px] border border-[#DEDEDE] bg-[#fff] p-4 text-sm font-normal leading-[150%] text-text-primary outline-none placeholder:text-text-secondary hover:outline-none focus:outline-none active:outline-none"
          placeholder=""
          onChange={(e) => {
            if (e.target.value.trim() === "") {
              setError("subject", {
                type: "required",
                message: "Subject is required",
              });
            } else {
              clearErrors("subject");
            }
          }}
          required
        />
        <p className="absolute left-0 top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
          {errors?.subject && errors?.subject?.message
            ? `${errors?.subject?.message}`
            : ""}
        </p>
      </div>
      <div className="relative h-fit w-full">
        <textarea
          {...register("message", { required: true })}
          className="w-full resize-none rounded-lg border border-[#DEDEDE] bg-[#EAEDF5] p-4 text-sm font-normal leading-[150%] text-[#444445] outline-none placeholder:text-text-secondary hover:outline-none focus:outline-none active:outline-none"
          name=""
          id=""
          cols={10}
          rows={10}
          onChange={(e) => {
            if (e.target.value.trim() === "") {
              setError("message", {
                type: "required",
                message: "Message is required",
              });
            } else {
              clearErrors("message");
            }
          }}
          required
        ></textarea>
        <p className="absolute left-0 top-[calc(100%+4px)] text-[12px] font-normal leading-[18px] text-[#ce4441]">
          {errors?.message && errors?.message?.message
            ? `${errors?.message?.message}`
            : ""}
        </p>
      </div>
      <div className="flex w-full items-center justify-between text-sm font-semibold leading-[150%]">
        <button
          onClick={() => setShowPopup && setShowPopup(false)}
          className="w-fit rounded-lg border border-[#BDC6DE] bg-[#fff] px-6 py-3 text-[#6A6A6C]"
        >
          Cancel
        </button>

        <MainButton
          disabled={disable}
          title="Send"
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit);
          }}
          bold
        />
      </div>
    </div>
  );
};

export default Reminder;
