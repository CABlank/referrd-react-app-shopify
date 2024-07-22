import React from "react";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import WhatsappIcon from "@/components/Icons/IconsSocialMedia/WhatsappIcon";
import EmailIcon from "@/components/Icons/IconsSocialMedia/EmailIcon";
import FacebookIcon from "@/components/Icons/IconsSocialMedia/FacebookIcon";
import MessengerIcon from "@/components/Icons/IconsSocialMedia/MessengerIcon";
import SmsIcon from "@/components/Icons/IconsSocialMedia/SmsIcon";
import XIcon from "@/components/Icons/IconsSocialMedia/XIcon";
import LinkedinIcon from "@/components/Icons/IconsSocialMedia/LinkedinIcon";
import RedditIcon from "@/components/Icons/IconsSocialMedia/RedditIcon";
import QRCode from "qrcode.react"; // Ensure you have this package installed
var StepTwo = function (_a) {
    var elements = _a.elements, setElements = _a.setElements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, view = _a.view, url = _a.url, onClose = _a.onClose;
    var truncateUrl = function (url, maxLength) {
        var placeholderUrl = "https://example.com/?name=test&email=test@gmail.com&number=151414";
        var effectiveUrl = url || placeholderUrl;
        if (effectiveUrl.length <= maxLength)
            return effectiveUrl;
        return effectiveUrl.slice(0, maxLength) + "...";
    };
    var truncatedUrl = truncateUrl(url, 30);
    var renderIcon = function (IconComponent, bgColor, boxShadow) {
        var iconSize = view === "mobile" ? "1.5rem" : "2rem"; // Smaller size for mobile
        return (<div style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                gap: "8px",
                borderRadius: "0.625rem",
                backgroundColor: bgColor,
                width: iconSize,
                height: iconSize,
                boxShadow: boxShadow || "none",
            }}>
        <IconComponent />
      </div>);
    };
    return (<>
      {view === "desktop" && (<div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                gap: "1rem",
                position: "relative",
            }}>
          <button onClick={onClose} style={{
                position: "absolute",
                top: "0",
                right: "0",
                margin: "1rem",
                color: "black",
                fontSize: "1.25rem",
                fontWeight: "bold",
                zIndex: 50,
            }}>
            ✕
          </button>
          <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
            }}>
            <p style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                fontWeight: "bold",
                textAlign: "center",
                color: "rgba(0,0,0,0.8)",
            }}>
              Thank you for signing up!
            </p>
          </div>
          <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: "1rem",
            }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                width: "100%",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6.0625rem",
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "0.625rem 0 0 0.625rem",
                backgroundColor: "#851087cc",
            }}>
                <p style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                fontWeight: "500",
                color: "white",
            }}>
                  Copy
                </p>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "0 0.625rem 0.625rem 0",
                backgroundColor: "white",
                border: "0.5px solid rgba(0,0,0,0.3)",
            }}>
                <p style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                fontWeight: "500",
                color: "rgba(0,0,0,0.5)",
                textAlign: "left",
            }}>
                  {truncatedUrl}
                </p>
              </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "0.625rem",
                backgroundColor: "#e3a168cc",
            }}>
              <p style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                fontWeight: "500",
                color: "white",
                textAlign: "left",
            }}>
                Close
              </p>
            </div>
            <p style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "rgba(0,0,0,0.75)",
                textAlign: "center",
                width: "100%",
            }}>
              Share Instantly
            </p>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                gap: "1rem",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "end",
                gap: "2.5rem",
            }}>
                {renderIcon(WhatsappIcon, "#29a71a")}
                {renderIcon(EmailIcon, "#2196f3")}
                {renderIcon(FacebookIcon, "#1877f2")}
                {renderIcon(MessengerIcon, "#0084ff")}
              </div>
              <div style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                gap: "2.5rem",
            }}>
                {renderIcon(SmsIcon, "#0027d9")}
                {renderIcon(XIcon, "black", "0px 0px 2px 0 rgba(255,255,255,0.5)")}
                {renderIcon(RedditIcon, "#ff4500")}
                {renderIcon(LinkedinIcon, "#0b69c7")}
              </div>
            </div>
          </div>
          <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                gap: "1rem",
            }}>
            <p style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                fontWeight: "500",
                color: "rgba(0,0,0,0.8)",
            }}>
              Scan the QR code to visit:
            </p>
            <QRCode value={url || "https://example.com"} size={80}/>
          </div>
          <div style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "1rem",
            }}>
            {elements.map(function (element, index) { return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} // Hide remove button
            />); })}
            {hoverIndex === elements.length && (<div style={{
                    width: elementWidth,
                    borderRight: "0px solid red",
                    flexShrink: 0,
                }}/>)}
          </div>
        </div>)}

      {view === "mobile" && (<div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                gap: "1rem",
                position: "relative",
            }}>
          <button onClick={onClose} style={{
                position: "absolute",
                top: "0",
                right: "0",
                margin: "0.5rem",
                color: "black",
                fontSize: "0.875rem",
                fontWeight: "bold",
                zIndex: 50,
            }}>
            ✕
          </button>
          <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
            }}>
            <p style={{
                fontSize: "1rem",
                lineHeight: "1.5",
                fontWeight: "bold",
                textAlign: "center",
                color: "rgba(0,0,0,0.8)",
            }}>
              Thank you for signing up!
            </p>
          </div>
          <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: "1rem",
            }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                width: "100%",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "0.625rem 0 0 0.625rem",
                backgroundColor: "#851087cc",
            }}>
                <p style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "500",
                color: "white",
            }}>
                  Copy
                </p>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "0 0.625rem 0.625rem 0",
                backgroundColor: "white",
                border: "0.5px solid rgba(0,0,0,0.3)",
            }}>
                <p style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: "500",
                color: "rgba(0,0,0,0.5)",
                textAlign: "left",
            }}>
                  {truncatedUrl}
                </p>
              </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "2.5rem",
                position: "relative",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "0.625rem",
                backgroundColor: "#e3a168cc",
            }}>
              <p style={{
                fontSize: "1rem",
                lineHeight: "1.5rem",
                fontWeight: "500",
                color: "white",
                textAlign: "left",
            }}>
                Close
              </p>
            </div>
            <p style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                color: "rgba(0,0,0,0.75)",
                textAlign: "center",
                width: "100%",
            }}>
              Share Instantly
            </p>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                gap: "1.5rem",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "end",
                gap: "1.5rem",
            }}>
                {renderIcon(WhatsappIcon, "#29a71a")}
                {renderIcon(EmailIcon, "#2196f3")}
                {renderIcon(FacebookIcon, "#1877f2")}
                {renderIcon(MessengerIcon, "#0084ff")}
              </div>
              <div style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                gap: "1.5rem",
            }}>
                {renderIcon(SmsIcon, "#0027d9")}
                {renderIcon(XIcon, "black", "0px 0px 2px 0 rgba(255,255,255,0.5)")}
                {renderIcon(RedditIcon, "#ff4500")}
                {renderIcon(LinkedinIcon, "#0b69c7")}
              </div>
            </div>
          </div>
          <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                gap: "1.5rem",
            }}>
            <p style={{
                fontSize: "1rem",
                lineHeight: "1.5rem",
                fontWeight: "500",
                color: "rgba(0,0,0,0.8)",
            }}>
              Scan the QR code to visit:
            </p>
            <QRCode value={url || "https://example.com"} size={64}/>
          </div>
          <div style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "1rem",
            }}>
            {elements.map(function (element, index) { return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} // Hide remove button
            />); })}
            {hoverIndex === elements.length && (<div style={{
                    width: elementWidth,
                    borderRight: "0px solid red",
                    flexShrink: 0,
                }}/>)}
          </div>
        </div>)}
    </>);
};
export default StepTwo;
