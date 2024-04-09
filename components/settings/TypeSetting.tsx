import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { getProfile, updateProfile } from "@/public/actions";
import { useAppDispatch } from "@/public/hook/hooks";
import { EnumTypeProfile } from "@/public/utils/constants";
import Image from "next/image";
import { useEffect, useState } from "react";
import MainButton from "../button/MainButton";
import Popup from "../popup/Popup";
import SessionTitle from "../title/SessionTitle";
import SelectType from "./SelectType";

const TypeSetting = ({ profile }: any) => {
  const [showChangeType, setShowChangeType] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    setValue("email", profile?.email_google);
    setValue("first_name", profile?.first_name);
    setValue("last_name", profile?.last_name);
  }, [profile]);

  const dispatch = useAppDispatch();

  const onFormSubmit = async (data: any) => {
    await dispatch(
      updateProfile({
        ...profile,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: profile?.phone_number,
        company_name: profile?.company_name,
        country: profile?.country,
        region: profile?.region,
        city: profile?.city,
        postal_code: profile?.postal_code,
        address_line_1: profile?.address_line_1,
        address_line_2: profile?.address_line_2,
        public_address: profile?.address_line_1 + " " + profile?.address_line_2,
        tax_number: profile?.tax_number,
      }),
    ).then(async () => {
      await dispatch(getProfile({}));
    });
  };

  return (
    <div className="">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn("up", 0, 0, 0.5)}
        className="space-y-6"
      >
        <SessionTitle title="Your Type" small />
        <div className="flex h-fit w-full flex-row items-center justify-between rounded-xl border border-[#DEDEDE] bg-white px-8 pb-6 pt-8">
          <div className="flex flex-row items-center justify-center gap-6">
            <Image
              src={
                profile?.type === EnumTypeProfile.Freelancer
                  ? "/images/header/user.svg"
                  : "/images/header/business.svg"
              }
              width={profile?.type === "FREELANCER" ? 40 : 60.17}
              height={40}
              alt=""
            />
            <div className="flex flex-col items-start justify-start gap-[6px]">
              <p className="text-sm font-medium leading-[21px] text-text-primary">
                {profile?.type === EnumTypeProfile.Freelancer
                  ? "Individual"
                  : "Organization"}
              </p>
              {profile?.is_verified && (
                <p className="text-sm font-medium leading-[21px] text-[#1890FF]">
                  {profile?.type === EnumTypeProfile.Freelancer
                    ? "KYC Verified"
                    : "KYB Verified"}
                </p>
              )}
            </div>
          </div>
          <MainButton
            bold
            hideBorder
            title="Change Type"
            onClick={() => {
              setShowChangeType(true);
            }}
          />
        </div>
      </motion.div>
      <Popup showPopup={showChangeType}>
        <SelectType profile={profile} setShowChangeType={setShowChangeType} />
      </Popup>
    </div>
  );
};

export default TypeSetting;
