var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var socialMediaIcons = [
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
var SocialMediaIcons = function (_a) {
    var icons = _a.icons, view = _a.view;
    var iconSize = view === "mobile"
        ? { width: "24px", height: "24px" }
        : { width: "32px", height: "32px" };
    return (<div style={{
            display: "flex",
            flexWrap: view === "mobile" ? "wrap" : "nowrap",
            justifyContent: "start",
            alignItems: "center",
            gap: "16px",
            outline: "none",
            boxShadow: "none",
        }}>
      {icons.map(function (_a, index) {
            var id = _a.id, IconComponent = _a.component, color = _a.color, shadow = _a.shadow;
            return (<div id={id} key={index} style={__assign({ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 0, flexShrink: 0, position: "relative", gap: "4px", borderRadius: "5.33px", backgroundColor: color, boxShadow: shadow, outline: "none" }, iconSize)}>
          <IconComponent />
        </div>);
        })}
    </div>);
};
var StepTwo = function (_a) {
    var elements = _a.elements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, view = _a.view;
    var _b = useState("Copy"), copyText = _b[0], setCopyText = _b[1];
    return (<div style={{
            display: "flex",
            flexDirection: view === "desktop" ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: view === "desktop" ? "0px" : "8px",
            position: "relative",
            outline: "none",
            boxShadow: "none",
            gap: view === "desktop" ? "16px" : "0px", // Adds space between elements in desktop view
        }}>
      <div style={{
            display: "flex",
            flexDirection: view === "desktop" ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            width: view === "desktop" ? "auto" : "100%",
            gap: "8px",
            outline: "none",
            boxShadow: "none",
        }}>
        <p style={{
            fontSize: view === "desktop" ? "18px" : "14px",
            textAlign: "center",
            color: "white",
            fontWeight: "400",
            outline: "none",
            boxShadow: "none",
            width: "215px",
            margin: "0px",
        }}>
          Thanks for signing up!
        </p>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            outline: "none",
            boxShadow: "none",
        }}>
          <div id="copy-button" style={{
            outline: "none",
            boxShadow: "none",
        }}>
            <button style={{
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
        }}>
              {copyText}
            </button>
          </div>
          <div style={{
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
        }}>
            <p id="domain" style={{
            fontSize: view === "desktop" ? "16px" : "12px",
            fontWeight: "500",
            textAlign: "left",
            color: "white",
            outline: "none",
            boxShadow: "none",
        }}>
              example.com
            </p>
          </div>
        </div>
        <SocialMediaIcons icons={socialMediaIcons} view={view}/>
      </div>

      <div style={{
            display: "flex",
            flexWrap: view === "desktop" ? "nowrap" : "wrap",
            justifyContent: "space-between",
            width: "100%",
            marginTop: view === "desktop" ? "0px" : "8px",
            outline: "none",
            boxShadow: "none",
            gap: view === "desktop" ? "16px" : "0px", // Adds space between elements in desktop view
        }}>
        {elements.map(function (element, index) { return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} view={view} expandedId={undefined} onExpand={function () { }} handleChange={function (setter, type) { return function (e) { }; }}/>); })}
        {hoverIndex === elements.length && (<div key={"hoverIndex-".concat(elements.length)} style={{
                flexShrink: 0,
                width: elementWidth,
                borderRight: "2px solid red",
                outline: "none",
                boxShadow: "none",
            }}/>)}
      </div>
    </div>);
};
export default StepTwo;
