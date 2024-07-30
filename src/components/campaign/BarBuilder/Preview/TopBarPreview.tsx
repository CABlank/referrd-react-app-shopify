import React, { useState, useEffect, useRef, LegacyRef } from "react";
import { ElementProps, TopBarConfig } from "../../CommonComponents/Types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { moveElement } from "../../CommonComponents/MoveElement";
import { useDropWrapper } from "../../CommonComponents/UseDropWrapper";
import { desktopStyle, mobileStyle } from "./Styles";

interface TopBarPreviewProps {
  desktopStepOneElements: ElementProps[];
  setDesktopStepOneElements: React.Dispatch<
    React.SetStateAction<ElementProps[]>
  >;
  mobileStepOneElements: ElementProps[];
  setMobileStepOneElements: React.Dispatch<
    React.SetStateAction<ElementProps[]>
  >;
  desktopStepTwoElements: ElementProps[];
  setDesktopStepTwoElements: React.Dispatch<
    React.SetStateAction<ElementProps[]>
  >;
  mobileStepTwoElements: ElementProps[];
  setMobileStepTwoElements: React.Dispatch<
    React.SetStateAction<ElementProps[]>
  >;
  view: "desktop" | "mobile";
  config: TopBarConfig;
  step: number;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  allowStepChange?: boolean;
  isStepTwoAvailable: boolean;
  enableDragAndDrop: boolean;
  forceMobileView?: boolean;
}

const TopBarPreview: React.FC<TopBarPreviewProps> = ({
  desktopStepOneElements,
  setDesktopStepOneElements,
  mobileStepOneElements,
  setMobileStepOneElements,
  desktopStepTwoElements,
  setDesktopStepTwoElements,
  mobileStepTwoElements,
  setMobileStepTwoElements,
  view: initialView,
  config,
  step,
  setUrl,
  url,
  setStep,
  allowStepChange = false,
  isStepTwoAvailable,
  enableDragAndDrop,
  forceMobileView = false,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [view, setView] = useState<"desktop" | "mobile">(
    forceMobileView ? "mobile" : initialView
  );

  const prevDesktopStepOneLength = useRef(desktopStepOneElements.length);
  const prevDesktopStepTwoLength = useRef(desktopStepTwoElements.length);
  const prevMobileStepOneLength = useRef(mobileStepOneElements.length);
  const prevMobileStepTwoLength = useRef(mobileStepTwoElements.length);

  useEffect(() => {
    if (desktopStepOneElements.length > prevDesktopStepOneLength.current) {
      prevDesktopStepOneLength.current = desktopStepOneElements.length;
    }
  }, [desktopStepOneElements]);

  useEffect(() => {
    if (desktopStepTwoElements.length > prevDesktopStepTwoLength.current) {
      prevDesktopStepTwoLength.current = desktopStepTwoElements.length;
    }
  }, [desktopStepTwoElements]);

  useEffect(() => {
    if (mobileStepOneElements.length > prevMobileStepOneLength.current) {
      prevMobileStepOneLength.current = mobileStepOneElements.length;
    }
  }, [mobileStepOneElements]);

  useEffect(() => {
    if (mobileStepTwoElements.length > prevMobileStepTwoLength.current) {
      prevMobileStepTwoLength.current = mobileStepTwoElements.length;
    }
  }, [mobileStepTwoElements]);

  useEffect(() => {
    if (forceMobileView) {
      setView("mobile");
    } else {
      setView(initialView);
    }
  }, [forceMobileView, initialView]);

  const { isOver, drop, containerRef } = useDropWrapper(
    enableDragAndDrop,
    step,
    view === "desktop" ? desktopStepOneElements : mobileStepOneElements,
    view === "desktop" ? setDesktopStepOneElements : setMobileStepOneElements,
    view === "desktop" ? desktopStepTwoElements : mobileStepTwoElements,
    view === "desktop" ? setDesktopStepTwoElements : setMobileStepTwoElements,
    setHoverIndex,
    hoverIndex
  );

  const currentElements =
    view === "desktop"
      ? step === 1
        ? desktopStepOneElements
        : desktopStepTwoElements
      : step === 1
        ? mobileStepOneElements
        : mobileStepTwoElements;

  const setCurrentElements =
    view === "desktop"
      ? step === 1
        ? setDesktopStepOneElements
        : setDesktopStepTwoElements
      : step === 1
        ? setMobileStepOneElements
        : setMobileStepTwoElements;

  const safeCurrentElements = currentElements || [];

  const elementWidth = `${
    100 / (safeCurrentElements.length + (hoverIndex !== null ? 1 : 0))
  }%`;

  const handleRemoveElement = (elementId: string) => {
    setCurrentElements((prevElements) =>
      prevElements.filter((element) => element.id !== elementId)
    );
  };

  useEffect(() => {}, [url]);

  useEffect(() => {
    const handleResize = () => {
      if (!forceMobileView) {
        const currentWidth = window.innerWidth;
        if (currentWidth <= 767) {
          setView("mobile");
        } else {
          setView("desktop");
        }
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [view, forceMobileView]);

  useEffect(() => {}, [view]);

  useEffect(() => {
    if (forceMobileView) {
      setView("mobile");
    }
  }, [forceMobileView]);

  useEffect(() => {}, [view, config]);

  return (
    <div
      ref={drop as unknown as LegacyRef<HTMLDivElement>}
      className={`top-bar-preview px-2 flex items-center relative ${
        isOver ? "bg-gray-100" : ""
      }`}
      style={view === "desktop" ? desktopStyle(config) : mobileStyle(config)}
    >
      <div
        className="flex h-full items-center justify-center gap-4"
        ref={containerRef}
        style={{
          flexWrap: "nowrap",
          width: "100%",
          overflowX: view === "desktop" ? "auto" : "hidden",
          overflowY: "hidden",
        }}
      >
        {step === 1 && (
          <StepOne
            elements={safeCurrentElements}
            setElements={setCurrentElements}
            moveElement={(dragIndex, hoverIndex) =>
              moveElement(
                safeCurrentElements,
                setCurrentElements,
                dragIndex,
                hoverIndex
              )
            }
            hoverIndex={hoverIndex}
            elementWidth={elementWidth}
            onRemove={handleRemoveElement}
            view={view}
            setUrl={setUrl}
            setStep={setStep}
            allowStepChange={allowStepChange}
            enableDragAndDrop={enableDragAndDrop}
          />
        )}
        {step === 2 && (isStepTwoAvailable || allowStepChange) && (
          <StepTwo
            elements={safeCurrentElements}
            setElements={setCurrentElements}
            moveElement={(dragIndex, hoverIndex) =>
              moveElement(
                safeCurrentElements,
                setCurrentElements,
                dragIndex,
                hoverIndex
              )
            }
            hoverIndex={hoverIndex}
            elementWidth={elementWidth}
            onRemove={handleRemoveElement}
            view={view}
            url={url}
            onClose={() => setStep(1)}
          />
        )}
      </div>
    </div>
  );
};

export default TopBarPreview;
