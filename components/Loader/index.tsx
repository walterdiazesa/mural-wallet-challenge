import React from "react";
import Image from "next/image";

const index = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen max-w-screen animate-pulse">
      <div className="relative h-32 w-32 md:h-48 md:w-48">
        <Image
          src="/icon-512x512.png"
          alt="logo"
          priority
          layout="fill"
          objectFit="contain"
        />
      </div>
      <p className="text-white mt-2">Loading your dododata...</p>
    </div>
  );
};

export default index;
