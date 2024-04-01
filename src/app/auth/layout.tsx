import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-10 flex h-full items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
