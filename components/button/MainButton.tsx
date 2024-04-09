import Image from "next/image";
import React from "react";

interface IProps {
  title?: string | React.ReactElement;
  className?: string;
  icon?: any;
  outline?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  hideBorder?: boolean;
  bold?: boolean;
  type?: "button" | "submit" | "reset";
}

const MainButton = ({
  title,
  className,
  icon,
  outline,
  disabled,
  onClick,
  hideBorder,
  bold = false,
  type = "submit",
}: IProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      className={`
                flex items-center justify-center gap-[10px] rounded-lg px-6 py-3
                ${
                  outline
                    ? `${!hideBorder && "border border-[#BDC6DE]"}`
                    : "bg-primary hover:bg-btn-hover"
                }
                ${
                  disabled &&
                  "pointer-events-none cursor-not-allowed opacity-50"
                }
                ${className} transition-all
            `}
    >
      {title && (
        <p
          className={`text-sm   ${bold ? "font-semibold" : "font-medium"} ${
            outline ? "text-text-primary" : "text-text-white"
          }`}
        >
          {title}
        </p>
      )}
      {icon && (
        <Image src={icon} alt="icon" objectFit="cover" sizes="24" width={24} />
      )}
    </button>
  );
};

export default MainButton;
