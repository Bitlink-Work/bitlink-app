"use client";
import ConfirmKYC from "@/components/kyc/components/ConfirmKYC";
import Popup from "@/components/popup/Popup";
import eye from "@/images/kyb/eye.svg";
import card from "@/images/kyc/cardid_logo.svg";
import VietNam from "@/images/kyc/vnFlag.svg";
import { getProfile } from "@/public/actions";
import { kybServices } from "@/public/api/kybService";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";

import MainButton from "@/components/button/MainButton";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/inputfield/InputField";
import { prevStep, updateKybData } from "@/public/reducers/kybSlices";
import {
  validateAddress,
  validateCompanyName,
  validateDob,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validateRegistrationNumber,
  validateTaxID,
  validateWebsite,
  validatepostCode,
} from "@/public/utils/lib";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AddressDocument from "./AddressDocument";
import CertificateDocument from "./CertificateDocument";

const schema = yup.object({
  company_name: yup.string().required(),
  registration_number: yup.string().required(),
  registered_country: yup.string().required(),

  company_email: yup.string().required(),
  company_website: yup.string().required(),
  company_phone_number: yup.string().required(),
  registered_address: yup.string().required(),
  registered_person: yup.string().required(),
  tax_id: yup.string().required(),
  city: yup.string().required(),
  postcode: yup.string().required(),

  first_name: yup.string().required(),
  last_name: yup.string().required(),
  type_number: yup.string().required(),
  card_type: yup.string().required(),
  email: yup.string().required(),
  phone_number: yup.string().required(),
  card_first_name: yup.string().required(),
  card_last_name: yup.string().required(),
  dob: yup.string().required(),
  representative_country: yup.string().required(),
  address_document_type: yup.string().required(),
  certificate_document_type: yup.string().required(),
  address_document: yup.string().required(),
  certificate_document: yup.string().required(),
});

interface IReview {
  company_name: string;
  registration_number: string;
  registered_country: string;
  first_name: string;
  last_name: string;
  address_document_type: string;
  certificate_document_type: string;

  company_email: string;
  company_website: string;
  company_phone_number: string;
  registered_address: string;
  registered_person: string;
  tax_id: string;
  city: string;
  postcode: string;
  type_number: string;
  card_type: string;
  email: string;
  phone_number: string;
  card_first_name: string;
  card_last_name: string;
  dob: string;
  representative_country: string;
  address_document: string;
  certificate_document: string;
}
const dataCountry = [{ label: "VietNam", value: "VietNam", icon: VietNam }];
const dataTypeNumber = [{ label: "(+84)", value: "(+84)", icon: VietNam }];
const dataCard = [{ label: "ID Card ", value: "ID Card", icon: card }];

function KYBForm() {
  const [showPopupConfirm, setShowPopupConfirm] = useState(false);
  const [showPopupAddress, setShowPopupAddress] = useState(false);
  const [showPopupCertificate, setShowPopupCertificate] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { kybData } = useAppSelector((state) => state.kyb);
  const [isEdit, setIsEdit] = useState(false);
  const profile = useAppSelector(selectProfile);

  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      dispatch(
        updateKybData({
          ...kybData,
          verified_link: `https://admin-stag.bitlink.work/kyb/${profile?.user_id}`,
        }),
      );
    }
  }, [profile]);

  const [kybInfo, setKybInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<IReview>({
    resolver: yupResolver(schema),
  });

  const getkybInfo = async () => {
    const res = await kybServices.getInfoKyb(profile?.user_id);
    setKybInfo(res);
  };
  const [active, setActive] = useState(false);
  useEffect(() => {
    getkybInfo();
  }, [profile]);

  useEffect(() => {
    if (kybInfo) {
      setReadOnly(true);
      setValue("company_name", kybInfo?.company_name);
      setValue("registration_number", kybInfo?.registration_number);
      setValue("registered_country", kybInfo?.registered_country);
      setValue("first_name", kybInfo?.first_name);
      setValue("last_name", kybInfo?.last_name);
      setValue("company_email", kybInfo?.company_email);
      setValue("company_website", kybInfo?.company_website);
      setValue("company_phone_number", kybInfo?.company_phone_number);
      setValue("registered_address", kybInfo?.registered_address);
      setValue("registered_person", kybInfo?.registered_person);
      setValue("tax_id", kybInfo?.tax_id);
      setValue("city", kybInfo?.city);
      setValue("postcode", kybInfo?.postcode);
      setValue("address_document_type", kybInfo?.address_document_type);
      setValue("certificate_document_type", kybInfo?.certificate_document_type);
      setValue("address_document", kybInfo?.address_document);
      setValue("certificate_document", kybInfo?.certificate_document);
    }
  }, [kybInfo]);

  const onSubmit = handleSubmit((data: any) => {
    dispatch(
      updateKybData({
        ...kybData,
        company_name: data?.company_name,
        registration_number: data?.registration_number,
        registered_country: data?.registered_country,
        first_name: data?.first_name,
        last_name: data?.last_name,
        company_email: data?.company_email,
        last_company_websitename: data?.company_website,
        company_phone_number: data?.company_phone_number,
        registered_address: data?.registered_address,
        registered_person: data?.registered_person,
        type_number: data?.type_number,
        tax_id: data?.tax_id,
        city: data?.city,
        postcode: data?.postcode,
        representative_country: data?.representative_country,
        card_first_name: data?.card_first_name,
        card_last_name: data?.card_last_name,
        phone_number: data?.phone_number,
        email: data?.email,
        card_type: data?.card_type,
      }),
    );
  });

  const company_name = watch("company_name");
  const registration_number = watch("registration_number");
  const company_email = watch("company_email");
  const company_website = watch("company_website");
  const company_phone_number = watch("company_phone_number");
  const registered_address = watch("registered_address");
  const registered_person = watch("registered_person");
  const tax_id = watch("tax_id");
  const city = watch("city");
  const postcode = watch("postcode");

  const first_name = watch("first_name");
  const last_name = watch("last_name");
  const type_number = watch("type_number");
  const card_type = watch("card_type");
  const email = watch("email");
  const phone_number = watch("phone_number");
  const card_first_name = watch("card_first_name");
  const card_last_name = watch("card_last_name");
  const representative_country = watch("representative_country");

  const dob = watch("dob");
  const registered_country = watch("registered_country");
  const certificate_document_type = watch("certificate_document_type");
  const address_document_type = watch("address_document_type");

  useEffect(() => {
    if (isEdit) {
      setValue("company_name", company_name || kybData?.company_name);
      setValue(
        "registration_number",
        registration_number || kybData?.registration_number,
      );
      setValue("first_name", first_name || kybData?.first_name);
      setValue("last_name", last_name || kybData?.last_name);
      setValue(
        "registered_country",
        registered_country || kybData?.registered_country,
      );
      setValue("company_email", company_email || kybData?.company_email);
      setValue("company_website", company_website || kybData?.company_website);
      setValue(
        "company_phone_number",
        company_phone_number || kybData?.company_phone_number,
      );
      setValue(
        "registered_address",
        registered_address || kybData?.registered_address,
      );
      setValue(
        "registered_person",
        registered_person || kybData?.registered_person,
      );
      setValue("tax_id", tax_id || kybData?.tax_id);
      setValue("city", city || kybData?.city);
      setValue("postcode", postcode || kybData?.postcode);
      setValue("type_number", type_number || kybData?.type_number);
      setValue("card_type", card_type || kybData?.card_type);
      setValue("email", email || kybData?.email);
      setValue("phone_number", phone_number || kybData?.phone_number);
      setValue("card_first_name", card_first_name || kybData?.card_first_name);
      setValue("card_last_name", card_last_name || kybData?.card_last_name);
      setValue("dob", dob || kybData?.dob);
      setValue(
        "representative_country",
        representative_country || kybData?.registered_country,
      );
    }
  }, [
    isEdit,
    kybData?.company_name,
    kybData?.first_name,
    kybData?.last_name,
    kybData?.registration_number,
    kybData?.registered_country,
    kybData?.company_email,
    kybData?.company_website,
    kybData?.company_phone_number,
    kybData?.registered_address,
    kybData?.registered_person,
    kybData?.tax_id,
    kybData?.city,
    kybData?.postcode,
    kybData?.card_first_name,
    kybData?.card_last_name,
    kybData?.card_type,
    kybData?.dob,
    kybData?.registered_country,
    kybData?.type_number,
    kybData?.phone_number,
    kybData?.email,
    setValue,
  ]);

  useEffect(() => {
    if (kybInfo) {
      setActive(true);
    } else {
      if (isEdit) {
        if (
          watch("first_name") !== "" &&
          watch("last_name") !== "" &&
          watch("company_name") !== "" &&
          watch("dob") !== "" &&
          watch("email") !== "" &&
          watch("registration_number") !== "" &&
          watch("company_email") !== "" &&
          watch("company_website") !== "" &&
          watch("company_phone_number") !== "" &&
          watch("registered_address") !== "" &&
          watch("registered_person") !== "" &&
          watch("tax_id") !== "" &&
          watch("city") !== "" &&
          watch("postcode") !== "" &&
          watch("card_first_name") !== "" &&
          watch("card_last_name") !== "" &&
          watch("phone_number") !== "" &&
          validateFirstName(watch("first_name")) &&
          validateLastName(watch("last_name")) &&
          validateDob(watch("dob")) &&
          validateEmail(watch("email")) &&
          validateCompanyName(watch("company_name")) &&
          validateRegistrationNumber(watch("registration_number")) &&
          validateEmail(watch("company_email")) &&
          validateLastName(watch("registered_person")) &&
          validateWebsite(watch("company_website")) &&
          validatePhoneNumber(watch("company_phone_number")) &&
          validateAddress(watch("registered_address")) &&
          validateTaxID(watch("tax_id")) &&
          validateAddress(watch("city")) &&
          validatepostCode(watch("postcode")) &&
          validateFirstName(watch("card_first_name")) &&
          validateLastName(watch("card_last_name")) &&
          validatePhoneNumber(watch("phone_number"))
        ) {
          setActive(true);
        } else {
          setActive(false);
        }
      }
    }
  }, [
    isEdit,
    kybInfo,
    watch,
    watch("first_name"),
    watch("last_name"),
    watch("company_name"),
    watch("dob"),
    watch("email"),
    watch("registration_number"),
    watch("company_email"),
    watch("company_website"),
    watch("company_phone_number"),
    watch("registered_address"),
    watch("registered_person"),
    watch("tax_id"),
    watch("city"),
    watch("postcode"),
    watch("card_first_name"),
    watch("card_last_name"),
    watch("phone_number"),
  ]);

  return (
    <>
      <div className="mt-[24px] h-[452px] w-full">
        <div className="font-poppins text-base font-medium leading-6 text-[#202124]">
          Review your information
        </div>
        <div
          className={`mt-6 ${
            isEdit ? "h-[1200px]" : "h-[1030px]"
          } rounded-xl border px-6 py-8`}
        >
          <div className="flex items-center gap-3 rounded bg-[#E6F7FF] p-4">
            <Image src="/icon/icon-info.svg" width={24} height={24} alt="" />
            <div>
              Please check the information below to make sure everything is
              correct.
            </div>
          </div>

          <div className="mt-6 h-[191px] w-full">
            <div className="flex items-center justify-between">
              <div className="font-poppins text-[18px] font-medium leading-[27px] text-[#202124]">
                Information review
              </div>
              {isEdit ? (
                <MainButton
                  disabled={!active}
                  title={"Save"}
                  className="flex items-center gap-[6px]"
                  onClick={() => {
                    onSubmit();
                    setIsEdit(false);
                  }}
                ></MainButton>
              ) : (
                <div
                  className={`flex items-center gap-[6px] ${
                    kybInfo ? "hidden" : ""
                  }`}
                  onClick={() => setIsEdit(true)}
                >
                  <Image
                    src="/icon/icon-edit.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                  <span className="cursor-pointer font-poppins text-base font-normal leading-6 text-[#2B4896]">
                    Edit
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-44">
              <div className="">
                <div className="mt-6 text-center text-[14px] font-semibold leading-[21px] text-[#202124]">
                  Company Information
                </div>
                {isEdit ? (
                  <div className="flex flex-col gap-2">
                    <div className="mt-6 flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Company Name
                      </div>
                      <InputField
                        name={"company_name"}
                        widthFit
                        label="Company Name "
                        required
                        readOnly={readOnly}
                        handleChange={(e) =>
                          setValue("company_name", e.target.value)
                        }
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={
                          /^(?!\s)(^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
                        }
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Registration Number
                      </div>
                      <InputField
                        name={"registration_number"}
                        widthFit
                        readOnly={readOnly}
                        required
                        label="Registration Number"
                        handleChange={(e) =>
                          setValue("registration_number", e.target.value)
                        }
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={/^\s*\d{6,15}\s*$/}
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Registered Country
                      </div>
                      <SelectField
                        widthFit
                        data={dataCountry}
                        readOnly={readOnly}
                        visibleIcon
                        hideSearch
                        formField="registered_country"
                        required
                        errorText="This field is required"
                        errors={errors}
                        control={control}
                        setValue={setValue}
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Company Email
                      </div>
                      <InputField
                        name={"company_email"}
                        widthFit
                        readOnly={readOnly}
                        label="Company Email "
                        handleChange={(e) =>
                          setValue("company_email", e.target.value)
                        }
                        register={register}
                        required
                        errors={errors}
                        watch={watch}
                        pattern={
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/
                        }
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Company website
                      </div>
                      <InputField
                        name={"company_website"}
                        widthFit
                        readOnly={readOnly}
                        label="Company Website"
                        handleChange={(e) =>
                          setValue("company_website", e.target.value)
                        }
                        register={register}
                        required
                        errors={errors}
                        watch={watch}
                        pattern={
                          /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
                        }
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Company Phone Number
                      </div>
                      <InputField
                        name={"company_phone_number"}
                        widthFit
                        readOnly={readOnly}
                        label="Company Phone Number"
                        required
                        handleChange={(e) =>
                          setValue("company_phone_number", e.target.value)
                        }
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={/^(?!\s+$)(^\s*$|^[0-9\+]{1,}[0-9\-]{3,15}$)/}
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Registered Address
                      </div>
                      <InputField
                        name={"registered_address"}
                        widthFit
                        readOnly={readOnly}
                        label="Registered Address"
                        required
                        handleChange={(e) =>
                          setValue("registered_address", e.target.value)
                        }
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={/^(?!\s)([a-zA-Z0-9\s,'.-]+)$/}
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Registered Person
                      </div>
                      <InputField
                        name={"registered_person"}
                        widthFit
                        readOnly={readOnly}
                        label="Registered Person"
                        required
                        handleChange={(e) =>
                          setValue("registered_person", e.target.value)
                        }
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
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Tax ID
                      </div>
                      <InputField
                        name={"tax_id"}
                        readOnly={readOnly}
                        widthFit
                        label="Tax ID"
                        required
                        handleChange={(e) => setValue("tax_id", e.target.value)}
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={/^(?!\s+$)(^\s*$|^[a-zA-Z0-9]{10,15}$)/}
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        City
                      </div>
                      <InputField
                        name={"city"}
                        widthFit
                        readOnly={readOnly}
                        required
                        label="City"
                        handleChange={(e) => setValue("city", e.target.value)}
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={/^(?!\s)([a-zA-Z0-9\s,'.-]+)$/}
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Postcode
                      </div>
                      <InputField
                        name={"postcode"}
                        widthFit
                        readOnly={readOnly}
                        label="Post code "
                        required
                        handleChange={(e) =>
                          setValue("postcode", e.target.value)
                        }
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={
                          /^(?!\s+$)(^\s*$|[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$)/i
                        }
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        type="text"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="mt-6 flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Company Name
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {company_name === undefined
                            ? kybData?.company_name
                            : company_name}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Registration Number
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {registration_number === undefined
                            ? kybData?.registration_number
                            : registration_number}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Registered Country
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {registered_country === undefined
                            ? kybData?.registered_country
                            : registered_country}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Company Email
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {company_email === undefined
                            ? kybData?.company_email
                            : company_email}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Company website
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {company_website === undefined
                            ? kybData?.company_website
                            : company_website}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Company Phone Number
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {company_phone_number === undefined
                            ? kybData?.company_phone_number
                            : company_phone_number}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Registered Address
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {registered_address === undefined
                            ? kybData?.registered_address
                            : registered_address}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Registered Person
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {registered_person === undefined
                            ? kybData?.registered_person
                            : registered_person}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Tax ID
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {tax_id === undefined ? kybData?.tax_id : tax_id}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          City
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {city === undefined ? kybData?.city : city}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Postcode
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {postcode === undefined
                            ? kybData?.postcode
                            : postcode}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Address Document Type
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                            {address_document_type === undefined
                              ? kybData?.address_document_type
                              : address_document_type}{" "}
                          </div>
                          <div
                            onClick={() => {
                              setShowPopupAddress(true);
                            }}
                          >
                            <Image src={eye} alt="eye" />
                          </div>
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Certificate Document Type
                        </div>
                        <div className="flex items-center gap-2 ">
                          <div className="text-right font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                            {certificate_document_type === undefined
                              ? kybData?.certificate_document_type
                              : certificate_document_type}{" "}
                          </div>

                          <div
                            onClick={() => {
                              setShowPopupCertificate(true);
                            }}
                          >
                            <Image src={eye} alt="eye" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="">
                <div className="mt-6 text-center text-[14px] font-semibold leading-[21px] text-[#202124]">
                  Representative Information
                </div>
                {isEdit ? (
                  <div className="flex flex-col gap-2">
                    <div className="mt-6 flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        First Name
                      </div>
                      <InputField
                        name={"first_name"}
                        widthFit
                        readOnly={readOnly}
                        label="First Name *"
                        handleChange={(e) =>
                          setValue("first_name", e.target.value)
                        }
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
                        required
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Last Name
                      </div>
                      <InputField
                        name={"last_name"}
                        widthFit
                        readOnly={readOnly}
                        label="Last Name *"
                        handleChange={(e) =>
                          setValue("last_name", e.target.value)
                        }
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
                        required
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Email
                      </div>
                      <InputField
                        name={"email"}
                        widthFit
                        readOnly={readOnly}
                        label="Email *"
                        handleChange={(e) => {
                          let rex = new RegExp(
                            /^(?!\s+$)(^\s*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/,
                          );
                          if (
                            !rex.test(e.target.value) ||
                            e.target.value.trim() === ""
                          ) {
                            setValue("email", e.target.value);
                            setError("email", {
                              message: "Invalid email",
                            });
                          } else {
                            setValue("email", e.target.value);
                            clearErrors("email");
                          }
                        }}
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={
                          /^(?!\s+$)(^\s*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/
                        }
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        required
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Type Number
                      </div>
                      <SelectField
                        widthFit
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
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Phone Number
                      </div>
                      <InputField
                        name={"phone_number"}
                        widthFit
                        readOnly={readOnly}
                        label="Phone Number *"
                        handleChange={(e) =>
                          setValue("phone_number", e.target.value)
                        }
                        register={register}
                        errors={errors}
                        watch={watch}
                        pattern={/^(?!\s+$)(^\s*$|^[0-9\+]{1,}[0-9\-]{3,15}$)/}
                        setError={setError}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        className=""
                        required
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Card Type
                      </div>
                      <SelectField
                        widthFit
                        data={dataCard}
                        hideSearch
                        readOnly={readOnly}
                        errorText="This field is required"
                        errors={errors}
                        required
                        formField="card_type"
                        control={control}
                        visibleIcon
                        setValue={setValue}
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Card First Name
                      </div>
                      <InputField
                        name={"card_first_name"}
                        widthFit
                        readOnly={readOnly}
                        label="Card First Name"
                        handleChange={(e) =>
                          setValue("card_first_name", e.target.value)
                        }
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
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Card Last Name
                      </div>
                      <InputField
                        name={"card_last_name"}
                        widthFit
                        readOnly={readOnly}
                        label="Card Last Name"
                        handleChange={(e) =>
                          setValue("card_last_name", e.target.value)
                        }
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
                        required
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Date of Birth
                      </div>
                      <InputField
                        name={"dob"}
                        widthFit
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
                        type="text"
                      />
                    </div>
                    <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                      <div className="font-poppins text-sm font-normal leading-[21px]">
                        Representative Country
                      </div>
                      <SelectField
                        widthFit
                        data={dataCountry}
                        hideSearch
                        readOnly={readOnly}
                        formField="representative_country"
                        control={control}
                        setValue={setValue}
                        required
                        visibleIcon
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="mt-6 flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          First Name
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {first_name === undefined
                            ? kybData?.first_name
                            : first_name}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Last Name
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {last_name === undefined
                            ? kybData?.last_name
                            : last_name}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Email
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {email === undefined ? kybData?.email : email}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Type Number
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {type_number === undefined
                            ? kybData?.type_number
                            : type_number}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Phone Number
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {phone_number === undefined
                            ? kybData?.phone_number
                            : phone_number}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Card Type
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {card_type === undefined
                            ? kybData?.card_type
                            : card_type}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Card First Name
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {card_first_name === undefined
                            ? kybData?.card_first_name
                            : card_first_name}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Card Last Name
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {card_last_name === undefined
                            ? kybData?.card_last_name
                            : card_last_name}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Date of Birth
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {dob === undefined ? kybData?.dob : dob}{" "}
                        </div>
                      </div>
                      <div className=" flex items-center justify-between border-b  border-dashed border-b-[#BDC6DE] pb-6 ">
                        <div className="font-poppins text-sm font-normal leading-[21px]">
                          Representative Country
                        </div>
                        <div className="font-poppins text-sm font-medium leading-[21px] text-[#202124]">
                          {representative_country === undefined
                            ? kybData?.representative_country
                            : representative_country}{" "}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isEdit ? (
              <></>
            ) : (
              <>
                <div className="mt-6 flex items-center justify-end gap-4">
                  <button
                    onClick={() => {
                      dispatch(prevStep(3));
                    }}
                    className="flex items-center justify-center px-[24px] py-[12px] "
                  >
                    <div className=" text-[14px] font-semibold leading-[21px] text-[rgba(32,33,36,1)] opacity-50">
                      Back
                    </div>
                  </button>
                  <button
                    className="flex items-center justify-center rounded-lg bg-[#2B4896] px-[24px] py-[12px] font-poppins
            text-[14px] font-semibold leading-[21px] text-white hover:opacity-90"
                    onClick={async () => {
                      if (kybInfo) {
                        router.push("/dashboard");
                      } else {
                        setShowPopupConfirm(true);

                        const res = kybServices.uploadKYB(kybData);
                        localStorage.setItem("isSubmit", "1");
                        onSubmit();
                      }
                    }}
                  >
                    Complete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Popup showPopup={showPopupConfirm}>
        <ConfirmKYC setShowPopup={setShowPopupConfirm} />
      </Popup>
      <Popup showPopup={showPopupAddress}>
        <AddressDocument
          setShowPopup={setShowPopupAddress}
          url={kybInfo?.address_document || kybData?.address_document}
        />
      </Popup>

      <Popup showPopup={showPopupCertificate}>
        <CertificateDocument
          setShowPopup={setShowPopupCertificate}
          url={kybInfo?.certificate_document || kybData?.certificate_document}
        />
      </Popup>
    </>
  );
}

export default KYBForm;
