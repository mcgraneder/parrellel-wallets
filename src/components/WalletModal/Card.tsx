import React from "react";

interface CardProps {
  children: React.ReactNode;
  ExitIcon?: any;
  dialog?: boolean;
  className?: string;
  onExitIconClick?: any;
  responsiveOverride?: string;
}

interface CardTitle {
  children: React.ReactNode;
  small?: boolean;
  className?: string;
}

interface CardDescription {
  children: React.ReactNode;
  className?: string;
}

const Card = ({
  children,
  ExitIcon,
  onExitIconClick,
  className = "",
  dialog = false,
  responsiveOverride,
}: CardProps) => {
  function handleOnExitIconClick(e: any) {
    e?.preventDefault();
    e?.stopPropagation();
    onExitIconClick?.();
  }

  return (
    <div
      className={`relative pt-6 md:pt-12 ${
        dialog
          ? " xl:mt-0 md:w-550px px-6 pb-6 md:px-12"
          : " md:w-630px px-4 pb-4 sm:px-6 sm:pb-6 md:px-14"
      } md:bg-black-800 h-fit rounded-32px w-full md:pb-[52px] ${className} ${responsiveOverride}`}>
      {ExitIcon && (
        <button
          className='absolute flex items-center w-8 h-8 p-1 rounded-full bg-black-900 md:p-2 md:w-10 md:h-10 sm:top-6 right-4 xs:right-6 sm:right-24'
          onClick={handleOnExitIconClick}>
          {/* <ExitIcon className='flex w-full h-full m-auto text-gray-400' /> */}
        </button>
      )}
      {children}
    </div>
  );
};

const Title = ({ children, small = false, className = "" }: CardTitle) => {
  return (
    <p
      className={`${
        !small && "md:text-4xl font-extrabold"
      } tracking-wide md:text-2xl md:leading-9 text-[22px] font-bold text-white capitalize mb-2 ${className}`}>
      {children}
    </p>
  );
};

const Description = ({ children, className = "" }: CardDescription) => {
  return (
    <p
      className={`w-auto md:text-base text-[14px] font-medium tracking-wide text-grey-400 ${className}`}>
      {children}
    </p>
  );
};

Card.Title = Title;
Card.Description = Description;
export default Card;
