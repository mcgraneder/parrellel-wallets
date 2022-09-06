import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
}

function PrimaryButton({ children, disabled, loading, className = "", ...rest }: Props) {
  return (
    <button
      className={`flex w-30 h-30 items-center px-10 py-4 rounded-full font-bold text-center text-white bg-green-500 ${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`}
      disabled={disabled || loading}
      {...rest}>
      {children}
      {loading && (
        <span className='ml-1 animate-spin'>
          {/* <UilSpinnerAlt /> */}
        </span>
      )}
    </button>
  );
}

export default PrimaryButton;
