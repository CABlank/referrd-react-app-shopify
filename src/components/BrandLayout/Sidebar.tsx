import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "../../contexts/SessionContext"; // Import the useSession hook

import MenuIcon from "../Icons/MenuIcon";
import CloseMenuIcon from "../Icons/CloseMenuIcon";
import DashboardIcon from "../Icons/DashboardIcon";
import CampaignIcon from "../Icons/CampaignIcon";
import CompanyIcon from "../Icons/CompanyIcon";
import FaqsIcon from "../Icons/FaqsIcon";
import LogoutIcon from "../Icons/LogoutIcon";
import PaymentsIcon from "../Icons/PaymentsIcon";
import ReferralsIcon from "../Icons/ReferralsIcon";
import SettingsIcon from "../Icons/SettingsIcon";
import SupportIcon from "../Icons/SupportIcon";
import WiseIcon from "../Icons/WiseIcon";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  route?: string;
  action?: () => void;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { logout } = useSession(); // Get the logout function from the session context
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: DashboardIcon, route: "/brand/dashboard" },
    { name: "Company", icon: CompanyIcon, route: "/brand/company" },
    { name: "Campaigns", icon: CampaignIcon, route: "/brand/campaigns" },
    { name: "Payments", icon: PaymentsIcon, route: "/brand/payments" },
    { name: "Referrals", icon: ReferralsIcon, route: "/brand/referrals" },
    { name: "Settings", icon: SettingsIcon, route: "/brand/settings" },
    { name: "Support", icon: SupportIcon, route: "/brand/support" },
    { name: "Data Security", icon: WiseIcon, route: "/brand/datasecurity" },
  ];

  const bottomMenuItems: MenuItem[] = [
    { name: "FAQs", icon: FaqsIcon, route: "/brand/faqs" },
    { name: "Logout", icon: LogoutIcon, action: logout }, // Add logout action
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const navigate = (routePath?: string) => {
    if (routePath) {
      router.push(routePath);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.action) {
      item.action();
    }
  };

  const isActiveRoute = (routePath?: string): boolean => {
    if (!routePath) return false;
    const normalizedCurrentPath = router.asPath.toLowerCase();
    const normalizedRoutePath = routePath.toLowerCase().startsWith("/")
      ? routePath.toLowerCase()
      : `/${routePath.toLowerCase()}`;
    return normalizedCurrentPath.startsWith(normalizedRoutePath);
  };

  const getItemClass = (item: MenuItem) => {
    return isActiveRoute(item.route)
      ? "text-white bg-[#47B775]"
      : "text-black/80 hover:bg-[rgba(71,183,117,0.2)]";
  };

  const getIconColor = (item: MenuItem) => {
    return isActiveRoute(item.route) ? "white" : "black";
  };

  const SidebarContent = (items: MenuItem[]) => (
    <>
      {items.map((item) => (
        <div
          key={item.name}
          onClick={() => handleItemClick(item)}
          className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-4 py-2 rounded cursor-pointer ${getItemClass(
            item
          )}`}
        >
          <item.icon fillColor={getIconColor(item)} />
          <p>{item.name}</p>
        </div>
      ))}
    </>
  );

  return (
    <div>
      {/* Mobile Sidebar Button */}
      {!isSidebarOpen && (
        <div className="lg:hidden absolute top-[30px] left-8 z-20">
          <button
            onClick={toggleSidebar}
            className="bg-white p-2 rounded-full shadow-lg"
          >
            <MenuIcon />
          </button>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 w-72 h-full bg-white text-white overflow-y-auto space-y-6 py-7 px-2 transition-transform duration-300 ease-in-out lg:hidden z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar}>
            <div>
              <CloseMenuIcon />
            </div>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="text-center flex justify-center !mt-[0px]">
          <img
            src="https://2fe5-79-117-226-83.ngrok-free.app/images/logo.png"
            alt="Logo"
            width={150}
            height={90}
          />
        </div>
        <div
          className="flex flex-col items-start self-stretch gap-4"
          style={{ margin: "60px 0 0 20px" }}
        >
          {SidebarContent(menuItems)}
        </div>
        <div
          className="flex flex-col items-start self-stretch gap-4"
          style={{ margin: "60px 0 0 20px" }}
        >
          {SidebarContent(bottomMenuItems)}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[21] ease-in-out lg:hidden"
        ></div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col items-start w-[280px] h-full px-5 py-10 pb-20 bg-white inset-y-0 desktop-sidebar">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[800px] relative gap-14">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <div className="flex justify-start w-full h-[58px] object-cover mb-[50px] ml-[10px]">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={150}
                height={90}
              />
            </div>
            {SidebarContent(menuItems)}
          </div>
          <div className="mt-[5px] flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            {SidebarContent(bottomMenuItems)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
