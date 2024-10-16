import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import BudgetLeft from "./BudgetLeft";
import Avatar from "./Avatar";
import { useSession } from "../../../context/SessionContext";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

type CustomerLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, title }) => {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || session.user.role !== "Customer")) {
      router.push("/login");
    }
  }, [session, loading, router]);

  if (loading || !session || session.user.role !== "Customer") {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div id="scroll" className="flex-1 overflow-y-auto">
        <div className="px-1">
          {/* Header with Budget Information, Avatar, and Page Title */}
          <div className="py-[40px]  z-[15] sticky lg:static top-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#10ad1b] text-[5px] lg:text-[40px] ">{title}</p>
              <div className="flex items-center gap-4">
                <BudgetLeft />
                <Avatar />
              </div>
            </div>
          </div>

          {/* Main Page Content */}
          <main className="px-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
