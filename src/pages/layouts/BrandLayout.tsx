import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/BrandLayout/Sidebar";
import BudgetLeft from "../../components/BrandLayout/BudgetLeft";
import Avatar from "../../components/BrandLayout/Avatar";
import { useSession } from "../../contexts/SessionContext";
import LoadingOverlay from "../../components/common/LoadingOverlay";

type BrandLayoutProps = {
  children: React.ReactNode;
};

const BrandLayout: React.FC<BrandLayoutProps> = ({ children }) => {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || session.user.role !== "Brand")) {
      router.push("/login");
    }
  }, [session, loading, router]);

  if (loading || !session || session.user.role !== "Brand") {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4">
          {/* Budget Information Block */}
          <div className="pt-[35px] pb-[20px] lg:pt-[2.5rem] bg-[#f3f3f3] z-[15] sticky lg:static top-0">
            <div className="flex items-start gap-4 justify-end">
              <BudgetLeft />
              <Avatar />
            </div>
          </div>

          {/* Main Page Content */}
          <main className="px-2">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default BrandLayout;
