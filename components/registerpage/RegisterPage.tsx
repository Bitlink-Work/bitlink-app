"use client";
import checkCicle from "@/public/images/register/checkCircle.svg";
import flash from "@/public/images/register/flash.svg";
import flashCircle from "@/public/images/register/flashCircle.png";
import iCircle from "@/public/images/register/iCircle.svg";
import icCheck from "@/public/images/register/icCheck.png";
import logo from "@/public/images/register/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as ReactDOMServer from "react-dom/server";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/pagination";

import { useAppDispatch } from "@/public/hook/hooks";
import { closeModal, selectIsOpenModal } from "@/public/reducers/walletSlice";
import { useSelector } from "react-redux";
import ButtonLoginGmail from "../loginpage/ButtonLoginGmail";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";
import MainButton from "../button/MainButton";
import InputField from "../inputfield/InputField";
import ButtonConnectWallet from "../loginpage/ButtonConnectWallet";
import DoneRegister from "./DoneRegister";
SwiperCore.use([Pagination]);

const schema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const dispatch = useAppDispatch();
  const isOpenModal = useSelector(selectIsOpenModal);
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: any) {
      return ReactDOMServer.renderToStaticMarkup(
        <div className={className}></div>,
      );
    },
  };
  const [step, setStep] = useState(1);
  const router = useRouter();
  useEffect(() => {
    if (router?.query?.step) {
      setStep(Number(router?.query?.step));
    } else {
      setStep(1);
    }
  }, [router?.query?.step]);

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isLowercaseValid, setIsLowercaseValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);
  const [isNonAlphanumericValid, setIsNonAlphanumericValid] = useState(false);

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (
      isLengthValid &&
      isLowercaseValid &&
      isNumberValid &&
      isNonAlphanumericValid &&
      watch("email") &&
      watch("first_name") &&
      watch("last_name") &&
      watch("password")
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [
    isLengthValid,
    isLowercaseValid,
    isNumberValid,
    isNonAlphanumericValid,
    watch("email"),
    watch("first_name"),
    watch("last_name"),
    watch("password"),
  ]);

  const handleEmailClick = () => {
    setShowAdditionalFields(true);
  };

  const handleChange = (e: any) => {
    if (e.target.value.length > 0) {
      setValue("password", e.target.value);
      clearErrors("password");
      const newPassword = e.target.value;
      checkPasswordConditions(newPassword);
    }
  };
  const checkPasswordConditions = (password: any) => {
    const lengthRegex = /.{12,}/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const nonAlphanumericRegex = /[^a-zA-Z0-9]/;

    setIsLengthValid(lengthRegex.test(password));
    setIsLowercaseValid(lowercaseRegex.test(password));
    setIsNumberValid(numberRegex.test(password));
    setIsNonAlphanumericValid(nonAlphanumericRegex.test(password));
  };

  const maxims = [
    {
      id: 1,
      content:
        "“Other solutions we saw didn't have all the functionalities we needed for higher security and privacy, such as the invoice, automatic data feed, qualified standards, as well as virtual account management 🤩”",
      avatar: "/images/register/avt1.png",
      name: "Minh Tram Vo",
      position: "CTO at Esol Labs",
      emotion: "Awesome!",
    },
    {
      id: 2,
      content:
        "“After evaluating different options, I found this web invoice system to be unparalleled in terms of security and privacy. Love Bitlink so much”",
      avatar: "/images/register/avt2.png",
      name: "Ryker Tran",
      position: "PO at Innovaz",
      emotion: "Love it!",
    },
    {
      id: 2,
      content:
        "“This web invoice solution exceeds our expectations, providing not only NFT invoicing and virtual account management but also ensuring higher security and privacy through qualified standards. A top-notch choice.”",
      avatar: "/images/register/avt3.png",
      name: "Lily Maison",
      position: "PM at ATOM Solution",
      emotion: "So cool!",
    },
  ];

  const handleClose = () => {
    dispatch(closeModal());
  };

  const onSubmit = async (data: any) => {
    // e.preventDefault();
    // if (!email || !firstName || !lastName || !password) {
    //   setFormValid(false);
    //   return;
    // }
    // if (
    //   !(
    //     isLengthValid &&
    //     isLowercaseValid &&
    //     isNumberValid &&
    //     isNonAlphanumericValid &&
    //     watch("email") &&
    //     watch("first_name") &&
    //     watch("last_name") &&
    //     watch("password")
    //   )
    // ) {
    //   setFormValid(false);
    //   return;
    // }
    // await dispatch(
    //   createUser({
    //     first_name: firstName,
    //     last_name: lastName,
    //     company_name: "",
    //     country: "",
    //     region: "",
    //     city: "",
    //     postal_code: "",
    //     address_line_1: "",
    //     address_line_2: "",
    //     tax_number: 0,
    //   }),
    // );
    toast.success("Register successfully", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      transition: Bounce,
    });
    localStorage.setItem("user_account" as string, JSON.stringify(data));
    router.push("/?step=2");
  };

  const [passwordType, setPasswordType] = useState("password");
  const [icon, setIcon] = useState("/images/register/eye_slash.svg" as string);
  const handleIconClick = (e: any) => {
    e.stopPropagation();
    if (passwordType === "text") {
      setPasswordType("password");
      setIcon("/images/register/eye_slash.svg");
    } else {
      setPasswordType("text");
      setIcon("/images/register/eye.svg");
    }
  };

  return (
    <div>
      {step == 1 ? (
        <div className="relative flex h-fit w-full justify-center bg-[#FDFCFB] md:flex md:min-h-[100vh] ">
          <div className="md: h-[900px] w-[619px] justify-center rounded-r-2xl bg-primary md:relative md:flex md:items-end md:pb-[163.5px] md:pt-[60px]">
            <div className="absolute flex  h-[72px] w-[279px] items-center justify-center rounded-[40px] bg-[#121E3F] md:right-[-142px] md:top-[60px] ">
              <div className="mr-[12px] flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-[#687188]">
                <Image src={flashCircle} alt="flash Circle" objectFit="cover" />
              </div>
              <div className="text-[18px] font-normal leading-[27px] text-[#EAEDF5]">
                100% Recommended
              </div>
            </div>
            <div className="absolute flex h-[72px] w-[225px] items-center justify-center rounded-[40px] bg-[#FDFCFB] md:right-[-115px] md:top-[156px]">
              <div className="mr-[12px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#A4ACC1]">
                <Image src={flash} alt="flash Circle1" objectFit="cover" />
              </div>
              <div className="text-[18px] font-normal leading-[27px] text-[rgba(18,30,63,1)]">
                Fast & Security
              </div>
            </div>

            <div className="h-[480px] w-full md:w-[619px]">
              <Swiper
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={30}
                pagination={pagination}
                autoplay={{
                  delay: 1500,
                  disableOnInteraction: false,
                }}
                loop={true}
              >
                {maxims.map((item: any, index: number) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="h-full w-full px-[81px] pb-[60px] pt-[26px]">
                        <div className="relative flex w-full flex-col gap-y-[32px] rounded-[24px] bg-[#FDFCFB] p-[40px] pt-[60px]">
                          <div className="absolute right-[-25px] top-[-26px] h-[80px] w-[80px]">
                            <Image
                              width={80}
                              height={80}
                              src={icCheck}
                              alt="check icon"
                              objectFit="cover"
                            />
                          </div>
                          <div className="text-[18px] font-normal leading-[27px] text-text-primary md:w-[88%]">
                            {item.content}
                          </div>
                          <div className="h-[1px] w-full bg-[#DEDEDE]"></div>
                          <div className="flex items-center">
                            <div className="mr-[12px] h-[60px] w-[60px] overflow-hidden rounded-full">
                              <Image
                                src={item.avatar}
                                alt="fish"
                                objectFit="cover"
                                width={60}
                                height={60}
                              />
                            </div>
                            <div className="mr-[10px] w-[150px] text-text-primary">
                              <div className="mb-[4px] text-[14px] font-medium leading-[21px]">
                                {item.name}
                              </div>
                              <div className="text-[12px] font-normal leading-[14px]">
                                {item.position}
                              </div>
                            </div>
                            <div className="flex h-[51px] w-[145px] items-center justify-center rounded-[32px] bg-text-primary bg-[#202124px] text-[14px] font-semibold leading-[27px] text-[#fff]">
                              {item.emotion}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-center bg-[#FDFCFB] md:px-[60px] md:pb-[105px] md:pt-[60px]">
            <div className="flex w-full items-center justify-end gap-2">
              <span className="text-[18px] font-normal leading-[27px] text-text-primary">
                Have an account?
              </span>
              <Link href={"/login"}>
                <div className="text-[14px] font-semibold leading-[21px] text-[rgba(43,72,150,1)]">
                  Login
                </div>
              </Link>
            </div>
            <div className="mt-[32px] flex w-full flex-col items-center justify-center md:mt-[64px] md:max-w-[461px]">
              <Image src={logo} alt="logo" objectFit="cover" height={48} />

              <div className="mt-[32px] flex flex-col items-center gap-y-[40px]">
                <div className="text-center text-[16px] font-normal leading-[24px] text-[@202124]">
                  Get started - it&apos;s free. Bitlink helps you with the full
                  cycle from creating, tracking transactions to the management
                  of all partners and e-invoices.
                </div>
                <div className="flex w-[400px] flex-col items-center gap-y-[11px]">
                  <ButtonLoginGmail
                    handleClose={handleClose}
                    isOpenModal={isOpenModal}
                  />
                  <ButtonConnectWallet title="Continue with Wallet" />
                </div>
                <div className=" flex items-center justify-center">
                  <div className="h-[1px] w-[139px] bg-[#DEDEDE]"></div>
                  <div className="mx-[12px] text-[12px] font-normal leading-[18px] text-text-primary">
                    Or continue with
                  </div>
                  <div className="h-[1px] w-[139px] bg-[#DEDEDE]"></div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex w-[400px] flex-col gap-[24px]">
                    <InputField
                      name={"email"}
                      label="Email *"
                      register={register}
                      errors={errors}
                      watch={watch}
                      handleClick={handleEmailClick}
                      handleChange={(e) => {
                        let rex = new RegExp(
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
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
                      pattern={
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/
                      }
                      setError={setError}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      className=""
                      placeholder="Email *"
                      required
                      type="text"
                      widthFull={true}
                    />
                    {showAdditionalFields && (
                      <>
                        <div className="grid grid-cols-2 items-center justify-between gap-4">
                          <InputField
                            name={"first_name"}
                            label="First name *"
                            register={register}
                            errors={errors}
                            watch={watch}
                            handleChange={(e) => {
                              // const rex = new RegExp(/^[a-zA-Z\s]*$/);
                              if (
                                // !rex.test(e.target.value) ||
                                e.target.value.trim() === ""
                              ) {
                                setError("first_name", {
                                  message: "Invalid First Name",
                                });
                                setValue(
                                  "first_name",
                                  e.target.value.replace(/^\s+|\s+$/gm, ""),
                                );
                              } else {
                                const rex = new RegExp(/\s/);
                                if (rex.test(e.target.value)) {
                                  setError("first_name", {
                                    message: "Invalid First Name",
                                  });
                                } else {
                                  setValue("first_name", e.target.value);
                                  clearErrors("first_name");
                                }
                              }
                            }}
                            // pattern={/\s/}
                            // pattern={
                            //   /^(?!\s+$)(^\s*$|^[^\d\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$)/
                            // }
                            setError={setError}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            className=""
                            placeholder="First name *"
                            required
                            type="text"
                            widthFull={true}
                            maxLength={50}
                          />
                          <InputField
                            name={"last_name"}
                            label="Last name *"
                            register={register}
                            errors={errors}
                            watch={watch}
                            handleChange={(e) => {
                              // const rex = new RegExp(/^[a-zA-Z\s]*$/);
                              if (
                                // !rex.test(e.target.value) ||
                                e.target.value.trim() === ""
                              ) {
                                setError("last_name", {
                                  message: "Invalid Last Name",
                                });
                                setValue(
                                  "last_name",
                                  e.target.value.replace(/^\s+|\s+$/gm, ""),
                                );
                              } else {
                                setValue("last_name", e.target.value);
                                clearErrors("last_name");
                              }
                            }}
                            // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
                            setError={setError}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            className=""
                            placeholder="Last name *"
                            required
                            type="text"
                            widthFull={true}
                            maxLength={50}
                          />
                        </div>
                        <InputField
                          name={"password"}
                          label="Password *"
                          register={register}
                          errors={errors}
                          watch={watch}
                          handleChange={handleChange}
                          setError={setError}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          className=""
                          placeholder="Password *"
                          required
                          type={passwordType}
                          widthFull={true}
                          icon={icon}
                          handleIconClick={handleIconClick}
                        />
                        <div className=" px-[24px]">
                          <div className="flex flex-col gap-2 ">
                            <p className="text-back text-sm font-normal leading-[18px]">
                              Password must have :
                            </p>
                            <div className="flex gap-2">
                              {isLengthValid ? (
                                <Image
                                  src={checkCicle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              ) : (
                                <Image
                                  src={iCircle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              )}

                              <div className="text-[12px] font-normal leading-[18px] text-[#98999A]">
                                at least 12 characters in length
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {isLowercaseValid ? (
                                <Image
                                  src={checkCicle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              ) : (
                                <Image
                                  src={iCircle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              )}
                              <div className="text-[12px] font-normal leading-[18px] text-[#98999A]">
                                have at least one lowercase character
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {isNumberValid ? (
                                <Image
                                  src={checkCicle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              ) : (
                                <Image
                                  src={iCircle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              )}
                              <div className="text-[12px] font-normal leading-[18px] text-[#98999A]">
                                have at least one number
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {isNonAlphanumericValid ? (
                                <Image
                                  src={checkCicle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              ) : (
                                <Image
                                  src={iCircle}
                                  alt="check icon"
                                  objectFit="cover"
                                />
                              )}
                              <div className="text-[12px] font-normal leading-[18px] text-[#98999A]">
                                have at least one non-alphanumeric character
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <MainButton
                    title="Create your account"
                    className="mt-10 w-full"
                    disabled={!formValid}
                    bold
                    onClick={handleSubmit(onSubmit)}
                  />
                </form>
                <div className="w-[263px] text-center text-[14px] font-medium leading-[21px] text-[#98999a]">
                  By continuing, you agree to our
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="mr-[4px] whitespace-nowrap underline decoration-[#98999a]"
                    >
                      Terms & Conditions
                    </Link>
                    and
                    <Link
                      href="/"
                      className="ml-[4px] whitespace-nowrap underline decoration-[#98999a]"
                    >
                      Privacy Policy.
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DoneRegister />
      )}
    </div>
  );
};
export default RegisterPage;
