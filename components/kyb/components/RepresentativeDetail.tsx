"use client";
import MainButton from "@/components/button/MainButton";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/inputfield/InputField";
import noti from "@/images/kyb/noti.svg";
import card from "@/images/kyc/card.png";
import VietNam from "@/images/kyc/vnFlag.svg";
import { getProfile } from "@/public/actions";
import { kybServices } from "@/public/api/kybService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { nextStep, prevStep, updateKybData } from "@/public/reducers/kybSlices";
import { selectProfile } from "@/public/reducers/profileSlice";
import {
  formatDate,
  validateDob,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
} from "@/public/utils/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const dataCountry = [{ label: "VietNam", value: "VietNam", icon: VietNam }];
const dataTypeNumber = [{ label: "(+84)", value: "(+84)", icon: VietNam }];
const dataCard = [{ label: "ID Card ", value: "ID Card", icon: card }];

const RepresentativeDetail = ({ setStep }: any) => {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const { step, kybData } = useAppSelector((state) => state.kyb);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const [kybInfo, setKybInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const {
    setValue,
    register,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      email: kybData?.email || "",
      first_name: kybData?.first_name || "",
      last_name: kybData?.last_name || "",
      phone_number: kybData?.phone_number || "",
      type_number: kybData?.type_number || "",

      card_type: kybData?.card_type || "",
      card_first_name: kybData?.card_first_name || "",
      card_last_name: kybData?.card_last_name || "",
      dob: kybData?.dob || "",
      representative_country: kybData?.representative_country || "",
      // card_front: kybData?.card_front || "",
      // card_back: kybData?.card_back || "",
    },
  });

  const getkybInfo = async () => {
    const res = await kybServices.getInfoKyb(profile?.user_id);
    setKybInfo(res);
  };
  useEffect(() => {
    getkybInfo();
  }, [profile]);

  useEffect(() => {
    if (kybInfo) {
      setReadOnly(true);
      setValue("email", kybInfo?.email);
      setValue("first_name", kybInfo?.first_name);
      setValue("last_name", kybInfo?.last_name);
      setValue("phone_number", kybInfo?.phone_number);
      setValue("type_number", kybInfo?.type_number);
      setValue("card_type", kybInfo?.card_type);
      setValue("card_first_name", kybInfo?.card_first_name);
      setValue("card_last_name", kybInfo?.card_last_name);
      setValue("dob", formatDate(kybInfo?.dob));
      setValue("representative_country", kybInfo?.representative_country);
    }
  }, [kybInfo]);

  const onSubmit = async (data: any) => {
    dispatch(
      updateKybData({
        ...kybData,
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
        phone_number: data?.phone_number,
        type_number: data?.type_number,
        card_type: data?.card_type,
        card_first_name: data?.card_first_name,
        card_last_name: data?.card_last_name,
        dob: data?.dob,
        representative_country: data?.representative_country,
      }),
    );

    dispatch(nextStep(3));
  };

  useEffect(() => {
    if (
      watch("first_name") !== "" &&
      watch("last_name") !== "" &&
      watch("email") !== "" &&
      watch("phone_number") !== "" &&
      watch("dob") !== "" &&
      watch("card_first_name") !== "" &&
      watch("card_last_name") !== "" &&
      validateFirstName(watch("first_name")) &&
      validateLastName(watch("last_name")) &&
      validateEmail(watch("email")) &&
      validateFirstName(watch("card_first_name")) &&
      validateLastName(watch("card_last_name")) &&
      validateDob(watch("dob")) &&
      validatePhoneNumber(watch("phone_number"))
    ) {
      // if(watch("dob") !== ""){
      //   if(validateDob(watch("dob"))){
      //     setActive(false);
      //   }
      // }
      setActive(true);
    } else {
      setActive(false);
    }
  }, [
    watch("email"),
    watch("first_name"),
    watch("last_name"),
    watch("phone_number"),
    watch("card_first_name"),
    watch("card_last_name"),
    watch("dob"),
  ]);

  return (
    <div>
      <div className="mb-[24px]">
        <div className="text-[16px] font-medium leading-[24px] text-[#202124]">
          Provide data about the Representatives
        </div>
        {/* <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#6A6A6C]">
          Fill in the parts inside completing the interviewer&apos;s personal
        </div> */}
      </div>
      <div className="h-fit w-full rounded-[12px] border-[1px]  border-[#DEDEDE] bg-white px-[24px] py-[32px]">
        <form>
          <div className=" w-full ">
            <div className="h-[89px] w-full rounded bg-[#E6F7FF] p-[16px]">
              <div className="flex items-center gap-2">
                <Image src={noti} alt="noti" />
                <div className="text-[14px] font-semibold leading-[21px] text-[#202124]">
                  Enter information about the company&apos;s representatives
                </div>
              </div>
              <div className="mt-2 text-[14px] font-normal leading-[21px] text-[#202124]">
                You can add several individuals with representative powers.
              </div>
            </div>
          </div>
          <div className="mt-4 grid w-full grid-cols-2 gap-4">
            <InputField
              name={"first_name"}
              widthFull
              readOnly={readOnly}
              label="First Name *"
              handleChange={(e) => {
                const rex = new RegExp(
                  /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/,
                );
                if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                  setValue(
                    "first_name",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("first_name", e.target.value);
                  clearErrors("first_name");
                }
              }}
              register={register}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="First Name *"
              required
              type="text"
            />
            <InputField
              name={"last_name"}
              widthFull
              readOnly={readOnly}
              label="Last Name *"
              handleChange={(e) => setValue("last_name", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Last Name *"
              required
              type="text"
            />
          </div>
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <InputField
              name={"email"}
              widthFull
              readOnly={readOnly}
              label="Email *"
              handleChange={(e) => {
                let rex = new RegExp(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                );
                if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                  setValue("email", e.target.value);
                  setError("email", {
                    message: "Invalid email",
                  });
                } else {
                  setValue("email", e.target.value);
                  clearErrors("email");
                }
              }}
              pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
              register={register}
              errors={errors}
              watch={watch}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Email *"
              required
              type="text"
            />
            <div className="flex w-full ">
              <SelectField
                data={dataTypeNumber}
                hideSearch
                readOnly={readOnly}
                formField="type_number"
                required
                errorText="This field is required"
                control={control}
                setValue={setValue}
                className="w-[144px]"
                visibleIcon={true}
              />
              <div className="flex-1">
                <InputField
                  name={"phone_number"}
                  widthFull
                  readOnly={readOnly}
                  label="Phone Number *"
                  handleChange={(e) => setValue("phone_number", e.target.value)}
                  register={register}
                  errors={errors}
                  watch={watch}
                  pattern={/^(?!\s+$)(^\s*$|^[0-9\+]{1,}[0-9\-]{3,15}$)/}
                  setError={setError}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  className=""
                  placeholder="Phone Number *"
                  required
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <SelectField
              data={dataCard}
              hideSearch
              readOnly={readOnly}
              errorText="This field is required"
              errors={errors}
              required
              placeholder="Select document type *"
              formField="card_type"
              control={control}
              visibleIcon
              setValue={setValue}
            />
            <InputField
              name={"card_first_name"}
              widthFull
              readOnly={readOnly}
              label="Card First Name"
              handleChange={(e) => {
                const rex = new RegExp(
                  /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/,
                );
                if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                  setValue(
                    "card_first_name",
                    e.target.value.replace(/^\s+|\s+$/gm, ""),
                  );
                } else {
                  setValue("card_first_name", e.target.value);
                  clearErrors("card_first_name");
                }
              }}
              register={register}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              required
              className=""
              placeholder="Card First Name *"
              type="text"
            />
          </div>
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <InputField
              name={"card_last_name"}
              widthFull
              readOnly={readOnly}
              label="Card Last Name"
              handleChange={(e) => setValue("card_last_name", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              pattern={
                /^(?!\s+$)(^\s*$|^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
              }
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Card Last Name *"
              required
              type="text"
            />
            <InputField
              name={"dob"}
              widthFull
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
              required
              className=""
              placeholder="Date of birth *"
              type="date"
            />
          </div>
          <div className="mt-8 w-full ">
            <SelectField
              data={dataCountry}
              hideSearch
              readOnly={readOnly}
              placeholder="Country *"
              formField="representative_country"
              control={control}
              setValue={setValue}
              required
              visibleIcon
            />
          </div>
          {/* <div className="mt-4  flex  h-[280px] w-full  flex-col items-center gap-4 rounded-lg bg-[#BDC6DE3D] px-[24px] py-[24px] ">
            <div className="text-[24px] font-semibold leading-[36px] text-[#2B4896]">
              Identity verification
            </div>
            <div className="text-[16px] font-normal leading-[24px] text-[#2B4896]">
              This applicant has to go through Identity check
            </div>
            <button className="flex h-[56px] w-[200px] items-center justify-center rounded-[32px] bg-[#FFFFFF] px-[24px] py-[16px]">
              <div className="text-[14px] font-semibold leading-[21px] text-[#274289] ">
                Start verification now
              </div>
            </button>
            <div className="mt-4 flex gap-3">
              <div className="flex items-center gap-1">
                <Image src={send} alt="send" />
                <div>Send link via email</div>
              </div>
              <div className="h-[24px] border border-solid border-[#BDC6DE]"></div>
              <div className="flex items-center gap-1">
                <Image src={copy} alt="copy" />
                <div>Copy link</div>
              </div>
            </div>
          </div> */}
        </form>
        <div className="mb-6 mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              dispatch(prevStep(1));
            }}
            className="flex items-center justify-center px-[24px] py-[12px] "
          >
            <div className=" text-[14px] font-semibold leading-[21px] text-[rgba(32,33,36,1)] opacity-50">
              Back
            </div>
          </button>

          <MainButton
            onClick={handleSubmit(onSubmit)}
            title="Next"
            disabled={!active}
          />
        </div>
      </div>
    </div>
  );
};

export default RepresentativeDetail;
