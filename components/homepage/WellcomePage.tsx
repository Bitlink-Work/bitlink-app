import { authLogoutGoogle } from "@/public/actions";
import { auth } from "@/public/api/firebase";
import { useAppDispatch } from "@/public/hook/hooks";
import thumbUp from "@/public/images/login/thumbsUp.png";
import logo from "@/public/images/register/logoWhite.png";
import arrowRightBlue from "@/public/images/welcome/arrow-right-blue.svg";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";

const WellcomePage = ({ setStep }: any) => {
  const menu = [
    {
      id: 1,
      title: "Let’s get you verified  ⭐",
      content:
        "Taking the KYB/KYC process to ensure your authentication and partners.",
    },
    {
      id: 2,
      title: "Create virtual account 🔥",
      content:
        "Businesses can create various virtual accounts to manage and reconcile their finances and money flow more effectively.",
    },
  ];
  const router = useRouter();
  const handleClick = () => {
    router.push("/home?step=2");
  };
  const dispatch = useAppDispatch();

  const handleLogoutGoogle = async () => {
    // onChangeWallet("");
    signOut(auth);
    // setLogged(false);
    dispatch(authLogoutGoogle({}));
  };
  return (
    <div className="flex w-full justify-center text-text-primary md:h-[100vh] md:min-h-[900px]">
      <div className="flex h-full w-full justify-center bg-primary p-[60px] md:w-[56%]">
        <div className="flex w-full flex-col items-center md:max-w-[821px]">
          <div className="flex w-full items-center justify-between">
            <Image src={logo} alt="logo" objectFit="cover" height={32} />
          </div>
          <div className="flex w-full flex-col items-center gap-y-[60px] md:w-[500px]">
            <div className=" mt-[32px] text-[#fff] md:mt-[98.5px]">
              <div className="text-center text-[36px] font-semibold leading-[54px] ">
                Welcome to Bitlink
              </div>
              <div className="mt-[12px] text-[20px] font-normal leading-[34px]">
                Easily manage your business&apos;s crypto finances!
                <span>🤩</span>
              </div>
            </div>
            <div className="flex gap-x-[32px]">
              {menu.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="h-[191px] w-[334.5px] rounded-[16px] bg-[#556dab] p-[24px] text-[#fff]"
                  >
                    <div className="p-[8] text-center text-[18px] font-semibold leading-[27px]">
                      {item.title}
                    </div>
                    <div className="w-full p-[8px] text-[14px] font-normal leading-[21px] text-[#eaedf5] md:w-[90%]">
                      {item.content}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-center gap-y-[48px]">
              <button
                onClick={() => handleClick()}
                className="flex h-[48px] w-[163px] items-center justify-center gap-x-[10px] rounded-[8px] bg-[#fff] text-[14px] 
                font-semibold leading-[21px] text-primary hover:opacity-90"
              >
                Get Started
                <div className="h-[24px] w-[24px]">
                  <Image
                    src={arrowRightBlue}
                    alt="arrow right icon"
                    objectFit="cover"
                  />
                </div>
              </button>
              <div className="flex items-center justify-center text-[#fff]">
                <div className="mr-[8px] text-[14px] font-normal leading-[21px]">
                  Wrong account?
                </div>
                <button
                  onClick={async () => {
                    await handleLogoutGoogle();
                    router.push("/");
                  }}
                  className="text-[14px] font-semibold leading-[21px]"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary md:w-[44%]">
        <div className="relative flex h-full w-full justify-center rounded-l-[16px] bg-[url(/images/welcome/banner.png)] bg-cover">
          <div className="flex h-full w-full items-end justify-center md:w-[619px] md:px-[35px] md:pb-[32px]">
            <div className="h-[260px] w-full rounded-[10px] bg-[rgba(255,242,242,0.13)] px-[48px] py-[40px] backdrop-blur-[50px] ">
              <div className="flex h-[46.05px] w-[265.05px] items-center justify-center rounded-[12px] bg-[rgba(254,249,238,1)]">
                <div className="mr-[12px] h-[22px] w-[22px]">
                  <Image src={thumbUp} alt="thumbs Up" objectFit="cover" />
                </div>
                <div className="text-[14px] font-medium leading-[21px]">
                  End to End e-invoice service
                </div>
              </div>
              <div className="mt-[32px] w-full text-[20px] font-normal leading-[34px] text-[#fff] md:w-[90%]">
                Our innovative solutions aim to solve and ease the pain point of
                business and every end-user.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WellcomePage;
