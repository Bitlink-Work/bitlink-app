import { EnumTypeProfile } from "@/public/utils/constants";
import Image from "next/image";
import { useEffect } from "react";
type Props = {
  setShowEditInfo: (show: boolean) => void;
  setReceiver: (value: any) => void;
  setStep: (value: number) => void;
  setShowAddClient: (show: boolean) => void;
  setType: (value: string) => void;
  edit?: boolean;
  formValues: any;
  receiver: any;
  profile: any;
  invoiceInfo?: any;
  setInvoiceInfo?: any;
};

const Sender = ({
  setShowEditInfo,
  setReceiver,
  setStep,
  setShowAddClient,
  setType,
  formValues,
  receiver,
  profile,
  edit,
}: Props) => {
  useEffect(() => {
    if (receiver?.partner_id === undefined) {
      setReceiver(null);
    }
  }, [receiver]);
  return (
    <div className="grid w-full grid-cols-2 gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex flex-row items-center gap-[6px] text-sm font-semibold leading-[150%] text-text-primary">
          <h5>From</h5>
          <button
            onClick={() => setShowEditInfo && setShowEditInfo(true)}
            className="flex h-[16px] w-[16px] cursor-pointer items-center justify-center"
          >
            <Image
              src="/images/invoices/edit.svg"
              width={12}
              height={12}
              alt=""
            />
          </button>
        </div>
        <div className="flex flex-col items-start gap-[3px] text-sm font-normal leading-normal text-text-primary">
          <div className="flex flex-row items-center gap-3">
            {profile?.type === "FREELANCER" ? (
              <Image
                src="/images/invoices/personal.svg"
                width={24}
                height={24}
                alt={""}
              />
            ) : (
              <Image
                src="/images/invoices/business.svg"
                width={24}
                height={24}
                alt={""}
              />
            )}

            <p className="font-semibold">
              {profile?.type === EnumTypeProfile.Freelancer
                ? profile?.first_name &&
                  profile?.last_name &&
                  profile?.first_name !== "" &&
                  profile?.last_name !== ""
                  ? `${profile?.first_name} ${profile?.last_name}`
                  : profile?.name && profile?.name !== ""
                    ? profile?.name
                    : ""
                : profile?.company_name && profile?.company_name !== ""
                  ? profile?.company_name
                  : profile?.name && profile?.name !== ""
                    ? profile?.name
                    : ""}
            </p>
          </div>
          <p>{profile?.email_google}</p>
          {/* <p>{addressWalletCompact(profile?.public_address)}</p> */}
          <p>{profile?.address_line_1}</p>
          <p>{profile?.address_line_2}</p>
          <p>
            {profile?.postal_code} {profile?.city}
          </p>
          <p>{profile?.country}</p>
        </div>
      </div>
      {receiver?.partner_id !== undefined &&
        Object.keys(receiver).length > 0 && (
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex flex-row items-center gap-[6px] text-sm font-semibold leading-[150%] text-text-primary">
              <h5>Billed to</h5>
              <button
                onClick={() => {
                  setShowAddClient && setShowAddClient(true);
                  setType && setType("edit");
                }}
                className="flex h-[16px] w-[16px] cursor-pointer items-center justify-center"
              >
                <Image
                  src="/images/invoices/edit.svg"
                  width={12}
                  height={12}
                  alt=""
                />
              </button>
              {!edit && (
                <button
                  onClick={() => {
                    setStep(1);
                    setReceiver(null);
                  }}
                  className="flex h-[16px] w-[16px] cursor-pointer items-center justify-center"
                >
                  <Image
                    src="/images/invoices/delete.svg"
                    width={12}
                    height={3.33}
                    alt=""
                  />
                </button>
              )}
            </div>

            <div className="flex flex-col items-start gap-[3px] text-sm font-normal leading-normal text-text-primary">
              <div className="flex flex-row items-center gap-3">
                {receiver?.type === "FREELANCER" ? (
                  <Image
                    src="/images/invoices/personal.svg"
                    width={24}
                    height={24}
                    alt={""}
                  />
                ) : (
                  <Image
                    src="/images/invoices/business.svg"
                    width={24}
                    height={24}
                    alt={""}
                  />
                )}

                <p className="font-semibold">
                  {receiver?.type === EnumTypeProfile.Freelancer
                    ? `${receiver?.partner_first_name} ${receiver?.partner_last_name}`
                    : receiver?.partner_company}
                </p>
              </div>
              <p>{receiver?.partner_email}</p>
              <p>{receiver?.partner_address_line1}</p>
              <p>{receiver?.partner_address_line2}</p>
              <p>
                {receiver?.partner_postal_code} {receiver?.partner_city}
              </p>
              <p>{receiver?.partner_country}</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Sender;
