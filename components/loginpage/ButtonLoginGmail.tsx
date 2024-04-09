import { alertActions } from "@/public/actions/alert.actions";
import {
  authLoginGoogle,
  authLogoutGoogle,
  getProfile,
} from "@/public/actions/index";
import { auth } from "@/public/api/firebase";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import { randomKeyUUID } from "@/public/utils/lib";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";

import icGG from "@/public/images/register/icGG.png";
import { addAlert } from "@/public/reducers/alert";
import { selectProfile } from "@/public/reducers/profileSlice";
import { LocalStorage } from "@/public/utils/LocalStorage";
import { useRouter } from "next/navigation";
import { kybServices } from "@/public/api/kybService";
import { kycServices } from "@/public/api/kycService";
import { EnumTypeProfile } from "@/public/utils/constants";
const ButtonLoginGmail = ({
  handleClose,
  isOpenModal,
  title = "Continue with Gmail",
}: any) => {
  const key = randomKeyUUID();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [kybInfo, setKybInfo] = useState<any>();
  const [kycInfo, setKycInfo] = useState<any>();

  const [loadingGG, setLoadingGG] = useState(false);

  useEffect(() => {
    setLoadingGG(false);
  }, [isOpenModal]);

  const handleLoginGoogle = async () => {
    if (!loadingGG) {
      setLoadingGG(true);
      dispatch(
        alertActions.loading(
          {
            title: "Processing",
            description: `Gmail connecting...`,
          },
          key,
        ),
      );
      await signInWithPopup(auth, new GoogleAuthProvider())
        .then((res) => {
          loginGoogle(res);
          dispatch(
            addAlert({
              type: "success",
              key: 1,
              message: {
                status: "success",
                title: "Login Sucessfully",
                description: "",
              },
              duration: undefined,
            }),
          );
          // dispatch(getProfile({}));
          handleClose();
        })
        .catch((err) => {
          setLoadingGG(false);
          dispatch(
            addAlert({
              type: "warning",
              key: 1,
              message: {
                status: "warning",
                title: "Connect",
                description: `${err.message}`,
              },
              duration: undefined,
            }),
          );
        })
        .finally(() => {
          setLoadingGG(false);
        });
    }
  };

  const loginGoogle = async (res: any) => {
    if (res) {
      await dispatch(
        authLoginGoogle({
          token: res.user.accessToken,
          // email: res.user.email,
        }),
      )
        .unwrap()
        .then((originalPromiseResult) => {
          const { data } = originalPromiseResult;
          if (data && data.access_token) {
            setLoadingGG(false);
            localStorage.removeItem("_acc");
            handleClose();
            dispatch(
              alertActions.update(
                {
                  status: "success",
                  title: "Connected",
                  description: `Connect Google successfully`,
                  details: {
                    url: "../profile",
                    label: "Update Information",
                    color: "#699B8C",
                    action: () => {
                      // dispatch(openEditModal());
                    },
                  },
                },
                key,
              ),
            );
          }
        })
        .catch((rejectedValueOrSerializedError) => {
          dispatch(
            addAlert({
              type: "warning",
              key: 1,
              message: {
                status: "warning",
                title: "Connect",
                description: `${rejectedValueOrSerializedError.message}`,
              },
              duration: undefined,
            }),
          );
          // dispatch(
          //   alertActions.update(
          //     {
          //       title: 'Connect',
          //       status: 'warning',
          //       description: rejectedValueOrSerializedError.message,
          //     },
          //     key
          //   )
          // )
        });
    }
  };
  // const profile = useAppSelector(selectProfile);
  // useEffect(() => {
  //   if (!profile) {
  //     dispatch(getProfile({}));
  //   }
  // }, []);
  const handleLogoutGoogle = async () => {
    // onChangeWallet("");
    signOut(auth);
    // setLogged(false);
    dispatch(authLogoutGoogle({}));
  };

  const profile = useAppSelector(selectProfile);

  const getkybInfo = async () => {
    localStorage.removeItem("isSubmit");
    localStorage.setItem("isSubmit", "0");
    const res = await kybServices.getInfoKyb(profile?.user_id);

    localStorage.setItem("isSubmit", res ? "1" : "0");
  };

  const getkycInfo = async () => {
    localStorage.removeItem("isSubmit");
    localStorage.setItem("isSubmit", "0");

    const res = await kycServices.getKYC(profile?.user_id);

    localStorage.setItem("isSubmit", res ? "1" : "0");
  };

  useEffect(() => {
    if (profile?.type === EnumTypeProfile.Business) {
      getkybInfo();
    } else if (profile?.type === "FREELANCER") {
      getkycInfo();
    }
  }, [profile]);
  const getProvider = () => {};

  const provider = getProvider();

  //  const getSignMessage = async () => {
  //    try {
  //      const res = await authService.getSignMessage();
  //      return res;
  //    } catch (err) {
  //      console.log("err", err);
  //    }
  //  };

  useEffect(() => {
    const token = LocalStorage.getAccessToken();

    if (profile && token) {
      setLoadingGG(false);
      if (profile?.is_new) {
        router.push("/home?step=1");
        // if (profile?.type) {
        //   router.push("/home?step=2");
        // } else {
        //   router.push("/home?step=1");
        // }
      } else {
        router.push("/dashboard");
      }
    } else if (token && profile === null) {
      setLoadingGG(true);
      dispatch(getProfile({}));
    }
  }, [dispatch, profile, router]);

  useEffect(() => {
    if (isOpenModal) {
      setLoadingGG(true);
    } else {
      setLoadingGG(false);
    }
  }, [isOpenModal]);

  return (
    <>
      <button
        className={`${
          loadingGG ? "bg-table-bg-column" : "bg-white/5"
        } flex w-full flex-row items-center justify-between rounded-[6px] border border-[#E8E8E8] px-6 py-3 hover:bg-[#DEDEDE] active:bg-[#EAEDF5]`}
        onClick={() => {
          handleLoginGoogle();
        }}
      >
        <div className="flex w-full flex-row items-center justify-center">
          <div className="flex flex-row items-center">
            <div className="mr-[8px] h-[24px] w-[24px]">
              <Image src={icGG} alt="gmail_logo" className="h-7 w-7" />
            </div>
            <p className="truncate text-xs font-medium text-black">
              {loadingGG ? "Connecting..." : title}
            </p>
          </div>
          {loadingGG && <div className="loading" />}
        </div>
      </button>
    </>
  );
};

export default ButtonLoginGmail;
