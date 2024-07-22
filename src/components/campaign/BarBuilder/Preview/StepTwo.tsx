// src/components/Preview/StepTwo.tsx
import React from "react";
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
  const truncateUrl = (url: string, maxLength: number) => {
    const placeholderUrl =
      "https://example.com/?name=test&email=test@gmail.com&number=151414";
    const effectiveUrl = url || placeholderUrl;
    if (effectiveUrl.length <= maxLength) return effectiveUrl;
    return effectiveUrl.slice(0, maxLength) + "...";
  };

  const truncatedUrl = truncateUrl(url, 30);

  const renderIcon = (
    IconComponent: React.FC,
    bgColor: string,
    boxShadow?: string,
    index?: number
  ) => {
    const iconSize = view === "mobile" ? "w-6 h-6" : "w-8 h-8";
    return (
      <div
        key={index} // Add unique key prop here
        className={`cursor-pointer flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 rounded-[5.33px] ${bgColor} p-1 ${iconSize}`}
        style={{ boxShadow }}
      >
        <IconComponent />
      </div>
    );
  };

  const socialMediaIcons = [
    { component: WhatsappIcon, color: "bg-[#29a71a]" },
    { component: EmailIcon, color: "bg-[#2196f3]" },
    { component: FacebookIcon, color: "bg-[#1877f2]" },
    { component: MessengerIcon, color: "bg-[#0084ff]" },
    { component: SmsIcon, color: "bg-[#0027d9]" },
    {
      component: XIcon,
      color: "bg-black",
      shadow: "0px 0px 2px 0 rgba(255,255,255,0.5)",
    },
    { component: RedditIcon, color: "bg-[#ff4500]" },
    { component: LinkedinIcon, color: "bg-[#0b69c7]" },
  ];

  return (
    <>
      {view === "desktop" && (
        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-4 relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 text-white text-lg font-bold z-50"
          >
            ✕
          </button>
          <div className="flex flex-col justify-center items-center w-[720px]">
            <div className="flex justify-center items-center gap-4 mb-3">
              <div className="flex flex-col justify-center items-start gap-2">
                <p className="text-lg text-center text-white font-regular">
                  Thanks for signing up!
                </p>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center w-[97px] h-9 gap-2 px-6 py-2.5 rounded-tl-lg rounded-bl-lg bg-white">
                  <p className="text-base font-semibold text-left text-black cursor-pointer">
                    Copy
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
                      renderIcon(icon.component, icon.color, icon.shadow, index)
                    )}
                </div>
                <div className="flex justify-start items-start gap-10">
                  {socialMediaIcons
                    .slice(4)
                    .map((icon, index) =>
                      renderIcon(icon.component, icon.color, icon.shadow, index)
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4">
            <div className="flex-grow-0 flex-shrink-0 relative max-w-[65px] max-h-[65px]">
              <QRCode value={url || "https://example.com"} size={65} />{" "}
              {/* Use QRCode with the url */}
            </div>
          </div>
          <div className="flex justify-between">
            {elements.map((element, index) => (
              <ElementWrapper
                key={element.id} // Ensure each element has a unique key
                index={index}
                element={element}
                moveElement={moveElement}
                elementWidth={elementWidth}
                hoverIndex={hoverIndex}
                onRemove={onRemove}
                showRemoveButton={false}
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
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-2 text-white text-sm font-bold z-50"
          >
            ✕
          </button>
          <div className="flex flex-col justify-center items-center w-full gap-2">
            <p className="text-sm text-center text-white font-regular">
              Thanks for signing up!
            </p>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center h-9 gap-2 px-2 py-2.5 rounded-tl-lg rounded-bl-lg bg-white">
                <p className="text-xs font-semibold text-left text-black cursor-pointer">
                  Copy
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
                      renderIcon(icon.component, icon.color, icon.shadow, index)
                    )}
                </div>
                <div className="flex justify-start items-start gap-4">
                  {socialMediaIcons
                    .slice(4)
                    .map((icon, index) =>
                      renderIcon(icon.component, icon.color, icon.shadow, index)
                    )}
                </div>
              </div>
              <div className="flex justify-center items-center ml-2 max-w-[65px] max-h-[65px]">
                <QRCode value={url || "https://example.com"} size={65} />{" "}
                {/* Use QRCode with the url */}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 mt-2"></div>
          <div className="flex flex-wrap justify-between w-full mt-2">
            {elements.map((element, index) => (
              <ElementWrapper
                key={element.id} // Ensure each element has a unique key
                index={index}
                element={element}
                moveElement={moveElement}
                elementWidth={elementWidth}
                hoverIndex={hoverIndex}
                onRemove={onRemove}
                showRemoveButton={false}
              />
            ))}
            {hoverIndex === elements.length && (
              <div
                key={`hoverIndex-${elements.length}`} // Add a unique key
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
