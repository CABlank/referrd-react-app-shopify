import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../CommonComponents/Types";
import ImageElement from "../../CommonComponents/ImageElement";
import ExpandableInput from "./ExpandableInput";
var ReferAndEarn = function (_a) {
    var imagePosition = _a.imagePosition, children = _a.children, imageUrl = _a.imageUrl, _b = _a.imageProps, imageProps = _b === void 0 ? {} : _b, view = _a.view;
    var _c = useState(""), name = _c[0], setName = _c[1];
    var _d = useState(""), email = _d[0], setEmail = _d[1];
    var _e = useState(""), number = _e[0], setNumber = _e[1];
    var _f = useState(null), isExpanded = _f[0], setIsExpanded = _f[1];
    var handleFocus = function (field) {
        setIsExpanded(field);
    };
    var handleBlur = function () {
        setIsExpanded(null);
    };
    var _g = useDrop({
        accept: ItemTypes.IMAGE,
        drop: function (item) { },
        collect: function (monitor) { return ({
            isOver: monitor.isOver(),
        }); },
    }), isOver = _g[0].isOver, drop = _g[1];
    var shouldRenderContent = true; // Replace with your actual conditional logic
    var defaultImageProps = {
        imageWidth: "100%",
        imageHeight: "100%",
        borderRadius: "0",
        objectFit: "cover",
        centerImage: false,
    };
    // Function to render the inner content
    var renderInnerContent = function () {
        return (<>
        {imagePosition !== "None" && (<div ref={drop} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    width: view === "mobile" ? "100%" : "50%",
                    height: view === "mobile" ? "16rem" : "100%",
                    order: view === "mobile"
                        ? imagePosition === "Left"
                            ? 1
                            : 2
                        : imagePosition === "Left"
                            ? 1
                            : 2,
                    border: isOver ? "2px dashed #ccc" : "0px solid transparent",
                    outline: "none",
                    boxShadow: "none",
                }}>
            {imageUrl ? (<ImageElement id={""} type={"image"} imageUrl={imageUrl} {...defaultImageProps} {...imageProps}/>) : (<div style={{ color: "#A3A3A3", outline: "none", boxShadow: "none" }}>
                Drag and drop an image here
              </div>)}
          </div>)}

        <div style={{
                display: "flex",
                flexDirection: "inherit",
                width: view === "mobile"
                    ? "100%"
                    : imagePosition === "None"
                        ? "100%"
                        : "50%",
                justifyContent: "center",
                alignItems: "center",
                order: 1,
                outline: "none",
                boxShadow: "none",
            }}>
          <form method="post" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "1rem",
                outline: "none",
                boxShadow: "none",
            }}>
            <div style={{
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
            }}>
              <div style={{
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
            }}>
                {children}
              </div>
            </div>
            <div style={{
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
            }}>
              <ExpandableInput type="text" name="name" value={name} placeholder="Name" onChange={function (e) { return setName(e.target.value); }} isExpanded={isExpanded === "name"} onFocus={function () { return handleFocus("name"); }} onBlur={handleBlur} style={{
                outline: "none",
                boxShadow: "none",
            }}/>
              <ExpandableInput name="email" type="email" value={email} placeholder="Email" onChange={function (e) { return setEmail(e.target.value); }} isExpanded={isExpanded === "email"} onFocus={function () { return handleFocus("email"); }} onBlur={handleBlur} style={{
                outline: "none",
                boxShadow: "none",
            }}/>
              <ExpandableInput name="number" type="tel" value={number} placeholder="Phone" onChange={function (e) { return setNumber(e.target.value); }} isExpanded={isExpanded === "number"} onFocus={function () { return handleFocus("number"); }} onBlur={handleBlur} style={{
                outline: "none",
                boxShadow: "none",
            }}/>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                gap: "16px",
                paddingTop: "0.625rem",
                outline: "none",
                boxShadow: "none",
            }}>
              <button id="submit-button" style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch",
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
                outline: "none",
                boxShadow: "none",
                border: "none",
            }}>
                <span style={{
                flexGrow: 0,
                flexShrink: 0,
                textAlign: "center",
                color: "white",
                fontSize: view === "mobile" ? "0.875rem" : "1rem",
                fontWeight: "500",
                outline: "none",
                boxShadow: "none",
            }}>
                  Submit
                </span>
              </button>
            </div>
          </form>
        </div>
      </>);
    };
    return (<div style={{
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
        }}>
      {shouldRenderContent && renderInnerContent()}
    </div>);
};
export default ReferAndEarn;
