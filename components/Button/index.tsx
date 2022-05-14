import React from "react";

const index = ({
  children,
  className,
  onClick,
}: {
  children: string | JSX.Element;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`${className} bg-gradient-to-br rounded-lg py-2 px-4 font-medium text-white transform-gpu transition ease-in-out duration-200 shadow-lg hover:scale-105`}
      {...(onClick && { onClick })}
    >
      {children}
    </button>
  );
};

export default index;
