"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MainButton from "../button/MainButton";
const schema = z.object({
  walletName: z.string().trim().min(1, { message: "Enter email" }),
  network: z.string().trim().min(1, { message: "Enter company name" }),
  address: z.string().trim().min(1, { message: "Enter first name" }),
});
const ModalReceive = ({ setOpenModal, setRefundWallet }: any) => {
  const [disable, setDisable] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      walletName: "",
      network: "",
      address: "",
    },
    resolver: zodResolver(schema),
  });

  const watchAllFields = watch();
  useEffect(() => {
    const isAllFieldsFilled = Object.values(watchAllFields).every(
      (value) => value !== "",
    );

    setDisable(!isAllFieldsFilled);
  }, [watchAllFields]);
  const onSubmit = (data: any) => {
    if (data) {
      setRefundWallet(data);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-[32px] rounded-[12px] bg-[#fff] px-[60px] py-[40px] md:max-w-[800px]"
      >
        <div className="text-[24px] font-semibold leading-[36px] text-text-primary">
          How do you want to receive funds?
        </div>
        <TextField
          error={errors.walletName && true}
          {...register("walletName")}
          fullWidth
          id="outlined-error-helper-text"
          label="Wallet Name"
          helperText={errors.walletName && errors.walletName.message}
        />
        <TextField
          error={errors.network && true}
          {...register("network")}
          fullWidth
          id="outlined-error-helper-text"
          label="Payment Network"
          helperText={errors.network && errors.network.message}
        />
        <TextField
          error={errors.address && true}
          {...register("address")}
          fullWidth
          id="outlined-error-helper-text"
          label="Wallet Address/Domain ENS"
          helperText={errors.address && errors.address.message}
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            className="px-[24px] py-[12px] text-[14px] font-semibold leading-[21px] text-[#98999A]"
          >
            Cancel
          </button>
          <MainButton
            title="Save Wallet"
            bold
            disabled={disable}
            onClick={() => router.push("/home?step=10")}
          />
        </div>
      </form>
    </div>
  );
};
export default ModalReceive;
