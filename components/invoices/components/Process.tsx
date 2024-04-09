import { EnumTypeProfile } from "@/public/utils/constants";

type Props = {
  step: number;
};

const formValue = {
  sender: {
    name: "Thanh Hong Phuc Ha",
    email: "etteam8@gmail.com",
  },
  receiver: {
    name: "ESOLLABS",
    email: "phuc.hth@esollabs.com",
  },
  currency: {
    symbol: "ETH",
    name: "Ethereum",
  },
  address: "0xC4e87dCA8C105F78B63AE57b0d8CB9a39B5CEB0e",
  amount: {
    quantity: 1,
    total: 6.0,
  },
};

const PROCESS = [
  {
    id: 0,
    step: 1,
    title: "Your credentials",
    isCompleted: false,
  },
  {
    id: 1,
    step: 2,
    title: "Billed to",
    isCompleted: false,
  },
  {
    id: 2,
    step: 3,
    title: "Invoice Currency",
    isCompleted: false,
  },
  {
    id: 3,
    step: 4,
    title: "Receive Payment",
    isCompleted: false,
  },
  {
    id: 4,
    step: 5,
    title: "Amount Details",
    isCompleted: false,
  },
];

const Process = ({
  invoiceInfo,
  profile,
  step,
  currency,
  receiver,
  formValues,
  totalBill,
}: any) => {
  return (
    <div className="flex flex-row items-start justify-start gap-[60px]">
      <div>
        {PROCESS.map((item) => (
          <div key={item.id} className="h-[103px] w-fit">
            <div
              className={`after:contents-[''] relative flex h-8 w-8 items-center justify-center rounded-full ${
                item.step <= step
                  ? "bg-[#43A048] text-[#fff] after:border-[#43A048]"
                  : "bg-[#E9E9E9] text-text-primary after:border-[#DEDEDE]"
              } after:absolute after:left-[50%] after:top-[100%] after:h-[71px] after:-translate-x-1/2 after:border-[2px] after:border-dashed ${
                item.step === 5 ? "after:hidden" : ""
              }`}
            >
              <p className="text-sm font-semibold leading-[150%]">
                {item.step}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[0].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
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
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {profile?.email_google || ""}
            </p>
          </div>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[1].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {receiver?.type === EnumTypeProfile.Freelancer
                ? `${receiver?.partner_first_name} ${receiver?.partner_last_name}`
                : receiver?.partner_company || invoiceInfo?.to_company || ""}
            </p>
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {receiver?.partner_email || invoiceInfo?.to_email || ""}
            </p>
          </div>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[2].title}
          </p>
          <p className="text-xs font-normal leading-[150%] text-text-secondary">
            {currency || invoiceInfo?.currency || ""}
          </p>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[3].title}
          </p>
          <div className="flex max-w-[224px] flex-col items-start gap-[6px]">
            <p className="break-all text-xs font-normal leading-[150%] text-text-secondary">
              {/* Wallet ({formValues?.to_wallet.slice(0, 6)}{" "}
              {formValues?.to_wallet.slice(-4)}) Wallet ( */}
              Wallet ({formValues?.to_wallet}){" "}
            </p>
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              in {formValues?.currency || invoiceInfo?.currency || ""} (on{" "}
              {formValues?.chain || invoiceInfo?.chain || ""})
            </p>
          </div>
        </div>
        <div className="h-[103px] w-fit">
          <p className="text-sm font-semibold leading-[150%] text-text-primary">
            {PROCESS[4].title}
          </p>
          <div className="flex flex-col items-start gap-[6px]">
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              {formValues?.items?.length || ""} items
            </p>
            <p className="text-xs font-normal leading-[150%] text-text-secondary">
              Total: {formValues?.currency}{" "}
              {Math.round(totalBill * 1000000) / 1000000 || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;
