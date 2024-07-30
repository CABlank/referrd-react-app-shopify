import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/BrandLayout/Sidebar";
import BudgetLeft from "../../components/BrandLayout/BudgetLeft";
import Avatar from "../../components/BrandLayout/Avatar";
import { useSession } from "../../contexts/SessionContext";
import LoadingOverlay from "../../components/common/LoadingOverlay";
var BrandLayout = function (_a) {
    var children = _a.children, title = _a.title;
    var _b = useSession(), session = _b.session, loading = _b.loading;
    var router = useRouter();
    useEffect(function () {
        if (!loading && (!session || session.user.role !== "Brand")) {
            router.push("/login");
        }
    }, [session, loading, router]);
    if (loading || !session || session.user.role !== "Brand") {
        return <LoadingOverlay />;
    }
    return (<div className="flex h-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8">
          {/* Header with Budget Information, Avatar, and Page Title */}
          <div className="py-[40px] bg-[#f3f3f3] z-[15] sticky lg:static top-0">
            <div className="flex items-center justify-between">
              <p className="text-[40px] font-semibold text-[#10ad1b]">
                {title}
              </p>
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
    </div>);
};
export default BrandLayout;
