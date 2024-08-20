import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useSession } from "../../../context/SessionContext";

type CustomerLayoutProps = {
  children: React.ReactNode;
};

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
    }
  }, [session, router]);

  if (!session || session.user.role !== "customer") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>{" "}
        {/* You can replace this with a spinner or loading component */}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="lg:w-80 flex-shrink-0"></div>
      <div className="flex-1 overflow-y-auto">
        <header></header>
        <div className="pt-[25px] pb-[20px] lg:pt-[5rem]"></div>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default CustomerLayout;
