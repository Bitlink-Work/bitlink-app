import MainButton from "@/components/button/MainButton";
import SelectField from "@/components/fields/SelectField";
import cardid from "@/images/kyc/cardid_logo.svg";
import VietNam from "@/images/kyc/vnFlag.svg";
import { getProfile } from "@/public/actions";
import { kycServices } from "@/public/api/kycService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { nextStep, prevStep, updateKycData } from "@/public/reducers/kycSlices";
import { selectProfile } from "@/public/reducers/profileSlice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const dataCountry = [{ label: "VietNam", value: "VietNam", icon: VietNam }];
const dataCard = [
  {
    label: "ID Card ",
    value: "ID Card",
    icon: cardid,
    subTitle: "Verification your account with ID Card",
  },
];

const Address = () => {
  const router = useRouter();
  const { kycData } = useAppSelector((state) => state.kyc);
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      country: kycData?.country,
      card_type: kycData?.card_type,
    },
  });

  const dispatch = useAppDispatch();
  const [active, setActive] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [kycInfo, setKycInfo] = useState<any>();

  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data: any) => {
    dispatch(
      updateKycData({
        ...kycData,
        country: data.country,
        card_type: data.card_type,
      }),
    );

    dispatch(nextStep(3));
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
    }
  }, [kycInfo]);

  useEffect(() => {
    if (watch("country") !== "" && watch("card_type") !== "") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [watch("country"), watch("card_type")]);
  return (
    <div className="px-10">
      <div className="my-[24px]">
        <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
          ID Verification
        </div>
        <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
          Please choose the relevant sections below to provide the
          interviewer&apos;s personal details.
        </div>
      </div>

      <div className="h-[269px] w-full rounded-[12px] border border-solid border-[#DEDEDE] px-[24px]">
        <form>
          <div className="mt-8 w-full ">
            <SelectField
              visibleIcon
              readOnly={readOnly}
              data={dataCountry}
              searchPlaceholder="Search"
              hideSearch
              errorText="This field is required"
              errors={errors}
              placeholder="Select document issues country"
              formField="country"
              required
              control={control}
              setValue={setValue}
              initialValue={true}
            />
          </div>
          <div className="mt-4 w-full ">
            <SelectField
              data={dataCard}
              hideSearch
              readOnly={readOnly}
              errorText="This field is required"
              errors={errors}
              required
              placeholder="Select document type"
              formField="card_type"
              control={control}
              setValue={setValue}
              visibleIcon
              large
              initialValue={true}
            />
          </div>
        </form>

        <div className="float-right mt-6 flex  gap-4">
          <button
            onClick={() => {
              dispatch(prevStep(1));
            }}
            className="flex items-center justify-center px-[24px] py-[12px] "
          >
            <div className=" text-[14px] font-semibold leading-[21px] opacity-50">
              Back
            </div>
          </button>
          <MainButton
            title="Next"
            onClick={handleSubmit(onSubmit)}
            disabled={!active}
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
