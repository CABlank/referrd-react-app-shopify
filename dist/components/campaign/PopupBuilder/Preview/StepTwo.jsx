import React, { useState } from "react";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import WhatsappIcon from "@/components/Icons/IconsSocialMedia/WhatsappIcon";
import EmailIcon from "@/components/Icons/IconsSocialMedia/EmailIcon";
import FacebookIcon from "@/components/Icons/IconsSocialMedia/FacebookIcon";
import MessengerIcon from "@/components/Icons/IconsSocialMedia/MessengerIcon";
import SmsIcon from "@/components/Icons/IconsSocialMedia/SmsIcon";
import XIcon from "@/components/Icons/IconsSocialMedia/XIcon";
import LinkedinIcon from "@/components/Icons/IconsSocialMedia/LinkedinIcon";
import RedditIcon from "@/components/Icons/IconsSocialMedia/RedditIcon";
var styles = {
    container: function (gap) { return ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        gap: gap,
        position: "relative",
        outline: "none",
        boxShadow: "none",
    }); },
    text: function (color, fontSize, fontWeight) {
        if (fontSize === void 0) { fontSize = "1rem"; }
        if (fontWeight === void 0) { fontWeight = "bold"; }
        return ({
            fontSize: fontSize,
            lineHeight: "1.5",
            fontWeight: fontWeight,
            textAlign: "center",
            color: color,
            outline: "none",
            boxShadow: "none",
        });
    },
    iconWrapper: function (bgColor, iconSize, boxShadow) { return ({
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
    }); },
    button: function (bgColor) { return ({
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
    }); },
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
        justifyContent: "center",
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
var truncateUrl = function (url, maxLength) {
    var placeholderUrl = "https://example.com/?name=test&email=test@gmail.com&number=151414";
    var effectiveUrl = url || placeholderUrl;
    if (effectiveUrl.length <= maxLength)
        return effectiveUrl;
    return "".concat(effectiveUrl.slice(0, maxLength), "...");
};
var handleShareClick = function (platform, url) {
    var encodedUrl = encodeURIComponent(url);
    var shareUrl = "";
    switch (platform) {
        case "whatsapp":
            shareUrl = "https://wa.me/?text=".concat(encodedUrl);
            break;
        case "email":
            shareUrl = "mailto:?body=".concat(encodedUrl);
            break;
        case "facebook":
            shareUrl = "https://www.facebook.com/sharer/sharer.php?u=".concat(encodedUrl);
            break;
        case "messenger":
            shareUrl = "fb-messenger://share/?link=".concat(encodedUrl);
            break;
        case "sms":
            shareUrl = "sms:?body=".concat(encodedUrl);
            break;
        case "x":
            shareUrl = "https://twitter.com/intent/tweet?url=".concat(encodedUrl);
            break;
        case "linkedin":
            shareUrl = "https://www.linkedin.com/shareArticle?mini=true&url=".concat(encodedUrl);
            break;
        case "reddit":
            shareUrl = "https://www.reddit.com/submit?url=".concat(encodedUrl);
            break;
        default:
            console.error("Unsupported platform");
            return;
    }
    window.open(shareUrl, "_blank");
};
var Icon = function (_a) {
    var IconComponent = _a.IconComponent, bgColor = _a.bgColor, view = _a.view, boxShadow = _a.boxShadow, platform = _a.platform, url = _a.url;
    var iconSize = view === "mobile" ? "1.5rem" : "2.5rem";
    return (<div id={platform} // Set the id as the platform name
     style={styles.iconWrapper(bgColor, iconSize, boxShadow)} onClick={function () { return handleShareClick(platform, url); }}>
      <IconComponent />
    </div>);
};
var Button = function (_a) {
    var bgColor = _a.bgColor, text = _a.text;
    return (<div style={styles.button(bgColor)}>
    <p style={styles.text("white", "1rem", "500")}>{text}</p>
  </div>);
};
var StepTwo = function (_a) {
    var elements = _a.elements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, view = _a.view, url = _a.url;
    var _b = useState("Copy"), copyText = _b[0], setCopyText = _b[1];
    var truncatedUrl = truncateUrl(url, 30);
    var handleCopyClick = function () {
        navigator.clipboard
            .writeText(url)
            .then(function () {
            setCopyText("Copied");
            setTimeout(function () { return setCopyText("Copy"); }, 2000); // Change back to "Copy" after 2 seconds
        })
            .catch(function (err) { return console.error("Failed to copy text: ", err); });
    };
    var iconData = [
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
    return (<div style={styles.container(view === "mobile" ? "1.5rem" : "1rem")}>
      <p style={{
            color: "black",
            margin: "0",
            fontSize: "20px",
            fontWeight: "bold",
        }}>
        Thank you for signing up!
      </p>
      <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            outline: "none",
            boxShadow: "none",
        }}>
        <p style={{
            color: "black",
            margin: "0",
        }}>
          Click on an icon to share instantly
        </p>
        <div style={styles.iconGrid}>
          {iconData.map(function (icon, idx) { return (<Icon key={idx} IconComponent={icon.component} bgColor={icon.bgColor} view={view} boxShadow={icon.boxShadow} platform={icon.platform} url={url}/>); })}
        </div>
      </div>

      <div style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "0.2rem",
            outline: "none",
            boxShadow: "none",
        }}>
        {elements.map(function (element, index) { return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} view={"desktop"} expandedId={undefined} onExpand={function (id) {
                throw new Error("Function not implemented.");
            }} handleChange={function (setter, type) {
                throw new Error("Function not implemented.");
            }}/>); })}
        {hoverIndex === elements.length && (<div style={{
                width: elementWidth,
                borderRight: "2px solid red",
                flexShrink: 0,
                outline: "none",
                boxShadow: "none",
            }}/>)}
      </div>
      <div id="copy-button" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "0rem",
            outline: "none",
            boxShadow: "none",
        }}>
        <button onClick={handleCopyClick} style={styles.copyButton}>
          {copyText}
        </button>
        <div id="domain" style={styles.urlContainer}>
          <span style={styles.urlText}>{truncatedUrl}</span>
        </div>
      </div>
    </div>);
};
export default StepTwo;
