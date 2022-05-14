import React, { MutableRefObject } from "react";

const index = ({
  ref,
  icon,
  placeholder,
  name,
  type,
  className = "",
}: {
  ref?: MutableRefObject<HTMLInputElement | null>;
  icon?: JSX.Element;
  placeholder: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  className?: string;
}) => {
  return (
    <div
      className={`${className} block relative text-white focus-within:text-white w-full`}
    >
      <input
        ref={ref}
        type={type}
        name={name}
        className="py-2 text-white rounded-lg pr-8 pl-3 focus:outline-none bg-dodo-void-light focus:text-white w-full placeholder:text-gray-300 font-normal focus:font-semibold"
        placeholder={placeholder}
        autoComplete="off"
      />
      {icon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {icon}
        </span>
      )}
    </div>
  );
};

export default index;
