import { useInvoiceContext } from "@/context/InvoiceContextProvider";
import { useAppSelector } from "@/public/hook/hooks";
import { selectListPartners } from "@/public/reducers/partnerSlice";
import Image from "next/image";
type Props = {
  setShowEditInfo: (show: boolean) => void;
};

const sender = {
  fistName: "Phuc",
  lastName: "Ha",
  company: "Western Sydney University",
  address: "90M HQV",
  city: "Ho Chi Minh City",
  postal_code: "07000 Phu Thuan",
  country: "Vietnam",
  email: "etteam8@gmail.com",
};

const ReviewReceiver = ({ setShowAddClient, step9Data }: any) => {
  const listPartner: IProfileOwner[] = useAppSelector(selectListPartners);
  const { setIsOpen, setIsOwner, dataInvoice } = useInvoiceContext();
  const profileOwner = listPartner.find(
    (element) => element.partner_id === dataInvoice.to_id,
  );
  return (
    <div className="flex w-full flex-col items-start gap-6 border-b-[1.5px] border-dashed border-[#DEDEDE] p-6">
      <div className="flex flex-row items-center gap-[6px] text-sm font-semibold leading-[150%] text-text-primary">
        <h5>Bill to</h5>
        <button
          onClick={() => {
            setShowAddClient && setShowAddClient(true);
            setIsOpen(true);
            setIsOwner(true);
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
      </div>

      <div className="flex flex-col items-start gap-[3px] text-sm font-normal leading-normal text-text-primary">
        <div className="flex flex-row items-center gap-3">
          {profileOwner?.type === "FREELANCER" ? (
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
            {/* {step9Data?.client?.type === "FREELANCER"
              ? `${step9Data?.client?.fistName} ${step9Data?.client?.lastName}`
              : profileOwner?.partner_company} */}
            {profileOwner?.type === "FREELANCER"
              ? profileOwner &&
                profileOwner?.partner_last_name &&
                profileOwner?.partner_first_name !== "" &&
                profileOwner?.partner_last_name !== ""
                ? `${profileOwner?.partner_first_name} ${profileOwner?.partner_last_name}`
                : ""
              : profileOwner?.partner_company
                ? profileOwner?.partner_company
                : ""}
          </p>
        </div>
        <p>{profileOwner?.partner_email}</p>
        <p>{profileOwner?.partner_address_line1}</p>
        <p>{profileOwner?.partner_address_line2}</p>
        <p>
          {profileOwner?.partner_postal_code} {profileOwner?.partner_city}
        </p>
        <p>{profileOwner?.partner_country}</p>
      </div>
    </div>
  );
};

export default ReviewReceiver;
