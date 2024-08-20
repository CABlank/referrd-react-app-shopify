import React from "react";
import ElementWrapper from "../../CommonComponents/ElementWrapper";
import ReferAndEarn from "./ReferAndEarn";
var StepOne = function (_a) {
    var elements = _a.elements, setElements = _a.setElements, moveElement = _a.moveElement, hoverIndex = _a.hoverIndex, elementWidth = _a.elementWidth, onRemove = _a.onRemove, imagePosition = _a.imagePosition, view = _a.view, setUrl = _a.setUrl, setStep = _a.setStep;
    var imageElement = elements.find(function (element) { return element.type === "image"; });
    return (<ReferAndEarn imagePosition={imagePosition} imageUrl={imageElement === null || imageElement === void 0 ? void 0 : imageElement.imageUrl} imageProps={imageElement} view={view} onClose={function () { return setStep(0); }}>
      <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "8px",
            position: "relative",
        }}>
        {elements
            .filter(function (element) { return element.type !== "image"; })
            .map(function (element, index) { return (<ElementWrapper key={element.id} index={index} element={element} moveElement={moveElement} elementWidth={elementWidth} hoverIndex={hoverIndex} onRemove={onRemove} showRemoveButton={false} enableDragAndDrop={true} view={"desktop"} expandedId={undefined} onExpand={function (id) {
                throw new Error("Function not implemented.");
            }} handleChange={function (setter, type) {
                throw new Error("Function not implemented.");
            }}/>); })}
        {hoverIndex === elements.length && (<div style={{
                width: elementWidth,
                borderRight: "0px solid red",
                flexShrink: 0,
            }}/>)}
      </div>
    </ReferAndEarn>);
};
export default StepOne;
