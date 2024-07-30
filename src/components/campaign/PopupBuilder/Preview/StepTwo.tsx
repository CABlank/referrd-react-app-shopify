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
  container: (gap: string) => ({
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    gap,
    position: "relative" as const,
  }),
  text: (color: string, fontSize = "1rem", fontWeight = "bold") => ({
    fontSize,
    lineHeight: "1.5",
    fontWeight,
    textAlign: "center" as const,
    color,
  }),
  iconWrapper: (bgColor: string, iconSize: string, boxShadow?: string) => ({
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.625rem",
    backgroundColor: bgColor,
    width: iconSize,
    height: iconSize,
    boxShadow: boxShadow || "none",
  }),
  button: (bgColor: string) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "2.5rem",
    padding: "0.625rem 1.5rem",
    borderRadius: "0.625rem",
    backgroundColor: bgColor,
  }),
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    width: "100%",
  },
};

const truncateUrl = (url: string, maxLength: number) => {
  const placeholderUrl =
    "https://example.com/?name=test&email=test@gmail.com&number=151414";
  const effectiveUrl = url || placeholderUrl;
  if (effectiveUrl.length <= maxLength) return effectiveUrl;
  return `${effectiveUrl.slice(0, maxLength)}...`;
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

const Icon = ({
  IconComponent,
  bgColor,
  view,
  boxShadow,
  platform,
  url,
}: {
  IconComponent: React.ComponentType;
  bgColor: string;
  view: "desktop" | "mobile";
  boxShadow?: string;
  platform: string;
  url: string;
}) => {
  const iconSize = view === "mobile" ? "1.5rem" : "2.5rem";

  return (
    <div
      style={styles.iconWrapper(bgColor, iconSize, boxShadow)}
      onClick={() => handleShareClick(platform, url)}
    >
      <IconComponent />
    </div>
  );
};

const Button = ({ bgColor, text }: { bgColor: string; text: string }) => (
  <div style={styles.button(bgColor)}>
    <p style={styles.text("white", "1rem", "500")}>{text}</p>
  </div>
);

const StepTwo: React.FC<StepTwoProps> = ({
  elements,
  moveElement,
  hoverIndex,
  elementWidth,
  onRemove,
  view,
  url,
}) => {
  const [copyText, setCopyText] = useState("Copy");

  const truncatedUrl = truncateUrl(url, 30);

  const handleCopyClick = () => {
    console.log("handleCopyClick called");
    console.log("URL to copy:", url);
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Text copied successfully");
        setCopyText("Copied");
        setTimeout(() => setCopyText("Copy"), 2000); // Change back to "Copy" after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const iconData = [
    { component: WhatsappIcon, bgColor: "#29a71a", platform: "whatsapp" },
    { component: EmailIcon, bgColor: "#2196f3", platform: "email" },
    { component: FacebookIcon, bgColor: "#1877f2", platform: "facebook" },
    { component: MessengerIcon, bgColor: "#0084ff", platform: "messenger" },
    { component: SmsIcon, bgColor: "#0027d9", platform: "sms" },
    {
      component: XIcon,
      bgColor: "black",
      boxShadow: "0px 0px 2px 0 rgba(255,255,255,0.5)",
      platform: "x",
    },
    { component: RedditIcon, bgColor: "#ff4500", platform: "reddit" },
    { component: LinkedinIcon, bgColor: "#0b69c7", platform: "linkedin" },
  ];

  return (
    <div style={styles.container(view === "mobile" ? "1.5rem" : "1rem")}>
      <p style={styles.text("rgba(0,0,0,0.8)", "1.2rem", "bold")}>
        Thank you for signing up!
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p style={styles.text("rgba(0,0,0,0.8)", "0.75rem")}>
          Click on an icon to share instantly
        </p>
        <div style={styles.iconGrid}>
          {iconData.map((icon, idx) => (
            <Icon
              key={idx}
              IconComponent={icon.component}
              bgColor={icon.bgColor}
              view={view}
              boxShadow={icon.boxShadow}
              platform={icon.platform}
              url={url}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p style={styles.text("rgba(0,0,0,0.8)", "0.8rem", "normal")}>
          Scan the QR code to visit:
        </p>
        <QRCode value={url || "https://example.com"} size={80} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "0.2rem",
        }}
      >
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
            style={{
              width: elementWidth,
              borderRight: "0px solid red",
              flexShrink: 0,
            }}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "0rem",
        }}
      >
        <button
          className="flex justify-center items-center h-10 relative gap-2 px-6 rounded-tl-lg rounded-bl-lg bg-[#851087]/80 text-white text-base font-medium"
          onClick={handleCopyClick}
          style={{ flexShrink: 0 }}
        >
          {copyText}
        </button>
        <div
          className="flex justify-center items-center h-10 relative gap-2 px-6 py-2.5 rounded-tr-lg rounded-br-lg bg-white border-[0.5px] border-black/30"
          style={{ flexGrow: 1, minWidth: 0 }}
        >
          <span className="text-base font-medium text-left text-black/50 overflow-hidden text-ellipsis whitespace-nowrap">
            {truncatedUrl}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
