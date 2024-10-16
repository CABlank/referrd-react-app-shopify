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
}

const socialMediaIcons = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    component: WhatsappIcon,
    color: "#29a71a",
  },
  { id: "email", name: "Email", component: EmailIcon, color: "#2196f3" },
  {
    id: "facebook",
    name: "Facebook",
    component: FacebookIcon,
    color: "#1877f2",
  },
  {
    id: "messenger",
    name: "Messenger",
    component: MessengerIcon,
    color: "#0084ff",
  },
  { id: "sms", name: "SMS", component: SmsIcon, color: "#0027d9" },
  {
    id: "x",
    name: "X",
    component: XIcon,
    color: "black",
    shadow: "0px 0px 2px 0 rgba(255,255,255,0.5)",
  },
  { id: "reddit", name: "Reddit", component: RedditIcon, color: "#ff4500" },
  {
    id: "linkedin",
    name: "LinkedIn",
    component: LinkedinIcon,
    color: "#0b69c7",
  },
];

const SocialMediaIcons: React.FC<{
  icons: typeof socialMediaIcons;
  view: "desktop" | "mobile";
}> = ({ icons, view }) => {
  const iconSize =
    view === "mobile" ? { width: "24px", height: "24px" } : { width: "32px", height: "32px" };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: view === "mobile" ? "wrap" : "nowrap",
        justifyContent: "start",
        alignItems: "center",
        gap: "16px",
        outline: "none",
        boxShadow: "none",
      }}
    >
      {icons.map(({ id, component: IconComponent, color, shadow }, index) => (
        <div
          id={id}
          key={index}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 0,
            flexShrink: 0,
            position: "relative",
            gap: "4px",
            borderRadius: "5.33px",
            backgroundColor: color,
            boxShadow: shadow,
            outline: "none",
            ...iconSize,
          }}
        >
          <IconComponent />
        </div>
      ))}
    </div>
  );
};

const StepTwo: React.FC<StepTwoProps> = ({
  elements,
  moveElement,
  hoverIndex,
  elementWidth,
  onRemove,
  view,
}) => {
  const [copyText, setCopyText] = useState("Copy");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: view === "desktop" ? "row" : "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: view === "desktop" ? "0px" : "8px",
        position: "relative",
        outline: "none",
        boxShadow: "none",
        gap: view === "desktop" ? "16px" : "0px", // Adds space between elements in desktop view
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: view === "desktop" ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
          width: view === "desktop" ? "auto" : "100%",
          gap: "8px",
          outline: "none",
          boxShadow: "none",
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
            view={view}
            expandedId={undefined}
            onExpand={() => {}}
            handleChange={(setter, type) => (e) => {}}
          />
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            outline: "none",
            boxShadow: "none",
          }}
        >
          <div
            id="copy-button"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          >
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "36px",
                gap: "8px",
                padding: "10px 8px",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                backgroundColor: "white",
                border: "1px solid white",
                fontSize: view === "desktop" ? "16px" : "12px",
                fontWeight: "600",
                textAlign: "left",
                color: "black",
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
              }}
            >
              {copyText}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "36px",
              gap: "8px",
              padding: "10px 8px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              border: "1px solid white",
              outline: "none",
              boxShadow: "none",
            }}
          >
            <p
              id="domain"
              style={{
                fontSize: view === "desktop" ? "16px" : "12px",
                fontWeight: "500",
                textAlign: "left",
                color: "white",
                outline: "none",
                boxShadow: "none",
              }}
            >
              example.com
            </p>
          </div>
        </div>
        <SocialMediaIcons icons={socialMediaIcons} view={view} />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: view === "desktop" ? "nowrap" : "wrap",
          justifyContent: "space-between",
          width: "100%",
          marginTop: view === "desktop" ? "0px" : "8px",
          outline: "none",
          boxShadow: "none",
          gap: view === "desktop" ? "16px" : "0px", // Adds space between elements in desktop view
        }}
      >
        {hoverIndex === elements.length && (
          <div
            key={`hoverIndex-${elements.length}`}
            style={{
              flexShrink: 0,
              width: elementWidth,
              borderRight: "2px solid red",
              outline: "none",
              boxShadow: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StepTwo;
