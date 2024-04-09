import { SIDEBAR_LIST } from "@/constants";
import logo from "@/images/register/logoWhite.png";
import solpay from "@/images/sidebar/solpay.png";
import wormhole from "@/images/sidebar/wormhole.png";
import { authLogoutGoogle } from "@/public/actions";
import { auth } from "@/public/api/firebase";
import { useAppDispatch } from "@/public/hook/hooks";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Instructions from "../instructions/Instructions";
import { IconSignOut } from "./Icon";

const Sidebar = () => {
  const [select, setSelect] = useState<string>("");

  const [active, setActive] = useState<string>("");

  const pathName = usePathname();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pathName !== "/") {
      setActive(pathName);
    }
  }, [pathName]);

  const handleLogoutGoogle = async () => {
    // onChangeWallet("");
    signOut(auth);
    // setLogged(false);
    dispatch(authLogoutGoogle({}));
  };

  const router = useRouter();
  const type = useSearchParams().get("type");
  useEffect(() => {
    if (pathName === "/invoices") {
      if (type === "sent") setActive("/sent-invoices");
      if (type === "receive") setActive("/received-invoices");
    }
  }, [pathName, type]);

  return (
    <div className="relative flex h-full flex-col items-start justify-between overflow-hidden rounded-br-[16px] rounded-tr-[16px] bg-primary px-[24px] py-8 transition">
      <div className="absolute left-[-270px] z-0 h-[660.13px] w-[818px] bg-[url('/images/sidebar/bg.svg')] bg-contain bg-center bg-no-repeat"></div>
      <div className="relative flex h-full w-[228px] flex-col overflow-y-auto">
        <Link
          href={"/dashboard"}
          className="mb-[32px] flex items-center gap-[12px] px-[16px]"
        >
          <div className="flex h-10 w-full items-center justify-start">
            <Image src={logo} alt="logo" width={140} height={40} />
          </div>
        </Link>
        <div className="flex w-full flex-col items-start gap-0">
          {SIDEBAR_LIST.map((item, index) => {
            // const active = select === item.link;
            // const checkItemSignOut = item.link === "/sign-out";

            return (
              <Instructions
                key={item.link}
                step={item.step || -1}
                title={item.name}
                showBg={false}
                left
              >
                <div
                  className={`w-full
                ${
                  active === item.link
                    ? "bg-primary-hover text-white"
                    : "text-text-white transition-all duration-300 hover:bg-primary-hover"
                } flex cursor-pointer items-center gap-[16px] overflow-hidden rounded-[8px] p-[16px]`}
                  onClick={async () => {
                    localStorage.removeItem("isSubmit");
                    if (item.link === "/sign-out") {
                      await handleLogoutGoogle();
                      router.push("/");
                    } else {
                      setActive(item.link);
                      router.push(item.link);
                    }
                  }}
                >
                  {item.icon}
                  <div className="text-[14px] leading-[21px] ">{item.name}</div>
                </div>
              </Instructions>
            );
          })}
        </div>
      </div>
      <>
        <div
          className={`relative w-full
              ${
                active === "/sign-out"
                  ? "bg-primary-hover text-white"
                  : "text-text-white transition-all duration-300 hover:bg-primary-hover"
              } flex cursor-pointer items-center gap-[16px] overflow-hidden rounded-[8px] p-[16px]`}
          onClick={async () => {
            localStorage.removeItem("isSubmit");
            const step = localStorage.getItem("step-instructions");

            await handleLogoutGoogle();
            router.push("/");
            localStorage.setItem(
              "step-instructions",
              JSON.stringify(Number(step)),
            );
          }}
        >
          <IconSignOut />
          <div className="text-[14px] leading-[21px] ">Sign out</div>
        </div>
        <div className="flex flex-col gap-3 px-4">
          <p className="text-[12px] font-normal leading-[18px] text-text-white">
            Powered by
          </p>
          <div className="flex items-center gap-2">
            <Image src={solpay} alt="solpay" height={20} />
            <Image src={wormhole} alt="wormhole" height={20} />
          </div>
          <p className="text-center text-[10px] font-medium leading-4 text-[#BDC6DE]">
            Version 1.0
          </p>
        </div>
      </>
    </div>
  );
};

export default Sidebar;
