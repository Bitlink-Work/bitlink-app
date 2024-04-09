import Image from "next/image";

type Props = {
  type: string;
  title: string;
  value: string;
};

const CardType: Record<string, string> = {
  CHECK: "/images/dashboard/check.svg",
  NOTI: "/images/dashboard/noti.svg",
  WARNING: "/images/dashboard/warning.svg",
  BAG: "/images/dashboard/bag.svg",
  COIN: "/images/dashboard/coin.svg",
};

const Card = ({ type, title, value }: Props) => {
  return (
    <div className="flex w-fit flex-row items-center justify-center gap-4 rounded-xl border border-[#DEDEDE] bg-[#fff] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full">
        <Image
          loader={({ src }) => src}
          src={CardType[type]}
          width={40}
          height={40}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start gap-2 text-sm leading-[150%]">
        <h4 className="whitespace-nowrap font-normal text-text-secondary">
          {title}
        </h4>
        <p className="font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default Card;
