import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../common-components-builder/Types";
import ImageElement from "../../common-components-builder/ImageElement";
import ExpandableInput from "./ExpandableInput";

interface ReferAndEarnProps {
  imagePosition: "Right" | "Left" | "None";
  children: React.ReactNode;
  imageUrl?: string;
  imageProps?: {
    imageWidth?: string;
    imageHeight?: string;
    borderRadius?: string;
    objectFit?: "none" | "cover" | "contain" | "fill" | "scale-down";
    centerImage?: boolean;
  };
  view: "desktop" | "mobile";
  onClose: () => void;
}

const ReferAndEarn: React.FC<ReferAndEarnProps> = ({
  imagePosition,
  children,
  imageUrl,
  imageProps = {},
  view,
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

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    drop: (item: { url: string }) => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const shouldRenderContent = true; // Replace with your actual conditional logic

  const defaultImageProps = {
    imageWidth: "100%",
    imageHeight: "100%",
    borderRadius: "0",
    objectFit: "cover" as const,
    centerImage: false,
  };

  // Function to render the inner content
  const renderInnerContent = () => {
    return (
      <>
        {imagePosition !== "None" && (
          <div
            ref={drop as unknown as React.RefObject<HTMLDivElement>}
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
              outline: "none",
              boxShadow: "none",
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
              <div style={{ color: "#A3A3A3", outline: "none", boxShadow: "none" }}>
                Drag and drop an image here
              </div>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "inherit",
            width: view === "mobile" ? "100%" : imagePosition === "None" ? "100%" : "50%",
            justifyContent: "center",
            alignItems: "center",
            order: 1,
            outline: "none",
            boxShadow: "none",
          }}
        >
          <form
            method="post"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "1rem",
              outline: "none",
              boxShadow: "none",
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
                outline: "none",
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "stretch",
                  flexGrow: 0,
                  flexShrink: 0,
                  gap: "8px",
                  outline: "none",
                  boxShadow: "none",
                }}
              ></div>
            </div>
            {/* Input fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                gap: "8px",
                outline: "none",
                boxShadow: "none",
              }}
            >
              <ExpandableInput
                type="text"
                name="name"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                isExpanded={isExpanded === "name"}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />
              <ExpandableInput
                name="email"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                isExpanded={isExpanded === "email"}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />
              <ExpandableInput
                name="number"
                type="tel"
                value={number}
                placeholder="Phone"
                onChange={(e) => setNumber(e.target.value)}
                isExpanded={isExpanded === "number"}
                onFocus={() => handleFocus("number")}
                onBlur={handleBlur}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />

              {children}
            </div>
          </form>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        display: view === "mobile" ? "grid" : "flex",
        flexDirection: "inherit",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "1rem",
        outline: "none",
        boxShadow: "none",
      }}
    >
      {/* Logo in the corner */}
      {/* Powered by Referrd and logo at the bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "10px", // Position at the bottom
          right: "10px", // Align to the right
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span style={{ fontSize: "10px", color: "#333333" }}>Powered by</span>
        <img
          src="https://app.referrd.com.au/images/logo.svg"
          alt="Referrd Logo"
          style={{
            width: "60px",
            height: "30px",
          }}
        />
      </div>

      {shouldRenderContent && renderInnerContent()}
    </div>
  );
};

export default ReferAndEarn;
