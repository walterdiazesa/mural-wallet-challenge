import React from "react";

const index = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="min-h-screen min-w-screen max-w-screen bg-dodo-void">
      {children}
    </div>
  );
};

export default index;
