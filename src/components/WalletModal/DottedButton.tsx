import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: String;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
}

const DottedButton = ({ children, className = "", ...rest }: Props) => {
  return (
    <button
      className={
        `flex items-center justify-center py-4 w-full font-bold text-xl tracking-wide capitalize ` +
        `box-border border-dashed border-black-800 border-2 rounded-xl text-center text-grey-400 ${className} ` +
        `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white`
      }
      {...rest}>
      {children}
    </button>
  );
};

const Icon = ({ Icon }: any) => {
  return (
    <span className='p-3 mr-4 rounded-full bg-black-700'>
      <Icon className='w-5 h-5' />
    </span>
  );
};

DottedButton.Icon = Icon;

export default DottedButton;
