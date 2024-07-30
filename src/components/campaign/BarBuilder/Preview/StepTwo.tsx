// src/components/Preview/StepTwo.tsx

import React, { useState } from "react";
import { ElementProps } from "../../CommonComponents/Types";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import WhatsappIcon from "@/components/Icons/IconsSocialMedia/WhatsappIcon";
import EmailIcon from "@/components/Icons/IconsSocialMedia/EmailIcon";
import FacebookIcon from "@/components/Icons/IconsSocialMedia/FacebookIcon";
import MessengerIcon from "@/components/Icons/IconsSocialMedia/MessengerIcon";
import SmsIcon from "@/components/Icons/IconsSocialMedia/SmsIcon";
import XIcon from "@/components/Icons/IconsSocialMedia/XIcon";
import LinkedinIcon from "@/components/Icons/IconsSocialMedia/LinkedinIcon";
import RedditIcon from "@/components/Icons/IconsSocialMedia/RedditIcon";
import QRCode from "qrcode.react";

interface StepTwoProps {
  elements: ElementProps[];
  setElements: React.Dispatch<React.SetStateAction<ElementProps[]>>;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  hoverIndex: number | null;
  elementWidth: string;
  onRemove: (id: string) => void;
  view: "desktop" | "mobile";
  url: string;
  onClose: () => void;
}

const styles = {
  iconWrapper: (bgColor: string, boxShadow?: string) => ({
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5.33px",
    backgroundColor: bgColor,
    padding: "0.5rem",
    boxShadow: boxShadow || "none",
  }),
};

const truncateUrl = (url: string, maxLength: number) => {
  const placeholderUrl =
    "https://example.com/?name=test&email=test@gmail.com&number=151414";
  const effectiveUrl = url || placeholderUrl;
  if (effectiveUrl.length <= maxLength) return effectiveUrl;
  return effectiveUrl.slice(0, maxLength) + "...";
};

const handleShareClick = (platform: string, url: string) => {
  const encodedUrl = encodeURIComponent(url);
  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodedUrl}`;
      break;
    case "email":
      shareUrl = `mailto:?body=${encodedUrl}`;
      break;
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case "messenger":
      shareUrl = `fb-messenger://share/?link=${encodedUrl}`;
      break;
    case "sms":
      shareUrl = `sms:?body=${encodedUrl}`;
      break;
    case "x":
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
      break;
    case "reddit":
      shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}`;
      break;
    default:
      console.error("Unsupported platform");
      return;
  }

  window.open(shareUrl, "_blank");
};

const StepTwo: React.FC<StepTwoProps> = ({
  elements,
  setElements,
  moveElement,
  hoverIndex,
  elementWidth,
  onRemove,
  view,
  url = "",
  onClose,
}) => {
  const [copyText, setCopyText] = useState("Copy");

  const truncatedUrl = truncateUrl(url, 30);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyText("Copied");
        setTimeout(() => setCopyText("Copy"), 2000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const socialMediaIcons = [
    { component: WhatsappIcon, color: "#29a71a", platform: "whatsapp" },
    { component: EmailIcon, color: "#2196f3", platform: "email" },
    { component: FacebookIcon, color: "#1877f2", platform: "facebook" },
    { component: MessengerIcon, color: "#0084ff", platform: "messenger" },
    { component: SmsIcon, color: "#0027d9", platform: "sms" },
    {
      component: XIcon,
      color: "black",
      platform: "x",
      shadow: "0px 0px 2px 0 rgba(255,255,255,0.5)",
    },
    { component: RedditIcon, color: "#ff4500", platform: "reddit" },
    { component: LinkedinIcon, color: "#0b69c7", platform: "linkedin" },
  ];

  const renderIcon = (
    IconComponent: React.FC,
    bgColor: string,
    platform: string,
    boxShadow?: string,
    index?: number
  ) => {
    const iconSize = view === "mobile" ? "w-6 h-6" : "w-8 h-8";
    return (
      <div
        key={index}
        className={`cursor-pointer flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 rounded-[5.33px] ${iconSize}`}
        style={{ backgroundColor: bgColor, boxShadow }}
        onClick={() => handleShareClick(platform, url)}
      >
        <IconComponent />
      </div>
    );
  };

  return (
    <>
      {view === "desktop" && (
        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-4 relative">
          <div className="flex flex-col justify-center items-center w-[720px]">
            <div className="flex justify-center items-center gap-4 mb-3">
              <div className="flex flex-col justify-center items-start gap-2">
                <p className="text-lg text-center text-white font-regular">
                  Thanks for signing up!
                </p>
              </div>
              <div className="flex justify-center items-center">
                <div
                  className="flex justify-center items-center w-[97px] h-9 gap-2 px-6 py-2.5 rounded-tl-lg rounded-bl-lg bg-white"
                  onClick={handleCopyClick}
                >
                  <p className="text-base font-semibold text-left text-black cursor-pointer">
                    {copyText}
                  </p>
                </div>
                <div className="flex justify-center items-center w-[345px] h-9 gap-2 px-6 py-2.5 rounded-tr-lg rounded-br-lg border border-white">
                  <button className="w-[309.32px] text-base font-medium text-left text-white">
                    {truncatedUrl}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-0">
              <div className="flex justify-start items-start gap-10">
                <div className="flex justify-start items-end gap-10">
                  {socialMediaIcons
                    .slice(0, 4)
                    .map((icon, index) =>
                      renderIcon(
                        icon.component,
                        icon.color,
                        icon.platform,
                        icon.shadow,
                        index
                      )
                    )}
                </div>
                <div className="flex justify-start items-start gap-10">
                  {socialMediaIcons
                    .slice(4)
                    .map((icon, index) =>
                      renderIcon(
                        icon.component,
                        icon.color,
                        icon.platform,
                        icon.shadow,
                        index
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4">
            <div className="flex-grow-0 flex-shrink-0 relative max-w-[65px] max-h-[65px]">
              <QRCode value={url || "https://example.com"} size={65} />
            </div>
          </div>
          <div className="flex justify-between">
            {elements.map((element, index) => (
              <ElementWrapper
                key={element.id}
                index={index}
                element={element}
                moveElement={moveElement}
                elementWidth={elementWidth}
                hoverIndex={hoverIndex}
                onRemove={onRemove}
                showRemoveButton={false}
                view={"desktop"}
                expandedId={undefined}
                onExpand={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
                handleChange={function (
                  setter: React.Dispatch<React.SetStateAction<string>>,
                  type: string
                ): (e: React.ChangeEvent<HTMLInputElement>) => void {
                  throw new Error("Function not implemented.");
                }}
              />
            ))}
            {hoverIndex === elements.length && (
              <div
                className="flex-shrink-0"
                style={{ width: elementWidth, borderRight: "2px solid red" }}
              />
            )}
          </div>
        </div>
      )}

      {view === "mobile" && (
        <div className="flex flex-col justify-center items-center pt-2 relative">
          <div className="flex flex-col justify-center items-center w-full gap-2">
            <p className="text-sm text-center text-white font-regular">
              Thanks for signing up!
            </p>
            <div className="flex justify-center items-center">
              <div
                className="flex justify-center items-center h-9 gap-2 px-2 py-2.5 rounded-tl-lg rounded-bl-lg bg-white"
                onClick={handleCopyClick}
              >
                <p className="text-xs font-semibold text-left text-black cursor-pointer">
                  {copyText}
                </p>
              </div>
              <div className="flex justify-center items-center h-9 gap-2 px-2 py-2.5 rounded-tr-lg rounded-br-lg border border-white ">
                <button className="text-xs font-medium text-left text-white">
                  {truncatedUrl}
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex justify-start items-end gap-4">
                  {socialMediaIcons
                    .slice(0, 4)
                    .map((icon, index) =>
                      renderIcon(
                        icon.component,
                        icon.color,
                        icon.platform,
                        icon.shadow,
                        index
                      )
                    )}
                </div>
                <div className="flex justify-start items-start gap-4">
                  {socialMediaIcons
                    .slice(4)
                    .map((icon, index) =>
                      renderIcon(
                        icon.component,
                        icon.color,
                        icon.platform,
                        icon.shadow,
                        index
                      )
                    )}
                </div>
              </div>
              <div className="flex justify-center items-center ml-2 max-w-[65px] max-h-[65px]">
                <QRCode value={url || "https://example.com"} size={65} />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 mt-2"></div>
          <div className="flex flex-wrap justify-between w-full mt-2">
            {elements.map((element, index) => (
              <ElementWrapper
                key={element.id}
                index={index}
                element={element}
                moveElement={moveElement}
                elementWidth={elementWidth}
                hoverIndex={hoverIndex}
                onRemove={onRemove}
                showRemoveButton={false}
                view={"desktop"}
                expandedId={undefined}
                onExpand={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
                handleChange={function (
                  setter: React.Dispatch<React.SetStateAction<string>>,
                  type: string
                ): (e: React.ChangeEvent<HTMLInputElement>) => void {
                  throw new Error("Function not implemented.");
                }}
              />
            ))}
            {hoverIndex === elements.length && (
              <div
                key={`hoverIndex-${elements.length}`}
                className="flex-shrink-0"
                style={{ width: elementWidth, borderRight: "2px solid red" }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StepTwo;
