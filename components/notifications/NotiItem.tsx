import { Status } from "@/constants";
import Image from "next/image";

type Props = {
  status: string;
};

function NotiItem({ status }: Props) {
  return (
    <div className="flex h-fit w-full flex-row items-start justify-between gap-6 px-3 pb-2 pt-3">
      <div className="flex h-fit w-fit flex-row items-center justify-between gap-3">
        <div className="h-8 w-8">
          <Image
            src="/images/dashboard/invoice.svg"
            alt="Invoice"
            width={32}
            height={32}
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-1 text-sm leading-[150%] text-text-primary">
          <p className="font-semibold">USDT 1.99</p>
          <p className="whitespace-nowrap font-normal">
            Western Sydney University
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div
          className={`h-fit w-[155px] rounded border-l-[1.5px] px-3 py-2`}
          style={{
            background: Status[`${status}`]?.background,
            borderLeft: `1.5px solid ${Status[`${status}`].border}`,
          }}
        >
          <p className="whitespace-nowrap text-sm font-medium leading-[150%] text-text-secondary">
            {Status[`${status}`].text}
          </p>
        </div>
        <p className="text-xs font-medium leading-[150%] text-text-secondary">
          44m
        </p>
      </div>
    </div>
  );
}

export default NotiItem;
