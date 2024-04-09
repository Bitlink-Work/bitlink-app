"use client";
import { getProfile } from "@/public/actions";

import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { selectProfile } from "@/public/reducers/profileSlice";

import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";

import SelectField from "@/components/fields/SelectField";

import VietNam from "@/images/kyc/vnFlag.svg";
import InfoIc from "@/images/kyb/info.svg";
import NoteListIc from "@/images/kyb/note_list.svg";
import CloseIc from "@/images/kyb/close.svg";
import UploadIc from "@/images/kyb/upload.svg";
import MainButton from "@/components/button/MainButton";

import {
  nextStep,
  prevStep,
  updateKybData,
  updateKybFile,
  // finishProcessing,
} from "@/public/reducers/kybSlices";
import { invoiceServices } from "@/public/api/invoiceServices";
import { Bounce, ToastContainer, toast } from "react-toastify";
import InputField from "@/components/inputfield/InputField";
import { kybServices } from "@/public/api/kybService";
import {
  validateAddress,
  validateCompanyName,
  validateEmail,
  validateLastName,
  validatePhoneNumber,
  validateRegistrationNumber,
  validateTaxID,
  validateWebsite,
  validatepostCode,
} from "@/public/utils/lib";

const schema = yup.object({
  company_name: yup.string(),
  registration_number: yup.string().required(),
  registered_country: yup.string(),
  company_email: yup.string(),
  company_website: yup.string(),
  company_Phone_Number: yup.string(),
  registered_address: yup.string(),
  registered_person: yup.string(),
  // tax_residence: yup.string(),
  tax_id: yup.string(),
  // country: yup.string(),
  city: yup.string(),
  postcode: yup.string(),
  proof_of_address: yup.string(),
  certificate: yup.string(),
  address_document_name: yup.string(),
  certificate_document_name: yup.string(),
});

interface ICompany {
  company_name?: string;
  registration_number?: string;
  registered_country?: string;
  company_email?: string;
  company_website?: string;
  company_Phone_Number?: string;
  registered_address?: string;
  registered_person?: string;
  tax_id?: string;
  city?: string;
  postcode?: string;
  proof_of_address: string;
  certificate: string;
  address_document_name?: string;
  certificate_document_name?: string;
}

interface IFile {
  type: string;
  file: File;
}

const dataTypeNumber = [{ label: "(+84)", value: "(+84)", icon: VietNam }];
const dataCountry = [{ label: "VietNam", value: "VietNam", icon: VietNam }];
const dataDocumentation = [
  { label: "Proof of address", value: "Proof of address" },
  {
    label: "Certificate of incorporation/registration",
    value: "Certificate of incorporation/registration",
  },
];
const checkFileType = (file: File) => {
  const partName = file.name.split(".");

  return partName[partName.length - 1].toLowerCase();
};

const CompanyDetail = () => {
  const [fileList, setFileList] = useState<Array<IFile>>([]);
  const { step, kybData, kybFile, kybStepStatus } = useAppSelector(
    (state) => state.kyb,
  );

  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const fetchProfile = useCallback(async () => {
    await dispatch(getProfile({}));
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const [kybInfo, setKybInfo] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    setValue,
    clearErrors,
  } = useForm<ICompany>({
    defaultValues: {
      company_name: kybInfo?.company_name || kybData?.company_name,
      registration_number:
        kybInfo?.registration_number || kybData?.registration_number,
      registered_country:
        kybInfo?.registered_country || kybData?.registered_country,
      company_email: kybInfo?.company_email || kybData?.company_email,
      company_website: kybInfo?.company_website || kybData?.company_website,
      company_Phone_Number:
        kybInfo?.company_phone_number || kybData?.company_phone_number,
      registered_address:
        kybInfo?.registered_person || kybData?.registered_person,
      registered_person:
        kybInfo?.registered_person || kybData?.registered_person,
      tax_id: kybInfo?.tax_id || kybData?.tax_id,
      city: kybInfo?.city || kybData?.city,
      postcode: kybInfo?.postcode || kybData?.postcode,
      proof_of_address:
        kybInfo?.address_document_type || kybData?.address_document_type,
      certificate:
        kybInfo?.certificate_document_type ||
        kybData?.certificate_document_type,
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
      setValue("company_name", kybInfo?.company_name);
      setValue("city", kybInfo?.city);
      setValue("company_Phone_Number", kybInfo?.company_phone_number);
      setValue("company_email", kybInfo?.company_email);
      setValue("company_website", kybInfo?.company_website);
      setValue("postcode", kybInfo?.postcode);
      setValue("proof_of_address", kybInfo?.proof_of_address);
      setValue("registered_address", kybInfo?.registered_address);
      setValue("registered_country", kybInfo?.registered_country);
      setValue("address_document_name", kybInfo?.address_document_name);
      setValue("certificate", kybInfo?.certificate);
      setValue("certificate_document_name", kybInfo?.certificate_document_name);
      setValue("tax_id", kybInfo?.tax_id);
      setValue("registered_person", kybInfo?.registered_person);
      setValue("registration_number", kybInfo?.registration_number);
    }
  }, [kybInfo]);

  const [active, setActive] = useState(false);

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    if (file.size > 5 * 1024 * 1000) {
      toast.error("This file is too large (Must be smaller than 5Mb)", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      return;
    }

    if (checkFileType(file) !== "pdf") {
      toast.error("Must be a PDF file", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      return;
    }

    const indexExistFileType = fileList.findIndex((fileItem) => {
      return fileItem.type === watch("certificate");
    });

    setFileList((pre: IFile[]) => {
      if (!pre.length) {
        return [{ file, type: watch("certificate") }];
      }

      // Override file type if existed
      if (indexExistFileType !== -1) {
        const newFileList = pre.map((fileItem: IFile, index: number) => {
          if (index !== indexExistFileType) {
            return fileItem;
          }
          return { file, type: watch("certificate") };
        });

        return newFileList;
      }

      return [...pre, { file, type: watch("certificate") }];
    });
  };

  const handleClearFileInput = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.value = "";
  };

  const handleDeleteFileUpload = async (fileIndex: number) => {
    const newFileList = fileList.filter((file, index) => {
      return fileIndex !== index;
    });

    setFileList(newFileList);
  };

  useEffect(() => {
    const indexExistFileTypeAddress = fileList.findIndex((fileItem) => {
      return fileItem.type === "Proof of address";
    });

    const indexExistFileTypeCertificate = fileList.findIndex((fileItem) => {
      return fileItem.type === "Certificate of incorporation/registration";
    });

    if (indexExistFileTypeAddress !== -1) {
      dispatch(
        updateKybFile({
          ...kybFile,
          address_document: fileList[indexExistFileTypeAddress].file,
        }),
      );
    }
    if (indexExistFileTypeCertificate !== -1) {
      dispatch(
        updateKybFile({
          ...kybFile,

          certificate_document: fileList[indexExistFileTypeCertificate].file,
        }),
      );
    }

    const uploadFileUrl = async () => {
      const fd1 = new FormData();
      const fd2 = new FormData();
      let res1;
      let res2;

      const addressFile = fileList.find(
        (fileItem: IFile) => fileItem.type === "Proof of address",
      );
      if (addressFile?.file) {
        fd1.append("img_file", addressFile.file);
        dispatch(
          updateKybData({
            ...kybData,
            address_document_name: addressFile.file?.name,
          }),
        );
        try {
          res1 = await invoiceServices.uploadLogo(fd1);
        } catch (error: any) {
          toast.error(
            `Upload ${addressFile.type} file failed:, ${error?.detail}`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            },
          );
        }
      }

      const certificateFile = fileList.find(
        (fileItem: IFile) =>
          fileItem.type === "Certificate of incorporation/registration",
      );
      if (certificateFile?.file) {
        fd2.append("img_file", certificateFile?.file);

        dispatch(
          updateKybData({
            ...kybData,
            certificate_document_name: certificateFile?.file.name,
          }),
        );
        try {
          res2 = await invoiceServices.uploadLogo(fd2);
        } catch (error: any) {
          toast.error(
            `Upload ${certificateFile.type} file failed:, ${error?.detail}`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            },
          );
        }
      }

      if (res1 && res2) {
        dispatch(
          updateKybData({
            ...kybData,
            certificate_document_name: certificateFile?.file.name,
            address_document: res1?.data?.url,
            certificate_document: res2.data?.url,
          }),
        );
      }
    };

    uploadFileUrl();
  }, [fileList]);

  useEffect(() => {
    if (!kybInfo) {
      if (
        watch("company_name") &&
        watch("registration_number") &&
        watch("registered_country") &&
        watch("certificate") &&
        validateCompanyName(watch("company_name") as any) &&
        validateRegistrationNumber(watch("registration_number") as any) &&
        validateEmail(watch("company_email") as any) &&
        validateWebsite(watch("company_website") as any) &&
        validatePhoneNumber(watch("company_Phone_Number") as any) &&
        validateAddress(watch("registered_address") as any) &&
        validateLastName(watch("registered_person") as any) &&
        validateTaxID(watch("tax_id") as any) &&
        validateAddress(watch("city") as any) &&
        validatepostCode(watch("postcode") as any) &&
        fileList.length === dataDocumentation.length
        // fileSecond
      ) {
        setActive(true);
      } else {
        setActive(false);
      }
    } else {
      setActive(true);
    }
  }, [
    watch("company_name"),
    watch("registration_number"),
    watch("registered_country"),
    watch("proof_of_address"),
    watch("certificate"),
    watch("postcode"),
    watch("company_Phone_Number"),
    watch("company_website"),
    watch("company_email"),
    watch("registered_address"),
    watch("registered_person"),
    watch("tax_id"),
    watch("city"),
    fileList,
    // fileSecond,
  ]);

  useEffect(() => {
    if (
      kybFile?.address_document?.name !== undefined &&
      kybFile?.certificate_document?.name !== undefined
    ) {
      setFileList([
        { file: kybFile?.address_document, type: "Proof of address" },
        {
          file: kybFile?.certificate_document,
          type: "Certificate of incorporation/registration",
        },
      ]);
    }
  }, [kybFile?.address_document, kybFile?.address_document]);

  const fileName = [
    { name: kybInfo?.address_document_name },
    { name: kybInfo?.certificate_document_name },
  ];

  const onSubmit = async (data: any, e: any) => {
    dispatch(
      updateKybData({
        ...kybData,
        company_name: data?.company_name,
        registration_number: data?.registration_number,
        registered_country: data?.registered_country,
        company_email: data?.company_email,

        company_website: data?.company_website,
        company_phone_number: data?.company_Phone_Number,
        registered_address: data?.registered_address,
        registered_person: data?.registered_person,

        tax_id: data?.tax_id,

        city: data?.city,
        postcode: data?.postcode,
        address_document_type: "Proof of address",
        certificate_document_type: "Certificate of incorporation/registration",

        // address_document: res1?.data?.url,
        // certificate_document: res2.data?.url,
      }),
    );

    dispatch(nextStep(2));
  };

  return (
    <section className="kybCompanyDetail  flex flex-col gap-6">
      <h1 className="leading-6s font-poppins text-base font-medium text-[#202124] ">
        Fill in the Company data form
      </h1>

      <article className="flex flex-col gap-6 rounded-xl border border-[#DEDEDE] bg-white px-6 py-8 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid auto-rows-min grid-cols-2 gap-6">
            <InputField
              name={"company_name"}
              widthFull
              label="Company Name "
              required
              readOnly={readOnly}
              handleChange={(e) => setValue("company_name", e.target.value)}
              register={register}
              errors={errors}
              watch={watch}
              pattern={/^(?!\s)(^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Company Name *"
              type="text"
            />

            <InputField
              name={"registration_number"}
              widthFull
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
              placeholder="Registration Number *"
              type="text"
            />

            <SelectField
              data={dataCountry}
              readOnly={readOnly}
              visibleIcon
              placeholder="Regitered Country *"
              hideSearch
              formField="registered_country"
              required
              errorText="This field is required"
              errors={errors}
              control={control}
              setValue={setValue}
            />

            <InputField
              name={"company_email"}
              widthFull
              readOnly={readOnly}
              label="Company Email "
              handleChange={(e) => setValue("company_email", e.target.value)}
              register={register}
              required
              errors={errors}
              watch={watch}
              pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Company Email *"
              type="text"
            />
            <InputField
              name={"company_website"}
              widthFull
              readOnly={readOnly}
              label="Company Website"
              handleChange={(e) => setValue("company_website", e.target.value)}
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
              placeholder="Company Website *"
              type="text"
            />
            <InputField
              name={"company_Phone_Number"}
              widthFull
              readOnly={readOnly}
              label="Company Phone Number"
              required
              handleChange={(e) =>
                setValue("company_Phone_Number", e.target.value)
              }
              register={register}
              errors={errors}
              watch={watch}
              pattern={/^(?!\s+$)(^\s*$|^[0-9\+]{1,}[0-9\-]{3,15}$)/}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              className=""
              placeholder="Company Phone Number *"
              type="text"
            />

            <InputField
              name={"registered_address"}
              widthFull
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
              placeholder="Registered Address *"
              type="text"
            />

            <InputField
              name={"registered_person"}
              widthFull
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
              placeholder="Registered Person *"
              type="text"
            />

            <InputField
              name={"tax_id"}
              readOnly={readOnly}
              widthFull
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
              placeholder="Tax ID *"
              type="text"
            />

            <InputField
              name={"city"}
              widthFull
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
              placeholder="City *"
              type="text"
            />

            <div className="col-span-2">
              <InputField
                name={"postcode"}
                widthFull
                readOnly={readOnly}
                label="Post code "
                required
                handleChange={(e) => setValue("postcode", e.target.value)}
                register={register}
                errors={errors}
                watch={watch}
                pattern={/^(?!\s+$)(^\s*$|[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$)/i}
                setError={setError}
                clearErrors={clearErrors}
                setValue={setValue}
                className=""
                placeholder="Post code *"
                type="text"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-3 rounded bg-[#E6F7FF] p-4">
              <div className="flex items-center gap-3">
                <Image
                  className=""
                  src={InfoIc}
                  width={21}
                  height={21}
                  alt="info"
                />

                <div className="text-sm font-semibold text-[#202124]">
                  Upload the following:
                </div>
              </div>

              <ul className="list-disc pl-6">
                <li>
                  Documents confirming the company&apos;s legal existence (e.g.
                  the certificate of incorporation or a recent excerpt from a
                  state company registry)
                </li>
                <li>
                  Document identifying the company&apos;s beneficial owners
                </li>
              </ul>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-6 rounded-lg bg-[#F4F4F4] px-6 pb-4 pt-6">
              {!kybInfo && (
                <div className="flex flex-col gap-4">
                  <SelectField
                    data={dataDocumentation}
                    placeholder="Select document type *"
                    hideSearch
                    initialValue
                    formField={"certificate"}
                    required
                    errors={errors}
                    control={control}
                    setValue={setValue}
                    className="h-[56px] bg-white"
                    bgPlaceholderTransparent
                  />
                  <div className="flex flex-col gap-2">
                    <div className="relative flex flex-grow-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#BDC6DE] bg-white px-[105px] py-[24px] hover:opacity-80">
                      <input
                        className={
                          "absolute h-full w-[462px] cursor-pointer opacity-0"
                        }
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleUploadFile(e);
                        }}
                        onClick={handleClearFileInput}
                      />

                      <Image
                        className=""
                        src={UploadIc}
                        height={48}
                        width={48}
                        alt="upload-icon"
                      />

                      <div className="text-center text-base font-semibold  text-[#6A6A6C]">
                        Click or drag your file here to upload
                      </div>
                    </div>

                    <div className="text-xs font-normal leading-[18px] text-[#98999A]">
                      *PDF files with a maximum size of 5 MB
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="text-sm font-medium leading-[21px] text-[#202124]">
                  Upload {!kybInfo ? fileList.length : 2} document(s)
                </div>

                {!kybInfo ? (
                  <>
                    <div className="fileList flex max-h-[272px] flex-col gap-3 overflow-y-auto">
                      {fileList.length > 0 &&
                        fileList.map((file, index) => (
                          <div
                            key={index}
                            className={`flex w-full justify-between place-self-start rounded-lg border border-[#DEDEDE] bg-white px-3 py-4`}
                          >
                            <div className="flex items-start gap-4">
                              <Image
                                src={NoteListIc}
                                width={48}
                                height={48}
                                objectFit="cover"
                                alt="note-list"
                              />

                              <div className="flex flex-col gap-1">
                                <div className="line-clamp-2 w-[348px] text-base font-normal text-[#6A6A6C]">
                                  {file.file?.name}
                                </div>

                                <div className="text-sm font-normal leading-[21px] text-[#43A048]">
                                  File successfully uploaded.
                                </div>
                              </div>
                            </div>
                            {!kybInfo && (
                              <div
                                className="h-6 w-6 cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  handleDeleteFileUpload(index);
                                }}
                              >
                                <Image
                                  className=""
                                  src={CloseIc}
                                  width={14}
                                  height={14}
                                  alt="close-icon"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fileList flex max-h-[272px] flex-col gap-3 overflow-y-auto">
                      {fileName.length > 0 &&
                        fileName.map((file, index) => (
                          <div
                            key={index}
                            className={`flex w-full justify-between place-self-start rounded-lg border border-[#DEDEDE] bg-white px-3 py-4`}
                          >
                            <div className="flex items-start gap-4">
                              <Image
                                src={NoteListIc}
                                width={48}
                                height={48}
                                objectFit="cover"
                                alt="note-list"
                              />

                              <div className="flex flex-col gap-1">
                                <div className="line-clamp-2 w-[348px] text-base font-normal text-[#6A6A6C]">
                                  {file?.name}
                                </div>

                                <div className="text-sm font-normal leading-[21px] text-[#43A048]">
                                  File successfully uploaded.
                                </div>
                              </div>
                            </div>
                            {!kybInfo && (
                              <div
                                className="h-6 w-6 cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  handleDeleteFileUpload(index);
                                }}
                              >
                                <Image
                                  className=""
                                  src={CloseIc}
                                  width={14}
                                  height={14}
                                  alt="close-icon"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex   justify-end gap-4">
            <MainButton
              title="Next"
              disabled={!active}
              // onClick={() => handleSubmit(onSubmit)}
              type="submit"
            />
          </div>
        </form>
      </article>
    </section>
  );
};

export default CompanyDetail;
