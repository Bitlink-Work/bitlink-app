"use client";
import { updateProfile } from "@/public/actions";
import { useAppDispatch } from "@/public/hook/hooks";
import thumbUp from "@/public/images/login/thumbsUp.png";
import icPhone from "@/public/images/register/icPhone.png";
import icWallet from "@/public/images/register/icWallet.png";
import logo from "@/public/images/register/logo.png";
import {
  closeModal,
  selectIsOpenModal,
  selectProfile,
} from "@/public/reducers/walletSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";
import MainButton from "../button/MainButton";
import InputField from "../inputfield/InputField";
import ButtonConnectWallet from "./ButtonConnectWallet";
import ButtonLoginGmail from "./ButtonLoginGmail";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

const LoginPage = () => {
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
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const listMedia = [
    {
      icon: icPhone,
      title: "Phone number",
    },
    {
      icon: icWallet,
      title: "Connect wallet",
    },
  ];
  const [avatar, setAvatar] = useState({
    name: "",
    link: "",
  });
  const isOpenModal = useSelector(selectIsOpenModal);
  const userProfile = useSelector(selectProfile);
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setMode(!mode);
  };
  const handleClose = () => {
    dispatch(closeModal());
  };
  const updateAvatarProfile = async () => {
    if (avatar.link) {
      await dispatch(
        updateProfile({
          avatar: avatar.link,
        }),
      );
    }
  };
  useEffect(() => {
    updateAvatarProfile();
  }, [avatar]);

  // const handleLogin = async () => {
  //   router.push("/home?step=1");
  // };

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
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (watch("email") !== "" && watch("password") !== "") {
      if (!errors?.email?.message && !errors?.password?.message) {
        setActive(true);
      }
    } else {
      setActive(false);
    }
  }, [errors, watch("email"), watch("password")]);

  const onSubmit = (data: any) => {
    router.push("/home?step=1");
  };

  return (
    <div className="flex w-full justify-center bg-[#FDFCFB] text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[56%]">
        <div className="flex w-full flex-col items-center md:max-w-[821px] md:px-[60px] md:pt-[60px]">
          <div className="flex w-full items-center justify-between">
            <Image src={logo} alt="logo" objectFit="cover" height={32} />
            <div className="flex items-center gap-2 text-[18px] leading-[27px]">
              <button className="text-[18px] font-normal leading-[27px] text-text-primary">
                Don’t have an account?
              </button>
              <Link href={"/register"}>
                <div className="text-[14px] font-semibold leading-[21px] text-primary">
                  Sign up!
                </div>
              </Link>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-y-[40px] md:w-[489px]">
            <div className=" mt-[32px] md:mt-[64px]">
              <div className="text-center text-[36px] font-semibold leading-[54px] ">
                Welcome Back 👋
              </div>
              <div className="mt-[6px] text-center text-[18px] font-normal leading-[27px]">
                Log in to your account
              </div>
            </div>
            <div className="flex w-[306px] items-center justify-center gap-[11px]">
              <ButtonLoginGmail
                title="Google"
                handleClose={handleClose}
                isOpenModal={isOpenModal}
              />
              {/* {listMedia.map((item: any, index: number) => {
                return (
                  <button
                    className="flex h-[48px] items-center justify-center rounded-[6px] border-[1px] border-solid border-[#DEDEDE] hover:bg-[#DEDEDE]"
                    key={index}
                  >
                    <div className="mr-[8px] h-[24px] w-[24px]">
                      <Image src={item.icon} alt="icon" />
                    </div>
                    <div className="text-[12px] font-medium leading-[18px] text-[#000]">
                      {item.title}
                    </div>
                  </button>
                );
              })} */}
              <ButtonConnectWallet title="Connect wallet" />
            </div>
            <div className="flex items-center justify-center">
              <div className="h-[1px] w-[130px] bg-[#DEDEDE]"></div>
              <div className="mx-[12px] text-[12px] font-normal leading-[18px] text-text-primary">
                Or continue with
              </div>
              <div className="h-[1px] w-[130px] bg-[#DEDEDE]"></div>
            </div>
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className="w-full md:w-[400px]"
            >
              <div className="flex w-full flex-col items-start justify-start gap-8">
                <InputField
                  name={"email"}
                  label="Email *"
                  register={register}
                  errors={errors}
                  watch={watch}
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
                  pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/}
                  setError={setError}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  className=""
                  placeholder="Email *"
                  required
                  type="text"
                  widthFull={true}
                />
                <InputField
                  name={"password"}
                  label="Password *"
                  register={register}
                  errors={errors}
                  watch={watch}
                  handleChange={(e) => {
                    setValue("password", e.target.value);
                    clearErrors("password");
                  }}
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
              </div>
              <div className="mt-[24px] flex w-full items-center justify-between">
                <label
                  htmlFor="darkmode"
                  className="flex cursor-pointer items-center"
                >
                  <div className="relative mr-[24px] h-[24px] w-[44px]">
                    <button
                      className="toggle"
                      onClick={handleClick}
                      type="button"
                      style={{
                        background: `${mode ? "#333" : "#E8E8E8"}`,
                      }}
                      id="darkmode"
                    >
                      <div
                        className="btn"
                        style={{
                          marginLeft: `${mode ? "22px" : "2px"}`,
                          background: "#fff",
                        }}
                      ></div>
                    </button>
                  </div>
                  <div className="text-[14px] font-normal leading-[21px]">
                    Remember me
                  </div>
                </label>
                <button
                  onClick={() => router.push("/recover-password")}
                  type="button"
                  className="text-[14px] font-medium leading-[21px] text-[#D93F21]"
                >
                  Recover Password
                </button>
              </div>
              <MainButton
                title="Login"
                onClick={(e) => {
                  e.preventDefault();
                  // handleSubmit(onSubmit);
                  toast.info("Coming soon!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    transition: Bounce,
                  });
                }}
                className="mt-10 w-full"
                bold
                disabled={!active}
              />
              {/* <button
                type="button"
                className="mt-[6px] flex h-[51px] w-full items-center justify-center text-[18px] font-medium leading-[27px] text-[#98999a]"
              >
                Forgot password?
              </button> */}
            </form>
          </div>
        </div>
      </div>
      <div className="relative flex h-full w-full justify-center overflow-hidden rounded-l-2xl bg-[url(/images/login/banner.png)] bg-cover md:w-[44%]">
        <div className="flex h-full w-full items-end justify-center md:w-[619px] md:px-[35px] md:pb-[32px]">
          <div className="h-[260px] w-full rounded-[10px] bg-[rgba(255,242,242,0.13)] px-[48px] py-[40px]">
            <div className="flex h-[46.05px] w-[265.05px] items-center justify-center rounded-[12px] bg-[#FEF9EE]">
              <div className="mr-[12px] h-[22px] w-[22px]">
                <Image src={thumbUp} alt="thumbs Up" objectFit="cover" />
              </div>
              <div className="text-[14px] font-medium leading-[21px]">
                End to End e-invoice service
              </div>
            </div>
            <div className="mt-[41px] w-full text-[20px] font-normal leading-[34px] text-[#fff] md:w-[90%]">
              Our innovative solutions aim to solve and ease the pain point of
              business and every end-user.
            </div>
          </div>
        </div>
        {/* <div className="bounce absolute left-[-80px] top-[81px] h-[460px] w-[558.352px]">
          <Image src={human} alt="human" objectFit="cover" />
        </div> */}
      </div>
    </div>
  );
};
export default LoginPage;
