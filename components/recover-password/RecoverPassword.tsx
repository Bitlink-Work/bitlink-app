"use client";
import { useAppDispatch } from "@/public/hook/hooks";
import thumbUp from "@/public/images/login/thumbsUp.png";
import logo from "@/public/images/register/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MainButton from "../button/MainButton";
import InputField from "../inputfield/InputField";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

const RecoverPassword = () => {
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
    },
    resolver: zodResolver(schema),
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [showNoti, setShowNoti] = useState(false);

  useEffect(() => {
    if (watch("email") !== "") {
      if (!errors?.email?.message) {
        setActive(true);
      }
    } else {
      setActive(false);
    }
  }, [errors, watch("email")]);

  const onSubmit = (data: any) => {
    setShowNoti(true);
    // router.push("/home?step=1");
  };

  return (
    <div className="flex w-full justify-center bg-[#FDFCFB] text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#fff] md:w-[56%]">
        <div className="flex w-full flex-col items-center md:max-w-[821px] md:px-[60px] md:pt-[60px]">
          <div className="flex w-full items-center justify-center">
            <Image src={logo} alt="logo" objectFit="cover" height={60} />
          </div>
          <div className="flex w-full flex-col items-center gap-y-[40px] md:w-[489px]">
            <div className=" mt-[32px] md:mt-[64px]">
              <div className="text-center text-[36px] font-semibold leading-[54px] text-[#2B4896]">
                Lost your password?
              </div>
              <div className="mt-[6px] text-center text-[18px] font-normal leading-[27px] text-text-primary">
                You&apos;re in the right place. Request a reset link here.
              </div>
            </div>

            {showNoti ? (
              <div className="flex w-[443px] flex-row items-center justify-start gap-3 rounded bg-[#FBEBCB] p-4 text-sm font-normal leading-[21px] text-text-primary">
                <Image
                  src="/icon/icon-info-warning.svg"
                  width={24}
                  height={24}
                  alt=""
                />
                <p>We&apos;ve just sent you an email to reset your password</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
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
                </div>
              </form>
            )}

            <div className="mt-5 flex flex-col items-center justify-center gap-10">
              {!showNoti && (
                <MainButton
                  title="Reset Password"
                  onClick={handleSubmit(onSubmit)}
                  bold
                  hideBorder
                  disabled={!active}
                />
              )}
              <MainButton
                title="Back to Login"
                onClick={() => router.push("/login")}
                bold
                outline
              />
            </div>
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
export default RecoverPassword;
