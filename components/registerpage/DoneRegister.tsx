"use client";
import { authLogoutGoogle } from "@/public/actions";
import { auth } from "@/public/api/firebase";
import { useAppDispatch } from "@/public/hook/hooks";
import icCheck from "@/public/images/register/icCheck.png";
import logo from "@/public/images/register/logo.png";
import mailNew from "@/public/images/register/mail_new.png";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/pagination";
SwiperCore.use([Pagination]);

const DoneRegister = ({ step11Data }: any) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [review, setReview] = useState(false);
  const router = useRouter();
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: any) {
      return ReactDOMServer.renderToStaticMarkup(
        <div className={className}></div>,
      );
    },
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
  const dispatch = useAppDispatch();
  const handleLogoutGoogle = async () => {
    // onChangeWallet("");
    signOut(auth);
    // setLogged(false);
    dispatch(authLogoutGoogle({}));
  };

  useEffect(() => {
    let userInfo = localStorage?.getItem("user_account");
    if (userInfo) {
      setUserData(JSON.parse(userInfo));
    }
  }, []);

  return (
    <div className="flex w-full justify-between text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-[#FDFCFB] md:w-[57%]">
        <div className="w-full p-[60px] md:max-w-[821px]">
          <div className="flex w-full items-center justify-center text-[#98999A]">
            <div className="flex items-center justify-center">
              <div className="mr-[16px] h-[60px] w-[210px]">
                <Image src={logo} alt="logo" objectFit="cover" />
              </div>
              {/* <div className="text-center text-[40px] font-semibold leading-[51px] text-text-primary">
                Bitlink
              </div> */}
            </div>
          </div>
          <div className="relative mt-[51px] flex w-full flex-col items-center pt-[76px]">
            <div className="absolute top-[10%] z-0 h-[149px] w-[549px] translate-y-[-15%] bg-[url(/images/register/Confetti.png)] bg-cover"></div>

            <div className=" mt-[24px] w-full text-center text-[36px] font-semibold leading-[54px] text-[rgba(43,72,150,1)]">
              Almost done!{" "}
            </div>

            <div className="text-center text-[36px] font-semibold leading-[150%] text-text-primary">
              Check your inbox.
            </div>
            <div className="mb-[40px] mt-[32px] text-center text-[18px] font-normal leading-[150%] text-[#4d4d50]">
              Just confirm the link we sent you to{" "}
              <span className="font-bold">{userData?.email}</span> <br /> to
              verify your email address. It can take ~ 2-3 minutes.
            </div>

            <div className="mb-[16px] h-[48px] w-[48px]">
              <Image src={mailNew} alt="mailnew" objectFit="cover" />
            </div>
            <div className="text-center font-normal leading-[150%] text-[#4D4D50]">
              Didn&apos;t receive your confirmation email?
            </div>
            <div className="text-center font-normal leading-[150%] text-[#4D4D50]">
              <button className="text-[#1890FF]">Click here</button>{" "}
              <span>to receive a new one</span>
            </div>
            <div className="my-[40px] flex w-full items-center">
              <span className="h-[1px] flex-1  border border-solid border-[#DEDEDE] "></span>
              <span className="mx-3">Or</span>
              <span className="h-[1px] flex-1  border border-solid border-[#DEDEDE] "></span>
            </div>
            <div>
              <button
                onClick={async () => {
                  await handleLogoutGoogle();
                  router.push("/");
                }}
                className="rounded-lg border border-[#BDC6DE] px-6 py-3 text-[14px] font-semibold leading-[21px] text-[#444445]"
              >
                Logout
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center rounded-l-2xl bg-[rgba(43,72,150,1)] md:w-[43%]">
        <div className="h-[480px] w-full ">
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
    </div>
  );
};
export default DoneRegister;
