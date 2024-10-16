import React, { useState } from "react";
import { ElementProps } from "../../common-components-builder/Types";
import ElementWrapper from "../../common-components-builder/ElementWrapper";
import WhatsappIcon from "@/components/icons/icons-social-media/WhatsappIcon";
import EmailIcon from "@/components/icons/icons-social-media/EmailIcon";
import FacebookIcon from "@/components/icons/icons-social-media/FacebookIcon";
import MessengerIcon from "@/components/icons/icons-social-media/MessengerIcon";
import SmsIcon from "@/components/icons/icons-social-media/SmsIcon";
import XIcon from "@/components/icons/icons-social-media/XIcon";
import LinkedinIcon from "@/components/icons/icons-social-media/LinkedinIcon";
import RedditIcon from "@/components/icons/icons-social-media/RedditIcon";

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
    outline: "none",
    boxShadow: "none",
  }),
  text: (color: string, fontSize = "1rem", fontWeight = "bold") => ({
    fontSize,
    lineHeight: "1.5",
    fontWeight,
    textAlign: "center" as const,
    color,
    outline: "none",
    boxShadow: "none",
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
    outline: "none",
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
    outline: "none",
    boxShadow: "none",
    border: "none",
  }),
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 65px)",
    placeItems: "center",
    gap: "28px 0px",
    width: "100%",
    outline: "none",
    boxShadow: "none",
  },
  copyButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "2.5rem",
    padding: "0 1.5rem",
    borderTopLeftRadius: "0.75rem",
    borderBottomLeftRadius: "0.75rem",
    backgroundColor: "rgba(133, 16, 135, 0.8)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "500",
    flexShrink: 0,
    cursor: "pointer",
    outline: "none",
    boxShadow: "none",
    border: "none",
  },
  urlContainer: {
    display: "flex",

    alignItems: "center",
    height: "2.5rem",
    padding: "0 1.5rem",
    borderTopRightRadius: "0.75rem",
    borderBottomRightRadius: "0.75rem",
    backgroundColor: "white",
    border: "0.5px solid rgba(0, 0, 0, 0.3)",
    flexGrow: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    outline: "none",
    boxShadow: "none",
  },
  urlText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.5)",
    outline: "none",
    boxShadow: "none",
  },
};

const truncateUrl = (url: string, maxLength: number) => {
  const placeholderUrl = "https://example.com/?name=test&email=test@gmail.com&number=151414";
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
      id={platform} // Set the id as the platform name
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
    navigator.clipboard
      .writeText(url)
      .then(() => {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          outline: "none",
          boxShadow: "none",
        }}
      >
        <p
          style={{
            color: "black",
            margin: "0",
          }}
        >
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
          justifyContent: "space-between",
          width: "100%",
          marginTop: "0.2rem",
          outline: "none",
          boxShadow: "none",
        }}
      >
        {hoverIndex === elements.length && (
          <div
            style={{
              width: elementWidth,
              borderRight: "2px solid red",
              flexShrink: 0,
              outline: "none",
              boxShadow: "none",
            }}
          />
        )}
      </div>
      <div
        id="copy-button"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "0rem",
          outline: "none",
          boxShadow: "none",
        }}
      >
        <button onClick={handleCopyClick} style={styles.copyButton}>
          {copyText}
        </button>
        <div id="domain" style={styles.urlContainer}>
          <span style={styles.urlText}>{truncatedUrl}</span>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
