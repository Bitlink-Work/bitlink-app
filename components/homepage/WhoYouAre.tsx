import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { authLogoutGoogle, updateUserType } from "@/public/actions";
import { auth } from "@/public/api/firebase";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import arrowRight from "@/public/images/howtobuy/arrowRightLight.png";
import icGroup from "@/public/images/howtobuy/icGroup.png";
import icPerson from "@/public/images/howtobuy/icPerson.png";
import thumbUp from "@/public/images/login/thumbsUp.png";
import logo from "@/public/images/register/logo.png";
import { selectProfile } from "@/public/reducers/profileSlice";
import { EnumTypeProfile } from "@/public/utils/constants";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import MainButton from "../button/MainButton";

const menu = [
  {
    id: 1,
    title: "FREELANCER",
    content: "Individual",
    value: EnumTypeProfile.Freelancer,
    icon: icPerson,
  },
  {
    id: 2,
    title: "BUSINESS",
    content: "Organization",
    value: EnumTypeProfile.Business,
    icon: icGroup,
  },
];
const WhoYouAre = ({ setStep }: any) => {
  const { dataInvoice, setInvoiceToLocalStorage } = useInvoiceContext();
  const [id, setId] = useState(1);
  const router = useRouter();
  const profile = useAppSelector(selectProfile);
  const [clientType, setClientType] = useState(dataInvoice.from_type);
  const handleClick = async () => {
    if (clientType !== profile?.type) {
      await dispatch(
        updateUserType({
          user_id: profile?.user_id,
          type: clientType,
        }),
      );
      if (clientType === EnumTypeProfile.Business) {
        // localStorage.removeItem("isSubmit");
        // localStorage.setItem("isSubmit", "0");
      }
    }
    setInvoiceToLocalStorage({
      ...dataInvoice,
      from_type: clientType,
    });
    localStorage.setItem("step-instructions", JSON.stringify(0));
    // router.push("/home?step=3");
  };

  const dispatch = useAppDispatch();

  const handleLogoutGoogle = async () => {
    // onChangeWallet("");
    signOut(auth);
    // setLogged(false);
    dispatch(authLogoutGoogle({}));
  };
  return (
    <div className="flex w-full justify-center bg-[#FDFCFB] text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#fdfcfb] p-[60px] md:w-[56%]">
        <div className="relative flex w-full flex-col items-center md:max-w-[821px]">
          <Link
            href={"/home?step=1"}
            className="absolute left-0 top-0 flex items-center gap-3 hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0C18.617 0 24 5.38298 24 12C24 18.617 18.617 24 12 24C5.38298 24 0 18.617 0 12C0 5.38298 5.38298 0 12 0ZM8.29298 12.707L13.293 17.707C13.488 17.902 13.744 18 14 18C14.256 18 14.512 17.902 14.707 17.707C15.098 17.316 15.098 16.684 14.707 16.293L10.414 12L14.707 7.707C15.098 7.31602 15.098 6.684 14.707 6.29302C14.316 5.90203 13.684 5.90203 13.293 6.29302L8.29298 11.293C7.902 11.684 7.902 12.316 8.29298 12.707Z"
                fill="#202124"
              />
            </svg>
            <span className="text-sm font-semibold leading-[21px]">Back</span>
          </Link>
          <div className="flex w-full items-center justify-center">
            <Image src={logo} alt="logo" objectFit="cover" height={32} />
          </div>
          <div className="flex w-full flex-col items-center gap-y-[60px] md:w-[489px]">
            <div className=" mt-[32px] md:mt-[64px]">
              <div className="text-center text-[36px] font-semibold leading-[54px] ">
                Who you are?
              </div>
            </div>
            <div className="flex flex-col gap-y-[11px]">
              {menu.map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setClientType(item.value);
                      setId(item.id);
                    }}
                    className={`flex h-[56px] w-[400px] items-center justify-center rounded-[6px] border-[1px] border-solid ${
                      item.id == id
                        ? "border-[#2b4896] bg-[#eaedf5]"
                        : "border-[#DEDEDE] hover:bg-[#DEDEDE]"
                    }`}
                  >
                    <div className="mr-[8px] h-[24px] w-[24px]">
                      <Image src={item.icon} alt="icon" objectFit="cover" />
                    </div>
                    <div className="text-[12px] font-medium capitalize leading-[18px]">
                      {item.content}
                    </div>
                  </button>
                );
              })}
            </div>
            <Link href={"/dashboard"}>
              <MainButton
                onClick={handleClick}
                title="Get Started"
                icon={arrowRight}
                bold
              />
            </Link>
            <div className="text-center">
              <div className="text-[16px] font-normal leading-[24px]">
                Your needs are our top priority. Let us help to get them done!
              </div>
              {/* <button
                onClick={async () => {
                  await handleLogoutGoogle();
                  router.push("/");
                }}
                className="mt-[32px] text-[16px] font-semibold leading-[24px]"
              >
                Go Back
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex h-full w-full justify-center rounded-l-2xl bg-[url(/images/howtobuy/banner.png)] bg-cover md:w-[44%]">
        <div className="flex h-full w-full items-end justify-center md:w-[619px] md:px-[35px] md:pb-[32px]">
          <div className="h-[260px] w-full rounded-[10px] bg-[rgba(255,242,242,0.13)] px-[48px] py-[40px] backdrop-blur-[50px]">
            <div className="flex h-[46.05px] w-[265.05px] items-center justify-center rounded-[12px] bg-[#FEF9EE]">
              <div className="mr-[12px] h-[22px] w-[22px]">
                <Image src={thumbUp} alt="thumbs Up" objectFit="cover" />
              </div>
              <div className="text-[14px] font-medium leading-[21px]">
                End to End e-invoice service
              </div>
            </div>
            <div className="mt-[32px] w-full text-[20px] font-normal leading-[34px] text-[#dedede] md:w-[90%]">
              Our innovative solutions aim to solve and ease the pain point of
              business and every end-user.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhoYouAre;
