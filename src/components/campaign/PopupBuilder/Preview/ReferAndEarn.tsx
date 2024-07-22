import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../CommonComponents/Types";
import ImageElement from "../ImageElement";
import ExpandableInput from "./ExpandableInput";

interface ReferAndEarnProps {
  imagePosition: "Right" | "Left" | "None";
  children: React.ReactNode;
  imageUrl?: string;
  imageProps?: {
    imageWidth?: string;
    imageHeight?: string;
    borderRadius?: string;
    objectFit?: "none" | "cover" | "contain" | "fill" | "scale-down"; // Ensure correct type
    centerImage?: boolean;
  };
  view: "desktop" | "mobile";
  onSubmit: (name: string, email: string, number: string) => void;
  onClose: () => void; // Add onClose prop
}

const ReferAndEarn: React.FC<ReferAndEarnProps> = ({
  imagePosition,
  children,
  imageUrl,
  imageProps = {},
  view,
  onSubmit,
  onClose, // Add onClose prop
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState<string | null>(null);

  const handleFocus = (field: string) => {
    setIsExpanded(field);
  };

  const handleBlur = () => {
    setIsExpanded(null);
  };

  const handleFormSubmit = () => {
    onSubmit(name, email, number);
  };

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    drop: (item: { url: string }) => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const defaultImageProps = {
    imageWidth: "100%",
    imageHeight: "100%",
    borderRadius: "0",
    objectFit: "cover" as "cover", // Ensuring objectFit is one of the specific string literals
    centerImage: false,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: view === "mobile" ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "1rem",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          color: "black",
          fontSize: "1.25rem",
          fontWeight: "bold",
          zIndex: 50,
        }}
      >
        ✕
      </button>

      {imagePosition !== "None" && (
        <div
          ref={drop as unknown as React.RefObject<HTMLDivElement>} // Correctly cast ref
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            width: view === "mobile" ? "100%" : "50%",
            height: view === "mobile" ? "16rem" : "100%",
            order:
              view === "mobile"
                ? imagePosition === "Left"
                  ? 1
                  : 2
                : imagePosition === "Left"
                ? 1
                : 2,
            border: isOver ? "2px dashed #ccc" : "0px solid transparent",
          }}
        >
          {imageUrl ? (
            <ImageElement
              id={""}
              type={"image"}
              imageUrl={imageUrl}
              {...defaultImageProps}
              {...imageProps}
            />
          ) : (
            <div style={{ color: "#A3A3A3" }}>Drag and drop an image here</div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: view === "mobile" ? "column" : "row",
          width:
            view === "mobile"
              ? "100%"
              : imagePosition === "None"
              ? "100%"
              : "50%",
          justifyContent: "center",
          alignItems: "center",
          order: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 0,
              flexShrink: 0,
              position: "relative",
              gap: "8px",
              paddingBottom: "1rem",
              textAlign: view === "mobile" ? "center" : "left",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch", // Changed from selfStretch to alignSelf
                flexGrow: 0,
                flexShrink: 0,
                gap: "8px",
              }}
            >
              {children}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "stretch", // Changed from selfStretch to alignSelf
              flexGrow: 0,
              flexShrink: 0,
              gap: "8px",
            }}
          >
            <ExpandableInput
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              isExpanded={isExpanded === "name"}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
            />
            <ExpandableInput
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              isExpanded={isExpanded === "email"}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
            />
            <ExpandableInput
              type="tel"
              value={number}
              placeholder="Phone"
              onChange={(e) => setNumber(e.target.value)}
              isExpanded={isExpanded === "number"}
              onFocus={() => handleFocus("number")}
              onBlur={handleBlur}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "stretch", // Changed from selfStretch to alignSelf
              flexGrow: 0,
              flexShrink: 0,
              gap: "16px",
              paddingTop: "0.625rem",
            }}
          >
            <button
              onClick={handleFormSubmit}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch", // Changed from selfStretch to alignSelf
                flexGrow: 0,
                flexShrink: 0,
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                paddingTop: "0.625rem",
                paddingBottom: "0.625rem",
                borderRadius: "0.625rem",
                backgroundColor: "#e3a16880",
              }}
            >
              <span
                style={{
                  flexGrow: 0,
                  flexShrink: 0,
                  textAlign: "center",
                  color: "white",
                  fontSize: view === "mobile" ? "0.875rem" : "1rem",
                  fontWeight: "500",
                }}
              >
                Submit
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
