/*import React from "react";
import QRCode from "qrcode.react"; // Importing the QRCode component
import { saveAs } from "file-saver"; // We'll use this to download the QR as an image
import useCustomers from "./hooks/useShares"; // Updated hook path
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

  // Function to download the QR code as an image
  const downloadQRCode = (customerUUID: string, companyUUID: string, companyDomain: string) => {
    const canvas = document.getElementById(`qrCode-${customerUUID}`) as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${companyDomain}-qr.png`); // Save file with the company domain as filename
        }
      });
    }
  };

  // Limit URL length
  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  // Social Media Sharing Links
  const socialMediaButtons = (referralUrl: string) => [
    {
      id: "whatsapp",
      url: `https://wa.me/?text=${encodeURIComponent(referralUrl)}`,
      icon: <WhatsappIcon />,
    },
    {
      id: "email",
      url: `mailto:?subject=Check this out&body=${encodeURIComponent(referralUrl)}`,
      icon: <EmailIcon />,
    },
    {
      id: "facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      icon: <FacebookIcon />,
    },
    {
      id: "messenger",
      url: `fb-messenger://share?link=${encodeURIComponent(referralUrl)}`,
      icon: <MessengerIcon />,
    },
    {
      id: "sms",
      url: `sms:?&body=${encodeURIComponent(referralUrl)}`,
      icon: <SmsIcon />,
    },
    {
      id: "x",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}`,
      icon: <XIcon />,
    },
    {
      id: "reddit",
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(referralUrl)}`,
      icon: <RedditIcon />,
    },
    {
      id: "linkedin",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralUrl)}`,
      icon: <LinkedinIcon />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        customers.map((customer) => {
          const company = companies.find((comp) => customer.company_id.includes(comp.UUID));

          if (!company) return null; // Skip if no matching company is found

          const referralUrl = `https://${company.domain}?referrd-${customer.uuid}`;

          return (
            <div
              key={customer.id}
              className="flex flex-col lg:flex-row items-start lg:items-center w-full max-w-5xl gap-6 p-6 rounded-2xl bg-white shadow-md"
            >
              {/* Left Section: Company Image & Info */ /*}
              <div className="flex items-center gap-4 lg:w-2/3">
                <div className="flex-shrink-0 w-[100px] h-[130px] md:w-[130px] md:h-[160px] bg-gray-200 rounded-lg overflow-hidden">

                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Share Instantly</p>
                  <div className="flex gap-4 mt-1">
                    {socialMediaButtons(referralUrl).map((button) => (
                      <a
                        key={button.id}
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        {button.icon}
                      </a>
                    ))}
                  </div>
                  <p className="text-lg font-semibold text-black">{company.name}</p>

                  <div className="flex items-center w-full max-w-[350px] mt-2">
                    <button className="flex items-center justify-center h-10 px-4 rounded-l-lg bg-purple-700 text-white">
                      Copy
                    </button>
                    <div className="flex-grow h-10 px-4 py-2 bg-white border border-gray-300 rounded-r-lg">
                      <p className="text-sm text-gray-600 truncate">
                        {truncateUrl(referralUrl, 40)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:w-1/3 gap-2">
                <p>Scan this QR code and you will be redirected to this url</p>
                <QRCode
                  id={`qrCode-${customer.uuid}`}
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
        })
      )}
    </div>
  );
};

export default SharesIndex;
*/
