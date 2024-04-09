import MainButton from "@/components/button/MainButton";
import { getProfile } from "@/public/actions";
import { selectProfile } from "@/public/reducers/profileSlice";
import InputField from "@/components/inputfield/InputField";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { nextStep, prevStep, updateKycData } from "@/public/reducers/kycSlices";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { kycServices } from "@/public/api/kycService";
import {
  formatDate,
  validateDob,
  validateFirstName,
  validateIDNumber,
  validateLastName,
} from "@/public/utils/lib";

const IDVerify = () => {
  const router = useRouter();
  const { kycData } = useAppSelector((state) => state.kyc);
  const [active, setActive] = useState(false);
  const [kycInfo, setKycInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idNumber: kycData?.card_number,
      firstName: kycData?.card_first_name,
      lastName: kycData?.card_last_name,
      dob: kycData?.dob,
    },
  });

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
      setValue("idNumber", kycInfo?.card_number);
      setValue("firstName", kycInfo?.card_first_name);
      setValue("lastName", kycInfo?.last_name);
      setValue("dob", formatDate(kycInfo?.dob));
    }
  }, [kycInfo]);

  const onSubmit = async (data: any) => {
    dispatch(
      updateKycData({
        ...kycData,
        card_first_name: data.firstName,
        card_last_name: data.lastName,
        card_number: data.idNumber,
        dob: data.dob,
      }),
    );

    dispatch(nextStep(4));
  };
  useEffect(() => {
    if (kycInfo) {
      setActive(true);
    } else {
      if (
        watch("firstName") !== "" &&
        watch("lastName") !== "" &&
        watch("idNumber") !== "" &&
        watch("dob") !== "" &&
        validateFirstName(watch("firstName")) &&
        validateLastName(watch("lastName")) &&
        validateDob(watch("dob")) &&
        validateIDNumber(watch("idNumber"))
      ) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [watch("dob"), watch("firstName"), watch("lastName"), watch("idNumber")]);

  return (
    <div className="px-10">
      <div className="my-[24px]">
        <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
          ID Verification
        </div>
        <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
          Fill in the sections inside to complete the interviewer&apos;s ID card
          section.
        </div>
      </div>
      <form>
        {" "}
        <div className="h-[269px] w-full rounded-[12px] border border-solid border-[#DEDEDE] px-[24px]">
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <InputField
              name={"firstName"}
              widthFull
              readOnly={readOnly}
              label="First Name"
              register={register}
              clearErrors={clearErrors}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              handleChange={(e) => setValue("firstName", e.target.value)}
              setError={setError}
              setValue={setValue}
              className=""
              placeholder="First Name"
              required
              type="text"
            />
            <InputField
              name={"lastName"}
              widthFull
              clearErrors={clearErrors}
              readOnly={readOnly}
              label="Last Name *"
              handleChange={(e) => setValue("lastName", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              pattern={/^(?!\s)(^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/}
              setError={setError}
              setValue={setValue}
              className=""
              placeholder="Last Name"
              required
              type="text"
            />
          </div>
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <InputField
              // formField="idNumber"
              // placeholder="ID Number"
              // required
              // errorText="This field is required"
              // errors={errors}
              // control={control}
              name={"idNumber"}
              widthFull
              label="ID Number"
              clearErrors={clearErrors}
              readOnly={readOnly}
              handleChange={(e) => setValue("idNumber", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              pattern={/^(?!\s+$)(^\s*$|^[0-9]*$)/}
              setError={setError}
              setValue={setValue}
              className=""
              placeholder="ID Number"
              required
              type="text"
            />

            <InputField
              // formField="dob"
              // placeholder="Date of birth"
              // control={control}
              name={"dob"}
              widthFull
              required
              readOnly={readOnly}
              label="Date of birth"
              register={register}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$)/
              }
              setError={setError}
              clearErrors={clearErrors}
              handleChange={(e) => setValue("dob", e.target.value)}
              setValue={setValue}
              className=""
              placeholder="Date of birth"
              type="date"
            />
          </div>

          <div className="float-right mt-6 flex gap-4">
            <button
              onClick={() => {
                dispatch(prevStep(2));
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
      </form>
    </div>
  );
};

export default IDVerify;
