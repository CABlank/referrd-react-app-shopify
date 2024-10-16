import React, { useState } from "react";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import useCustomers from "./hooks/useShares";
import WhatsappIcon from "@/components/icons/icons-social-media/WhatsappIcon";
import EmailIcon from "@/components/icons/icons-social-media/EmailIcon";
import FacebookIcon from "@/components/icons/icons-social-media/FacebookIcon";
import MessengerIcon from "@/components/icons/icons-social-media/MessengerIcon";
import SmsIcon from "@/components/icons/icons-social-media/SmsIcon";
import XIcon from "@/components/icons/icons-social-media/XIcon";
import LinkedinIcon from "@/components/icons/icons-social-media/LinkedinIcon";
import RedditIcon from "@/components/icons/icons-social-media/RedditIcon";

interface SharesIndexProps {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const SharesIndex: React.FC<SharesIndexProps> = ({ accessToken, refreshToken, userId }) => {
  const { customers, companies, loading } = useCustomers({
    accessToken,
    refreshToken,
    userId,
  });

  const [copyButtonTexts, setCopyButtonTexts] = useState<{
    [key: string]: string;
  }>({});

  // Array of background colors for the initials placeholder
  const bgColors = ["#851087", "#D32F2F", "#1976D2", "#388E3C", "#FBC02D", "#8E24AA", "#FF5722"];

  // Function to get a random color from the array
  const getRandomColor = () => bgColors[Math.floor(Math.random() * bgColors.length)];

  // Function to download the QR code as an image
  const downloadQRCode = (customerUUID: string, companyUUID: string, companyDomain: string) => {
    const canvas = document.getElementById(
      `qrCode-${customerUUID}-${companyUUID}`
    ) as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${companyDomain}-qr.png`);
        }
      });
    }
  };

  // Extract the company domain name (before ".com" or "myshopify.com")
  const extractCompanyDomain = (domain: string) => {
    const match = domain.match(/([^.]+)(?:\.myshopify\.com|\.com)/);
    return match ? match[1] : domain;
  };

  // Generate initials based on the company domain (up to 4 letters)
  const generateInitials = (domain: string) => {
    const nameParts = extractCompanyDomain(domain).split("-");
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 4);
  };

  // Function to copy URL to clipboard
  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopyButtonTexts((prevState) => ({
          ...prevState,
          [key]: "Copied!",
        }));
        setTimeout(() => {
          setCopyButtonTexts((prevState) => ({
            ...prevState,
            [key]: "Copy",
          }));
        }, 3000);
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  // Function to detect if the device is mobile
  const isMobile = () => {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
  };

  // Social Media Sharing Links with a custom message
  const socialMediaButtons = (referralUrl: string, companyDomain: string) => {
    const domainName = extractCompanyDomain(companyDomain);
    const message = `Hey, check this out, use my link for ${domainName}. Easy savings for you. ${referralUrl}`;

    return [
      {
        id: "whatsapp",
        url: `https://wa.me/?text=${encodeURIComponent(message)}`,
        icon: <WhatsappIcon />,
      },
      {
        id: "email",
        url: `mailto:?subject=Check this out&body=${encodeURIComponent(message)}`,
        icon: <EmailIcon />,
      },
      {
        id: "facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(message)}`,
        icon: <FacebookIcon />,
      },
      {
        id: "messenger",
        url: isMobile()
          ? `fb-messenger://share?link=${encodeURIComponent(referralUrl)}&app_id=123456789&quote=${encodeURIComponent(message)}`
          : `https://www.facebook.com/dialog/send?link=${encodeURIComponent(referralUrl)}&app_id=123456789&redirect_uri=${encodeURIComponent(referralUrl)}`,
        icon: <MessengerIcon />,
      },
      {
        id: "sms",
        url: `sms:?&body=${encodeURIComponent(message)}`,
        icon: <SmsIcon />,
      },
      {
        id: "x",
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
        icon: <XIcon />,
      },
      {
        id: "reddit",
        url: `https://www.reddit.com/submit?url=${encodeURIComponent(referralUrl)}&title=${encodeURIComponent(message)}`,
        icon: <RedditIcon />,
      },
      {
        id: "linkedin",
        url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralUrl)}&title=${encodeURIComponent(message)}`,
        icon: <LinkedinIcon />,
      },
    ];
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full p-1">
      {loading ? (
        <p>Loading...</p>
      ) : (
        customers.flatMap((customer) => {
          console.log("Processing customer:", customer.uuid); // Log the customer being processed

          // Flatten the companies array before using .find()
          const flattenedCompanies = companies.flat(); // Flatten array of arrays into a flat array

          // Extract companies from company_campaign_tracker
          const customerCompanies = customer.company_campaign_tracker.companies
            .map((companyData) => {
              const company = flattenedCompanies.find(
                (comp) => comp.UUID === companyData.company_id
              );
              console.log("Company data for customer:", companyData.company_id, company); // Log the company data
              return company;
            })
            .filter((company) => company !== undefined);

          console.log("Companies found for customer:", customerCompanies); // Log the customerCompanies array

          // Render customerCompanies for each customer
          return customerCompanies.map((company) => {
            if (!company) return null;

            const referralUrl = `https://${company.domain}?referrd-${customer.uuid}`;
            const key = `${customer.uuid}-${company.UUID}`;

            console.log("Rendering referral URL:", referralUrl); // Log the referral URL

            return (
              <div
                key={key}
                className="flex flex-col lg:flex-row items-center lg:items-start w-full max-w-5xl gap-6 p-4 rounded-2xl bg-white shadow-md mb-8"
              >
                {/* Left Section: Company Image & Info */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 lg:w-2/3">
                  <div className="flex-shrink-0 w-[80px] h-[100px] md:w-[130px] md:h-[160px] lg:w-[100px] lg:h-[150px] rounded-lg overflow-hidden">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center w-full h-full text-white font-bold text-lg"
                        style={{
                          backgroundColor: getRandomColor(),
                        }}
                      >
                        {generateInitials(company.domain)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm text-gray-500">Share Instantly</p>
                    {/* Social Media Sharing */}
                    <div className="grid grid-cols-4 gap-2 mt-1 lg:flex lg:flex-wrap lg:gap-4">
                      {socialMediaButtons(referralUrl, company.domain).map((button) => (
                        <a
                          key={button.id}
                          href={button.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          {button.icon}
                        </a>
                      ))}
                    </div>
                    <p className="text-base lg:text-lg font-semibold text-center lg:text-left truncate w-full">
                      {company.name}
                    </p>

                    <div className="flex items-center w-full mt-2">
                      <button
                        className="flex items-center justify-center h-10 px-4 rounded-l-lg bg-purple-700 text-white"
                        onClick={() => copyToClipboard(referralUrl, key)}
                      >
                        {copyButtonTexts[key] || "Copy"}
                      </button>
                      <div className="flex-grow h-10 px-4 py-2 bg-white border border-gray-300 rounded-r-lg overflow-hidden max-w-[450px]">
                        <p className="text-sm text-gray-600 truncate">{referralUrl}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: QR and Action */}
                <div className="flex flex-col items-center lg:w-1/3 gap-2 mt-4 lg:mt-0">
                  <QRCode
                    id={`qrCode-${customer.uuid}-${company.UUID}`}
                    value={referralUrl}
                    size={128}
                    level={"H"}
                    includeMargin={true}
                  />
                  <button
                    onClick={() => downloadQRCode(customer.uuid, company.UUID, company.domain)}
                    className="mt-2 h-10 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            );
          });
        })
      )}
    </div>
  );
};

export default SharesIndex;
